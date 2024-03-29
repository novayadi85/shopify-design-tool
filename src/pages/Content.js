import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import { Spinner } from "@shopify/polaris";
import SmoothRender from 'react-smooth-render';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { iframeStyle } from '@styles/Iframe';
import { toCSS } from 'cssjson';
import { ReactLiquid, liquidEngine  } from 'react-liquid'
import { discounts, toFixedNumber } from "@helper/price";
import { parseJSON } from "@helper/json";
import { decodeHTML } from "@helper/html";
import { serviceUrl } from "@helper/url";
import { setLiquid } from "@store/product/action";
import { formatMoney } from "@helper/price";
import engine from "../helper/template";
import { dropdownHTML, stringToHTML } from "../helper/html";

const SimpleContent = (props) => {
    const urlParams = useParams();
    const dispatch = useDispatch();
    const _state = useSelector(state => state);
    const { styles: { items: _styles, mobile: _mobile_styles } } = _state;
    const [state, setState] = useState(_state);
    const [_items, setItems] = useState([]);
    const [pageId, setpageId] = useState(null);
    const [currency, setCurrency] = useState(true);
    const [sections, setSections] = useState([]);
    const [styles, setStyles] = useState(_styles);
    const [mobile_styles, setMobStyles] = useState(_mobile_styles);
    const [products, setProducts] = useState({});
    const [templateId, setTemplateId] = useState(null);
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(pageId ? pageId : urlParams?.page)
    const [templateOffer, setTemplate] = useState(null);
    const [received, setReceived] = useState(null);

    const onMessageReceivedFromIframe = React.useCallback(
        event => {
            console.log("onMessageReceivedFromIframe", state, event);
            const { page: pg } = urlParams;
            const { data } = event;
           // console.log('STATES', data)
            setLoading(true)
            setReceived(data)
            try {
                const _data = JSON.parse(data)
                const { products: { items, page: pageId, templateId, store: currency, liquid: liquidCode }, template: { items: sections }, styles: { items: styles, mobile: cssMobile } } = _data;
                //console.log(liquidCode)
                console.log('STATES', _data)
                setItems(items);
                setpageId(pageId);
                setTemplateId(templateId);
                setCurrency(currency);
                setSections(sections);
                setStyles(styles);
                setMobStyles(cssMobile);
                
                renderPage(items).then(() => {
                    // updateLiquid(sections)
                });
            }
            catch (err) {
                setLoading(false)
               // console.log('err', err)
            }
            
            
            setPage(pg)
        },
        [state, urlParams]
    );

    useEffect(() => {
        window.addEventListener("message", onMessageReceivedFromIframe);
        return () => window.removeEventListener("message", onMessageReceivedFromIframe);
    }, [onMessageReceivedFromIframe]);
    

    useEffect(() => {
        // console.log('USE EFFECT', items)
        if (received) {
            const _data = JSON.parse(received)
            const { products: { items, page: pageId, templateId, store: currency, liquid: liquidCode }, template: { items: sections }, styles: { items: styles, mobile: cssMobile } } = _data;
            setItems(items);
            console.log('USE EFFECT', _items)
        }
       

    }, [received]);

    const renderPage = async (items) => {
        let _products = [];
        let lang = 'en';
        let params = {};

        if (items.length) {
            const { offer = {}, template: templateActive, sample} = items[0];
            let template = Object.values(offer).find(item => {
                return item.id === page
            })

            setTemplate(templateActive);
            let totalNormalPrice = 0,
                totalOfferPrice = 0,
                totalOfferSave = 0;
            
            let _newProducts = [];

            if (template?.group_type) {
                switch (template.group_type) {
                    case 'free-product':
                        const lists = JSON.parse(template.freeProducts);
                        _newProducts = await Promise.all(Object.values(lists).map(async (prod) => {
                            const { handle: list, qty } = prod;
                            let _product = await simulateFetchData(prod.id);
                            _product.price = Number(_product.variants[0].price) * 100
                            _product.variantBlock = '';
                            _product.selectVariants = '';
                            _product.addToCart = '';
                        
                            _product.featured_image = '';
                            if (_product?.images && _product.images.length >= 0) {
                                _product.featured_image = _product.images[0]?.src
                            }

                            return {
                                ..._product,
                                ...{
                                    quantity: qty,
                                    productQuantity: qty,
                                    specialPrice: _product.price,
                                    totalOfferSaveInProcent: toFixedNumber(100, 2),
                                    totalOfferSave: _product.price * qty,
                                    offerPrice: _product.price,
                                    selectVariants: '',
                                    totalOfferPrice: ((_product.price * qty) / 100),
                                    totalNormalPrice: _product.price * Number(qty) / 100,
                                    addToCart: '',
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    productOfferSaveInProcent: `${toFixedNumber(100, 2)}%`
                                },
                                offerId: template.id
                            };
                        }));

                        _products = _newProducts;

                        break;
                
                    case 'tier':
                        _newProducts = await Promise.all(template.childs.map(async (child) => {
                            const { products: _tierProduct } = child;
                            const tierProduct = JSON.parse(_tierProduct);
                            let _product = await simulateFetchData(tierProduct.id);
                        
                            _product.price = Number(_product.variants[0].price) * 100
                            let prices = await (discounts({
                                quantity: tierProduct.qty,
                                specialPrice: tierProduct.specialPrice,
                                priceType: child.value_type,
                                groupType: child.group_type,
                                price: _product.price
                            }));

                            _product.variantBlock = '';
                            _product.selectVariants = '';
                            _product.addToCart = '';
                            template.addToCart = await engine.parseAndRender(`<div class="shopadjust__buttons">
                                <div class="shopadjust-modal_product_add_toCart">
                                    {{product.variantBlock}}
                                    <a class="shopadjust-btn-add-offer-${template.group_type}"><span class="label">%label%</span></a>
                                </div>
                            </div>`, {
                                product: _product
                            }).then(html => html);

                            let dropdown = '';
                        
                            if (_product.variants.length > 0) {
                                dropdown = await renderTemplate(dropdownHTML, {
                                    product: _product,
                                    name: "product-variants",
                                    quantity: tierProduct.qty,
                                    type: template.group_type
                                });
                            }
                        
                        
                            let renderButtonHtml = await renderTemplate(await renderButton({
                                ...template,
                                ...{
                                    group_type: template.group_type,
                                    id: template.id
                                }
                            }), {
                                BuyNow: "Buy It NOW"
                            }).then(html => {
                                return html + dropdown;

                            });
                    
                            return {
                                ..._product,
                                ...{
                                    quantity: tierProduct.qty,
                                    productQuantity: tierProduct.qty,
                                    specialPrice: tierProduct.specialPrice,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    totalOfferSave: prices.totalOfferSave,
                                    offerPrice: child.specialPrice,
                                    selectVariants: dropdown,
                                    totalOfferPrice: (prices.totalOfferPrice / 100),
                                    totalNormalPrice: _product.price * Number(tierProduct.qty) / 100,
                                    addToCart: renderButtonHtml,
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`
                                },
                                offerId: template.id
                            };
                        }))

                        _products = _newProducts
                        break;
                
                    case 'collect_volume_off':
                        let collections = JSON.parse(template.collections);
                        const { product: _childs, discount, discount_type, collection_in_products } = collections;
                        const extra_conditions = JSON.parse(template.extra_conditions);

                        let _product = await simulateFetchData(collection_in_products[0]);
                        _product.price = Number(_product.variants[0].price) * 100

                        let products = [];
                        for (const [index, child] of Object.entries(_childs)) {
                            _product.price = Number(_product.variants[0].price) * 100
                            let prices = await (discounts({
                                quantity: child,
                                specialPrice: discount,
                                priceType: template.value_type,
                                groupType: template.group_type,
                                price: _product.price
                            }));

                            _product.variantBlock = '';
                            _product.selectVariants = '';
                            _product.addToCart = '';
                            template.addToCart = await engine.parseAndRender(`<div class="shopadjust__buttons">
                                    <div class="shopadjust-modal_product_add_toCart">
                                        {{product.variantBlock}}
                                        <a class="shopadjust-btn-add-offer-${template.group_type}"><span class="label">%label%</span></a>
                                    </div>
                                </div>`, {
                                product: _product
                            }).then(html => html);

                            let dropdown = '';
                            
                            if (_product.variants.length > 0) {
                                dropdown = await renderTemplate(dropdownHTML, {
                                    product: _product,
                                    name: "product-variants",
                                    quantity: child,
                                    type: template.group_type
                                });
                            }
                            
                            
                            let renderButtonHtml = await renderTemplate(await renderButton({
                                ...template,
                                ...{
                                    group_type: template.group_type,
                                    id: template.id
                                }
                            }), {
                                BuyNow: "Buy It NOW"
                            }).then(html => {
                                return html + dropdown;

                            });

                            products.push({
                                ..._product,
                                ...{
                                    quantity: child,
                                    specialPrice: discount,
                                    offerPrice: prices.offerPrice,
                                    OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    selectVariants: dropdown,
                                    totalOfferPrice: (prices.totalOfferPrice / 100),
                                    addToCart: renderButtonHtml,
                                    normalPrice: (_product.price / 100) * parseFloat(child),
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    image: _product?.media ? _product.media[0] : '',
                                    productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
                                    
                                    
                                },
                                offerId: template.id
                            })
                        }
                        
                        for (const [index, child] of Object.entries(extra_conditions)) {
                            if (child.quantity && child.discount) {
                                let prices = await (discounts({
                                    quantity: child.quantity,
                                    specialPrice: child.discount,
                                    priceType: discount_type,
                                    groupType: template.group_type,
                                    price: _product.price
                                }));

                                _product.variantBlock = '';
                                _product.selectVariants = '';
                                _product.addToCart = '';
                                template.addToCart = await engine.parseAndRender(`<div class="shopadjust__buttons">
                                        <div class="shopadjust-modal_product_add_toCart">
                                            {{product.variantBlock}}
                                            <a class="shopadjust-btn-add-offer-${template.group_type}"><span class="label">%label%</span></a>
                                        </div>
                                    </div>`, {
                                    product: _product
                                }).then(html => html);

                                let dropdown = '';
                                
                                if (_product.variants.length > 0) {
                                    dropdown = await renderTemplate(dropdownHTML, {
                                        product: _product,
                                        name: "product-variants",
                                        quantity: child.quantity,
                                        type: template.group_type
                                    });
                                }
                                
                                
                                let renderButtonHtml = await renderTemplate(await renderButton({
                                    ...template,
                                    ...{
                                        group_type: template.group_type,
                                        id: template.id
                                    }
                                }), {
                                    BuyNow: "Buy It NOW"
                                }).then(html => {
                                    return html + dropdown;

                                });

                                products.push({
                                    ..._product,
                                    ...{
                                        quantity: child.quantity,
                                        productQuantity: child.quantity,
                                        specialPrice: child.discount,
                                        totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                        offerPrice: prices.totalOfferSave,
                                        totalOfferSave: prices.totalOfferSave,
                                        totalNormalPrice: _product.price * Number(child.quantity) / 100,
                                        normalPrice:  _product.price * Number(child.quantity) / 100,
                                        selectVariants: dropdown,
                                        totalOfferPrice: prices.totalOfferPrice / 100,
                                        addToCart: renderButtonHtml,
                                        imageHtml: "<img src='" + _product.featured_image + "'>",
                                        productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`
                                    },
                                    offerId: offer.id
                                })
                            }
                            
                        }
                    
                        //console.log('products' , products)
                        _products = products
                        break;
                
                    case 'crossell':
                        //extra_free_products
                        const { extra_free_products, upsell_data } = template;
                        let _extra_free_products = (parseJSON(extra_free_products));
                    
                        if (upsell_data) {
                            const { statement } = upsell_data;
                        
                            _products = await Promise.all(statement['statement-condition-list'].slice(0, statement['statement-condition-list'].length).map(async (handle, index) => {
                                const discs = statement['statement-condition-amount']
                                const discount_types = statement['cross_type_discount'];
                                let _product = await simulateFetchData(handle);
                                _product.price = Number(_product.variants[0].price) * 100;
                            
                                const disc = discs[index];
                                const disc_type = discount_types[index];

                                let amount_discount = parseFloat(disc) > 0 ? parseFloat(disc) : 0;

                                if (disc_type === "pct") {
                                    amount_discount = (_product.price / 100) * disc;
                                }

                                let final_discount = (_product.price - amount_discount);
                                _product.finalPrice = final_discount > 0 ? final_discount : 0;

                                _product.featured_image = '';
                                if (_product?.images && _product.images.length >= 0) {
                                    _product.featured_image = _product.images[0]?.src
                                }

                                _product.variantBlock = '';
                                _product.selectVariants = '';
                                _product.addToCart = '';
                                template.addToCart = await engine.parseAndRender(`<div class="shopadjust__buttons">
                                    <div class="shopadjust-modal_product_add_toCart">
                                        {{product.variantBlock}}
                                        <a class="shopadjust-btn-add-offer-${template.group_type}"><span class="label">%label%</span></a>
                                    </div>
                                </div>`, {
                                    product: _product
                                }).then(html => html);

                                let dropdown = '';
                            
                                if (_product.variants.length > 0) {
                                    dropdown = await renderTemplate(dropdownHTML, {
                                        product: _product,
                                        name: "product-variants",
                                        quantity: 1,
                                        type: template.group_type
                                    });
                                }
                            
                            
                                let renderButtonHtml = await renderTemplate(await renderButton({
                                    ...template,
                                    ...{
                                        group_type: template.group_type,
                                        id: template.id
                                    }
                                }), {
                                    BuyNow: "Buy It NOW"
                                }).then(html => {
                                    return html + dropdown;

                                });

                                return {
                                    ..._product,
                                    quantity: 1,
                                    specialPrice: _product.price - _product.finalPrice,
                                    offerPrice: _product.finalPrice,
                                    OfferSave: _product.price - _product.finalPrice,
                                    addToCart: renderButtonHtml,
                                    normalPrice: (_product.price) * parseFloat(1),
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    image: _product?.media ? _product.media[0] : '',
                                    productOfferSaveInProcent: `${toFixedNumber(((_product.price - _product.finalPrice) / _product.price) * 100, 2)}%`,
                                }
                            }))
                        }
                   
                        // console.log('_extra_free_products', _products)

                        break;
                
                    case 'amount_off':
                    case 'discount_product':
                    case 'discount_product_collection':
                        const { extra_config, collections: __collections } = template;
                        let __parseCollections = (parseJSON(__collections))
                        let _extra_config = (parseJSON(extra_config))
                        const { collection_in_products: _collection_in_products, discount: discs } = __parseCollections;
                    
                        let size = 4;
                        params['headline'] = _extra_config?.other_offer_collections_title ? _extra_config.other_offer_collections_title : offer['headline']
                        params['description'] = _extra_config?.other_offer_collections_decription ? _extra_config.other_offer_collections_decription : offer['description']
                        template[`headline_${lang}`] = params['headline'] ? params['headline'] : template[`headline_${lang}`]
                        template[`description_${lang}`] = params['description'] ? params['description'] : template[`description_${lang}`]
                    
                        template.link = `/collections/${__parseCollections?.handle}`;
                        template.textButton = _extra_config?.other_offer_collections_button_text && _extra_config.other_offer_collections_button_text !== '' ? _extra_config.other_offer_collections_button_text : 'See collection'

                        let __products = [];
                        if (_extra_config?.other_offer_collections && _extra_config['other_offer_collections'].includes('true')) {
                            __products = await Promise.all(_collection_in_products.slice(0, size).map(async handle => {
                                let _product = await simulateFetchData(handle);
                                _product.price = Number(_product.variants[0].price) * 100;
                                let prices = await (discounts({
                                    quantity: 1,
                                    specialPrice: discs,
                                    priceType: template.value_type,
                                    groupType: template.group_type,
                                    price: _product.price
                                }));

                                _product.featured_image = '';
                                if (_product?.images && _product.images.length >= 0) {
                                    _product.featured_image = _product.images[0]?.src
                                }

                                _product.variantBlock = '';
                                _product.selectVariants = '';
                                _product.addToCart = '';
                                template.addToCart = await engine.parseAndRender(`<div class="shopadjust__buttons">
                                    <div class="shopadjust-modal_product_add_toCart">
                                        {{product.variantBlock}}
                                        <a class="shopadjust-btn-add-offer-${template.group_type}"><span class="label">%label%</span></a>
                                    </div>
                                </div>`, {
                                    product: _product
                                }).then(html => html);

                                let dropdown = '';
                            
                                if (_product.variants.length > 0) {
                                    dropdown = await renderTemplate(dropdownHTML, {
                                        product: _product,
                                        name: "product-variants",
                                        quantity: 1,
                                        type: template.group_type
                                    });
                                }
                            
                            
                                let renderButtonHtml = await renderTemplate(await renderButton({
                                    ...template,
                                    ...{
                                        group_type: template.group_type,
                                        id: template.id
                                    }
                                }), {
                                    BuyNow: "Buy It NOW"
                                }).then(html => {
                                    return html + dropdown;

                                });

                                return {
                                    ..._product,
                                    quantity: 1,
                                    specialPrice: discs,
                                    offerPrice: prices.offerPrice ,
                                    OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    selectVariants: '',
                                    totalOfferPrice: (prices.totalOfferPrice ),
                                    addToCart: renderButtonHtml,
                                    normalPrice: (_product.price ) * parseFloat(1),
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    image: _product?.media ? _product.media[0] : '',
                                    productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
                                }
                            
                            }))

                            _products = __products
                        }
                        break;
                
                    default:
                        try {
                            const productOffers = JSON.parse(template.products);
                            // console.log('productOffers', productOffers)
                            _products = await Promise.all(productOffers.map(async (child) => {
                                const { id } = child;
                                let _product = await simulateFetchData(id);
                                _product.price = _product.variants[0].price
                                _product.price = parseFloat(_product.price) * 100;
                                let prices = await (discounts({
                                    quantity: child.qty,
                                    specialPrice: child.specialPrice,
                                    priceType: template.value_type,
                                    groupType: template.group_type,
                                    price: _product.price,
                                }));


                                _product.featured_image = '';
                                if (_product?.images && _product.images.length >= 0) {
                                    _product.featured_image = _product.images[0]?.src
                                    // imageHtml = "<img src='" + _product?.featured_image ? _product.featured_image : featured_image + "'>",
                                }

                                _product.variantBlock = '';
                                _product.selectVariants = '';
                                _product.addToCart = '';

                                template.addToCart = await engine.parseAndRender(`<div class="shopadjust-item-${template.group_type}-1-buy-button">
                                    <a data-id="{{id}}" style='color: inherit;text-decoration: none;' href="#" data-component="addToCart" class="shopadjust-product-offer-add-cart-tier all-in-one-offer-button-${template.group_type}-1-all">
                                        <div class="all-in-one-offer-button-${template.group_type}-1">
                                            <div class="all-in-one-offer-${template.group_type}-1-top-button"><span class="label">%label%</span></div>
                                        </div>
                                    </a>
                                </div>`, {
                                    product: _product
                                }).then(html => html);

                            
                               // console.log('__products', _product)

                                let dropdown = '';
                            
                                if (_product.variants.length > 0) {
                                    dropdown = await renderTemplate(dropdownHTML, {
                                        product: _product,
                                        name: "product-variants",
                                        quantity: 1,
                                        type: template.group_type
                                    });
                                }
                            
                            
                                let renderButtonHtml = await renderTemplate(await renderButton({
                                    ...template,
                                    ...{
                                        group_type: template.group_type,
                                        id: template.id
                                    }
                                }), {
                                    BuyNow: "Buy It NOW"
                                }).then(html => {
                                    return html + dropdown;

                                });


                                return {
                                    ..._product,
                                    ...{
                                        quantity: child.qty,
                                        specialPrice: child.specialPrice,
                                        offerPrice: prices.offerPrice * 100,
                                        OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                        totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                        selectVariants: dropdown,
                                        totalOfferPrice: (prices.totalOfferPrice),
                                        addToCart: renderButtonHtml,
                                        normalPrice: (_product.price) * parseFloat(child.qty),
                                        imageHtml: "<img src='" + _product.featured_image + "'>",
                                        image: _product?.media ? _product.media[0] : '',
                                        productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
                                    
                                    
                                    },
                                    offerId: template.id
                                }
                            }))
                        }
                        catch (err) {
                        
                        }
                    
                    break;
                }

            }
            else {
                template = sample;
                _products = sample['products'];
            }

            _products.forEach(t => {
                totalNormalPrice += t?.normalPrice ? parseFloat(t.normalPrice) : 0;
            });

            
            _products.forEach(t => {
                totalOfferPrice += t?.offerPrice ? parseFloat(t.offerPrice) : 0;
            });

            
            _products.forEach(t => {
                totalOfferSave += t?.OfferSave ? parseFloat(t.OfferSave) * 100 : 0;
            });
        

            params = {
                ...template,
                products: _products,
                addToCart: template?.addToCart ?? "Add To cart",
                headline: parseJSON(template[`headline_${lang}`]),
                description: decodeHTML(parseJSON(template[`description_${lang}`])),
                totalNormalPrice: totalNormalPrice,
                totalOfferPrice: totalOfferPrice,
                totalOfferSave: totalOfferSave,
                BuyNow: "Buy It NOW",
                link: template?.link 
            }

            if (params?.totalNormalPrice && params?.totalOfferSave) {
                let _totalOfferSaveInProcent = parseFloat(params.totalOfferSave) / parseFloat(params.totalNormalPrice);
                if (_totalOfferSaveInProcent > 0) {
                    params.totalOfferSaveInProcent = `${toFixedNumber(parseInt(_totalOfferSaveInProcent * 100), 2)}%`
                }
            }
                

           // console.log(params);
            
            try {
                params['offer_text_product_top'] = parseJSON(params['offer_text_product_top']);
                params['offer_text_cart_product_accomplished'] = parseJSON(params['offer_text_cart_product_accomplished']);
                params['offer_text_cart_product_not_accomplished'] = parseJSON(params['offer_text_cart_product_not_accomplished']);
                params['offer_text_cart_top_accomplished'] = parseJSON(params['offer_text_cart_top_accomplished']);
                params['offer_text_collection_top'] = parseJSON(params['offer_text_collection_top']);
                params['offer_text_cart_top_not_accomplished'] = parseJSON(params['offer_text_cart_top_not_accomplished']);
            }
            catch (err) {
                //console.log(err)
            }


            params['offer_text_product_top'] = params['offer_text_product_top'] !== '' ? params['offer_text_product_top'] : 'Product Top Text';
            params['offer_text_cart_product_accomplished'] = params['offer_text_cart_product_accomplished'] !== '' ? params['offer_text_cart_product_accomplished'] : 'Cart product text - offer accomplished';
            params['offer_text_cart_product_not_accomplished'] = params['offer_text_cart_product_not_accomplished'] !== '' ? params['offer_text_cart_product_not_accomplished'] : 'Cart text - offer not accomplished';
            params['offer_text_cart_top_accomplished'] = params['offer_text_cart_top_accomplished'] !== '' ? params['offer_text_cart_top_accomplished'] : 'Cart Top text - offer accomplished';
            params['offer_text_cart_top_not_accomplished'] = params['offer_text_cart_top_not_accomplished'] !== '' ? params['offer_text_cart_top_not_accomplished'] : 'Cart Top text - offer not accomplished';
            params['offer_text_collection_top'] = params['offer_text_collection_top'] !== '' ? params['offer_text_collection_top'] : 'Offer text - Top Collection';
            
        }

        setProducts(params)
        return params
    }

    const convertCssItem = ({mobile, items}, page) => {
        let jsonObject = {
            children: {}
        };

        Object.keys(items).forEach(key => {
            let item = items[key];
            jsonObject['children'][`.${item.ID}`] = {
                "attributes": getCssString(item.items)
            }
            
        })

        let mobileJSONCSS = {
            children: {
                ".shopadjust---item": {
                    "children": {},
                    "attributes": {
                        "width": "100%",
                    }
                }
            }
        };

        Object.keys(mobile).forEach(key => {
            let item = mobile[key];
            mobileJSONCSS['children'][`.${item.ID}`] = {
                "attributes": getCssString(item.items)
            }
            
        })

        let jsonMobile = {
            children: {
                "@media (max-width: 480px)": mobileJSONCSS
            }
        };

        const cssDesktop = toCSS(jsonObject);
        const cssMobile = toCSS(jsonMobile);
        return cssDesktop + cssMobile
    }


    const getCssString = (string) => {
        let newObject = {};
        let skip = ['background-type', 'box-shadow-x', 'box-shadow-y', 'box-shadow-blur', 'box-shadow-width', 'box-shadow-color', 'border-type', 'background-opacity'];
        if (string) {
            
            let shadow = '{box-shadow-x} {box-shadow-y} {box-shadow-blur} {box-shadow-width} {box-shadow-color}';
            Object.keys(string).forEach(key => {
                if (!skip.includes(key)) {
                    newObject[key] = string[key];
                }
                if (['box-shadow-x', 'box-shadow-y','box-shadow-blur', 'box-shadow-width', 'box-shadow-color'].includes(key)) {
                    shadow = shadow.replace(`{${key}}`, string[key])
                }

                if ('border-type' === key) {
                    switch (string[key]) {
                        case 'left':
                            newObject['border-right'] = 'none !important';
                            newObject['border-bottom'] = 'none !important';
                            newObject['border-top'] = 'none !important';
                            break;
                        case 'bottom':
                            newObject['border-right'] = 'none !important';
                            newObject['border-left'] = 'none !important';
                            newObject['border-top'] = 'none !important';
                            break;
                        
                        case 'right':
                            newObject['border-left'] = 'none !important';
                            newObject['border-bottom'] = 'none !important';
                            newObject['border-top'] = 'none !important';
                            break;
                        
                        case 'top':
                            newObject['border-right'] = 'none !important';
                            newObject['border-left'] = 'none !important';
                            newObject['border-bottom'] = 'none !important';
                            break;
                        case 'none':
                            newObject['border-right'] = 'none !important';
                            newObject['border-left'] = 'none !important';
                            newObject['border-bottom'] = 'none !important';
                            newObject['border-top'] = 'none !important';
                            break;
                        default:
                            break;
                    }
                }

                if ('background-type' === key && string[key] === 'none') {
                    newObject['background-color'] = 'none !important';
                    newObject['background'] = 'none !important';
                }

            });

            newObject['box-shadow'] = shadow;

        }

        return newObject;
    }

    const renderButton = (offer) => {
        const { group_type } = offer;
        let btn = `<a href="" data-component="addToCart" data-id="${offer.id}" class="shopadjust-product-offer-add-cart-${group_type}\">{{'Add to cart' | translate}}</a>`;
        if (group_type === "tier") {
            btn = `<a href="" data-component="addToCart" data-id="${offer.id}" class="shopadjust-product-offer-add-cart-${group_type}\">{{'Add $quantity to cart' | translate }}</a>`;
        }
        
        return engine.parseAndRender(btn);
    }

    const renderTemplate = async(html, params) => {
        let source = decodeHTML(html);
        engine.params = params;
        return engine.parseAndRender(source, params);
    }

    const simulateFetchData = async (allowProduct) => {
        const url = serviceUrl('product');
        let localProducts = localStorage.getItem('sa-products') ? JSON.parse(localStorage.getItem('sa-products')) : {};
        if (localProducts[allowProduct]) return localProducts[allowProduct];

        return fetch(`${url}&id=${allowProduct}`)
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                localProducts[response.id] =  response ;
                localStorage.setItem('sa-products', JSON.stringify(localProducts));
                return response
            });
    }

    const renderChildrenLIQUID = (section, templateId) => {
        const { ID, items = [] , setting: sectionSetting } = section;
        if (items.length) {
            
            const rows = {};
            let set = 0;
            items.forEach((item) => {
                const { setting } = item;
                if (setting?.column) {
                    if (setting.column === 'column3') {
                        set = set + 1;
                        if (!rows[set]) rows[set] = {}
                        if (!rows[set][0]) rows[set][0] = []
                        item.className = 'fullWidth';
                        rows[set][0].push(item);
                        set = set + 1;
                    }
                    else {
                        if (!rows[set]) {
                            rows[set] = {}
                            rows[set][0] = [];
                            rows[set][1] = [];
                        }
                        
                        let colNumber = 0;
                        if (setting.column === 'column1') {
                            item.className = 'columnLeft';
                            colNumber = 0;
                        }
 
                        if (setting.column === 'column2') {
                            item.className = 'columnRight';
                            colNumber = 1;
                        }
                        
                        if (!rows[set][colNumber]) rows[set][colNumber] = []
                        rows[set][colNumber].push(item);
                    }
                    

                }
            })
            return (
                <>
                    <div className={`grid-display sa-section-${templateId} sa-grid-section-${ID}`}>
                        {Object.keys(rows).map((index) => {
                            let rootClass = "";
                            if (Object.values(rows[index]).length === 1) rootClass = 'root-columnFullWidth';
                            let styles = { gridTemplateColumns : `${sectionSetting?.widthColumn1 ?? '50%'} ${sectionSetting?.widthColumn2 ?? '50%'}` };    

                            if (rootClass === 'root-columnFullWidth') styles = {}
                            if(templateId === 'upsell-product-page') styles = { gridTemplateColumns : `35px ${sectionSetting?.widthColumn1 ?? '50%'} ${sectionSetting?.widthColumn2 ?? '50%'}` };    

                            return (
                                <div key={`grid-${index}`} className={`grid-row ${rootClass}`} style={styles}>
                                {templateId === 'upsell-product-page' ? ('<input data-component="crosellInput" data-offer="{{offerid}}" type="checkbox" value="{{product.variants[0].id}}" data-product="{{product.id}}">') : (null)}
                                {
                                    Object.keys(rows[index]).map(columnIndex => {
                                        let columns = rows[index][columnIndex];
                                        // console.log('columns', Object.values(rows[index]).length)
                                        let className = (columnIndex === "0") ? "root-columnLeft" : "root-columnRight";
                                        if(Object.values(rows[index]).length === 1) className = 'root-columnFullWidth'
                                        return <div key={ `grid-child-${columnIndex}`} className={`grid-column column-${className}`}>
                                            {columns.map((col, colIndex) => {
                                                return (
                                                    <div data-click={`/block/${col.ID}`} key={ `colIndex-${colIndex}`} className={`grid-column-rows rows-index${colIndex } ${col?.className}`}>
                                                        {(col.handle === 'block-button') ? (
                                                            <div data-click={`/block/${col.ID}`} style={{ display: 'inline-block' }} key={columnIndex} className={`sa-content sa-block-${col.ID}`}>{ section.handle != 'offer-product' ?  `{{addToCart | label: "${col?.setting?.content + col?.setting?.content2}"}}` :  `{{product.addToCart | label: "${col?.setting?.content + col?.setting?.content2}", product}}` }</div>
                                                        ) : (
                                                            <div data-click={`/block/${col.ID}`} key={`child-${colIndex}`} className={`sa-content sa-block-${col.ID} ${col.handle}`}>
                                                                {('block-product' === col.handle || col.handle === 'offer-product') ? (
                                                                    <>
                                                                        <div className={`sa-row`}>
                                                                            {(col?.setting?.values) ? (
                                                                                col.setting.values.filter(item => item.content !== '' ).map((item, idx) => {
                                                                                    return (
                                                                                        <>
                                                                                            {(item?.contentType && item.contentType.includes('button')) ? (
                                                                                                <div style={{ display: 'inline-block'}} key={`${colIndex}-${idx}`} className={`sa-block-${col.ID}-column-${item.key} sa-columns-${col.setting.values.length } column-id-${item.key}`}>{item.content}</div>
                                                                                            ): (
                                                                                                <div key={`${colIndex}-${idx}`} className={`sa-block-${col.ID}-column-${item.key} sa-columns-${col.setting.values.length } column-id-${item.key}`}>
                                                                                                    {item.content}
                                                                                                </div>
                                                                                            )}
                                                                                            
                                                                                        </>
                                                                                        
                                                                                    )
                                                                                })
                                                                            
                                                                            ): (
                                                                                <></>    
                                                                            )}
                                                                            
                                                                        </div>
                                                                    </>
                                                                    ) : ( 
                                                                       <span data-click={`/block/${col.ID}`}>{col.label}</span> 
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        
                                    })
                                }
                            </div>) 
                        })}
                    </div>
                </>
            )
        }     
    }
    
    const RenderOfferConvert = () => {
        const html = RenderOffer();
        //console.log('domNode', html)
        return html;
    }

    const RenderOffer = () => {
        const element = (
            <>
            {sections.map((value, index) => (
                <Section onClick={() => activateSectionBlock(value.ID)} data-click={`/section/${value.ID}`} className={`sa-section-${value.ID}`} key={`section-${value.handle}-${index}`}>
                    <>
                    <Block className={`aside-block-item-offer aside-display-${value?.setting?.display}`}>
                        {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    <div className={value?.setting?.separator ? ('shopadjust---item item-separator') : ('shopadjust---item')}>
                                        {renderChildrenLIQUID(value, templateId)}
                                    </div>
                                {`{%- endfor -%}`}
                            </>
                        ): (
                            <>{renderChildrenLIQUID(value)}</>
                        )}
                    </Block>  
                    </>
                </Section>
            ))}  
            </>
        )

        let params = products;
        const template = decodeHTML(ReactDOMServer.renderToString(element));

        //console.log(template);
        liquidEngine.registerFilter('money', (initial, args) => {
            let price = formatMoney(initial, currency?.money_format)
            return price
        })

        liquidEngine.registerFilter('money_with_currency', (initial, args) => {
            let price = formatMoney(initial, currency?.money_with_currency_format)
            return price
        })

        liquidEngine.registerFilter('money_without_currency', (initial, args) => {
            let price = formatMoney(initial, currency?.money_without_currency_format)
            return price
        })

        liquidEngine.registerFilter('link_to', (initial, args) => {
            return `<a href='${args}' title="${initial}">${initial}</a>`
        })

        liquidEngine.registerFilter('label', (initial, arg1, arg2, arg3) => {
            let html = stringToHTML(initial);
            if (html.querySelector('span.label')) {
                html.querySelector('span.label').innerHTML = arg1;
            }

            let contentHtml = `<div>${html.innerHTML}</div>`;
            contentHtml = contentHtml.replace(/\[/g, "{{");
            contentHtml = contentHtml.replace(/\]/g, "}}");
            return engine.parseAndRenderSync(contentHtml, arg2);
        })

        localStorage.setItem('params', JSON.stringify(params))

        if(typeof params !== 'object') params = params.reduce(function(acc, cur, i) {
            acc[i] = cur;
            return acc;
        }, {});
        
        return (
            <>
                <ReactLiquid
                    template={template}
                    data={params}
                    render={(renderedTemplate) => {
                        return <span dangerouslySetInnerHTML={renderedTemplate} />
                    }}
                />
            </>
            
        )
    }

    const PageLoading = () => {
        return <div className="loading--page">
            <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
    }

    useEffect(() => {
        document.addEventListener('click', (elm) => {
            if (elm.target.closest('[data-click]')) {
                const link = elm.target.closest('[data-click]').getAttribute('data-click')
                console.log('clicked', link);
                window.parent.postMessage(JSON.stringify([
                    {
                        link: link
                    }
                ]), '*');
            }
        });

    }, [sections]);

    const activateSectionBlock = (value) => {
        console.log('value', value)
        if (value?.ID) {
            const link = `/block/${value?.ID}`
            window.parent.postMessage(JSON.stringify([
                {
                    link: link
                }
            ]), '*');
        }
    }

    useEffect(() => {
        const element = (
            <>
            {sections.map((value, index) => (
                <div onClick={() => activateSectionBlock(value.ID)} data-click={`${value.ID}`} className={`sa-section-${value.ID}`} key={index}>
                    <div className={`aside-block-item-offer aside-display-${value?.setting?.display}`}>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                <div className={ value?.setting?.separator ? 'shopadjust---item item-separator': 'shopadjust---item'}>
                                        {renderChildrenLIQUID(value, templateId)}
                                        {`<div class="all-in-one-offer-bundle-1-item_center" {% if product.variants.size==1 %} style="display: none; " {% endif%}>
                                                <div class="all-in-one-offer-bundle-1-item_vartiants">
                                                    {{product.selectVariants}}
                                                </div>
                                        </div>`}
                                    </div>
                                {`{%- endfor -%}`}
                            </>
                        ): (
                            <>{renderChildrenLIQUID(value)}</>
                        )}
                    </div>  
                </div>
            ))}  
            </>
        )

        const template = ReactDOMServer.renderToStaticMarkup(element);
        const html = `<div class="sa-template-${templateId}">${template}</div>`;

        // console.log('LIQUID', html)
        dispatch(setLiquid(html))
        window.parent.postMessage(JSON.stringify(html), '*');
    }, [sections])

    

    return (  
        <>
            <Main style={{display: 'block', width: '100%'}}>
                <Helmet>
                    <style type="text/css">{ 
                    `
                        .all-in-one-offer-product-variants.product-variants {display: none;}
                        ${iframeStyle}
                        ${convertCssItem({ items : styles, mobile: mobile_styles}, page)}
                    `
                    }
                    </style>
                </Helmet>
                <div className={`sa-template-${templateId}`}>
                    <RenderOfferConvert/>
                </div>
                { /*<pre style={{
                        height: "auto",
                        color: "#666",
                        tabSize: 4,
                        overflow: "auto",
                        padding: "10px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "3px",
                        background: "#eee"
                        }}>
                        <code>{JSON.stringify(_state.template, null, 2)}</code>
                </pre>
                    */ }
            </Main>
        </>
    );
};

export default SimpleContent;