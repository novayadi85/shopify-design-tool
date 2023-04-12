/* eslint-disable react-hooks/exhaustive-deps */
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
import { calculate, toFixedNumber } from "@helper/price";
import { parseJSON } from "@helper/json";
import { decodeHTML } from "@helper/html";
import { serviceUrl } from "@helper/url";
import { setLiquid } from "@store/product/action";
import { formatMoney } from "@helper/price";
import engine from "../helper/template";
import { cssCustoms, dropdownHTML, getCssString, htmlDecode, htmlDecodeParser, removeEmptyElements, stringToHTML } from "../helper/html";
import { findTopParent } from "../helper/block";
import { updateStyles } from "../store/style/action";
import { updateTemplate } from "../store/template/action";
import { getOfferDetails } from "../helper/price";

const NewContent = (props) => {
    const urlParams = useParams();
    const dispatch = useDispatch();
    const _state = useSelector(state => state);
    const { styles: { items: _styles, mobile: _mobile_styles } } = _state;
    const [_items, setItems] = useState({});
    const [prevOfferData, setPrevOfferData] = useState(null);
    const [renderedOffer, setRenderedOffer] = useState(null);
    const [templateId, setTemplateId] = useState(null);
    const [loading, setLoading] = useState(false)
    const itemsRef = useRef({});
    const [pageId, setpageId] = useState(null);
    const [page, setPage] = useState(pageId ? pageId : urlParams?.page)
    const [templateOffer, setTemplate] = useState(null);
    const [currency, setCurrency] = useState(true);
    const [sections, setSections] = useState([]);
    const [styles, setStyles] = useState(_styles);
    const [mobile_styles, setMobStyles] = useState(_mobile_styles);
    const [products, setProducts] = useState({});
    const [customStyles, setCustomStyles] = useState('');

    const cssProperties = require('known-css-properties').all;

    const onMessageReceivedFromIframe = React.useCallback(
        event => {
            const { data = {} } = event;
            const { page: pg } = urlParams;
            setPage(pg)
            //console.log(data)
            if (!data?.type) {
                //setLoading(true)
                try {
                    const _data = JSON.parse(data)
                    
                    const { products: { items, page: pageId, templateId, store: store_currency, liquid: liquidCode }, template: { items: sections }, styles: { items: styles, mobile: cssMobile } } = _data;
                
                    if (JSON.stringify(prevOfferData) !== null && JSON.stringify(prevOfferData) !== JSON.stringify(_data?.template?.items)) {
                        setItems(_data);
                        setSections(_data?.template?.items);

                        setStyles(styles);
                        setMobStyles(cssMobile);
                        setTemplateId(templateId);
                        setCurrency(store_currency)

                        //console.log('styles', styles)

                        renderPage(items).then(() => {
                            // updateLiquid(sections)
                        });

                        itemsRef.current = _data;
                    }

                    
                    setTimeout(() => {
                        //setLoading(false)
                    }, 1000);
                    
                }
                catch (err) {
                    console.error('Error while parsing message:', err);
                    //setLoading(false)
                }

                
            }
            
        },
        [setItems]
      );
      
    React.useEffect(() => {
        window.addEventListener("message", onMessageReceivedFromIframe);
        return () => window.removeEventListener("message", onMessageReceivedFromIframe);
    }, [onMessageReceivedFromIframe]);
    
    useEffect(() => {
        
        const columnSetting = _items?.template?.setting;
        
        let classSection = 'flex-products sa-section-sa-product-block-offer';
        let cssCustom = cssCustoms();
        let contentCSS = convertCssItem({ items: styles, mobile: mobile_styles }, page)

        const allCSSStyles = cssCustom + columnSetting?.css + contentCSS 

        setCustomStyles(allCSSStyles)     
        
        //console.log(_items?.template?.items)
        
        if (prevOfferData!= null && JSON.stringify(prevOfferData) !== JSON.stringify(_items?.template)) {
            const __items = _items?.template?.items || []
            setRenderedOffer(<RenderOfferMemoized offerData={__items} />);
        }
        else {
            console.log("No offerData changed!");
        }

        if (sections.length) {
            const element = (
                <>
                    {sections.map((section, index) => (     
                    <div onClick={() => activateSectionBlock(section.ID)} className={`sa-section-${section.ID} ${section.handle === 'offer-product' ? classSection : ''}`}>
                        {(section?.columns && section.columns.length) ? (
                            (section.handle === 'offer-product') ? (
                                <>
                                    {`{%- for product in products -%}`}
                                        <div className={`flex-box shopadjust---item sa-section-${templateId}`}>
                                            <Columns section={section} /> 
                                        </div>
                                    {`{%- endfor -%}`}
                                </>
                                ) : (<>
                                        <Columns section={section} />
                                    </>)
                        ) : null}
                    </div>
                ))}  
                </>
            )
    
            const template = ReactDOMServer.renderToStaticMarkup(element);
    
            const html = `<div class="sa-template-${templateId} offer-block">${template}</div>`;
            
            if (_items?.products?.liquid != html) {
                dispatch(setLiquid(html))
                window.parent.postMessage(JSON.stringify(html), '*');
                
            }
        }
        
      
        setPrevOfferData(_items?.template);

        document.addEventListener('click', (elm) => {
            elm.preventDefault()
            if (elm.target.closest('[class^="sa-block-"]')) {
                const target = elm.target.closest('[class^="sa-block-"]')
                if (target.getAttribute('class')) {
                    window.parent.postMessage(JSON.stringify([
                        {
                            link: `/block/${target.getAttribute('class').replace('sa-block-','')}`
                        }
                    ]), '*');
                }
               
            }
        });
       
    }, [_items]);

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

    const renderPage = async (items) => {
        //console.log('renderPage', items)
        let _products = [];
        let lang = 'en';
        let params = {};

        if (items.length) {
            const { offer = {}, template: templateActive, sample} = items[0];
            let template = Object.values(offer).find(item => {
                return item.id === page
            })

            //console.log(template);

            setTemplate(templateActive);
            let totalNormalPrice = 0,
                totalOfferPrice = 0,
                totalOfferSave = 0;
            
            let _newProducts = [];

            console.log('template?.group_type', template?.group_type)

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
                                    productOfferSaveInProcent: `${toFixedNumber(100, 2)}%`,
                                    prices: {},
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
                            //console.log('simulateFetchData', _product)
                            _product.price = Number(_product.variants[0].price) * 100
                            let prices = await (calculate({
                                quantity: tierProduct.qty,
                                specialPrice: tierProduct.specialPrice,
                                priceType: child.value_type,
                                groupType: child.group_type,
                                price: _product.price,
                                compare_at_price: _product.compare_at_price,
                            }));

                            console.log('prices', prices)

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
                                    id: template.id,
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
                                    selectVariants: dropdown,
                                    prices: prices,
                                    addToCart: renderButtonHtml,
                                    imageHtml: "<img src='" + _product.featured_image + "'>",
                                    productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
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
                            let prices = await (calculate({
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
                                    prices: prices,
                                    
                                },
                                offerId: template.id
                            })
                        }
                        
                        for (const [index, child] of Object.entries(extra_conditions)) {
                            if (child.quantity && child.discount) {
                                let prices = await (calculate({
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
                                        productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
                                        prices: prices,
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
                                    prices: {},
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
                                let prices = await (calculate({
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
                                    prices: prices,
                                }
                            
                            }))

                            _products = __products
                        }
                        break;
                
                    default:
                        try {
                            const productOffers = JSON.parse(template.products);
                            //console.log('productOffers', productOffers)
                            _products = await Promise.all(productOffers.map(async (child) => {
                                const { id } = child;
                                let _product = await simulateFetchData(id);
                                _product.price = _product.variants[0].price
                                _product.price = parseFloat(_product.price) * 100;

                                let prices = await (calculate({
                                    quantity: child.qty,
                                    specialPrice: child.specialPrice,
                                    priceType: template.value_type,
                                    groupType: template.group_type,
                                    price: _product.price,
                                    compare_at_price: _product.compare_at_price
                                }));

                                console.log('PRICES', prices)

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

                                console.log('prices', prices)


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
                                        prices: prices,
                                    
                                    
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

       
        //console.log(params);

        setProducts(params)
        return params
    }

    const activateSectionBlock = (value) => {
        // console.log('value', value)
        if (value?.ID) {
            const link = `/block/${value?.ID}`
            window.parent.postMessage(JSON.stringify([
                {
                    link: link
                }
            ]), '*');
        }
    }

    const renderBlockLIQUID = (item, templateId, parent = null, liquid = true) => {
        const { setting = {}, ID, label, handle} = item;
        const content = setting.content || label;
        const content2 = setting.content2 || null;

        const parentItem = findTopParent(_items.template?.items, ID);
        //console.log('parentItem', parentItem)
        if (handle === 'block-button' && parentItem?.handle === 'offer-product') {
            let contentHTML = (`<span>${content}</span>`)
            let content2HTML = content2 ? (`<span>${content2}</span>`) : ''
            return <>
                <span className={`sa-block-${ID}`} { ...(liquid ? {} : { 'data-click': `/block/${ID}` }) }>
                { parentItem?.handle != 'offer-product' ?  `{{addToCart | label: "${contentHTML + '<br>' + content2HTML}"}}` :  `{{product.addToCart | label: "${contentHTML + '<br>' + content2HTML}", product, offerTotal}}` }
                </span>
            </>
        }
        else if (handle === 'block-button' && parentItem?.handle != 'offer-product') {
                let contentHTML = (`<span>${content}</span>`)
                let content2HTML = content2 ? (`<span>${content2}</span>`) : ''

                return <>
                    <span className={`sa-block-${ID}`} { ...(liquid ? {} : { 'data-click': `/block/${ID}` }) }>
                        {`{{addToCart | label: "${contentHTML + '<br>' + content2HTML}", offerTotal}}`}
                    </span>
                </>
            
        }

        return (
            <span className={`sa-block-${ID}`} { ...(liquid ? {} : { 'data-click': `/block/${ID}` }) }>{content}</span>
        );
    };

    const Blocks = ({ contents, side = 'full-side' }) => {
        //console.log('CONTENTS',contents)
        return (
            contents.map(item => {
                if (item.handle === side) {
                    return (
                        item.items.map(value => {
                            //console.log('BLOCK', value)
                            return (<div className={`aside-block-item-offer`}>
                                    {('block-product' === value.handle || value.handle === 'offer-product') ? (
                                        <>
                                            {`{%- for product in products -%}`}
                                                <div className={value?.setting?.separator ? ('shopadjust---item item-separator') : ('shopadjust---item')}>
                                                    {renderBlockLIQUID(value, templateId, item)}
                                                </div>
                                            {`{%- endfor -%}`}
                                        </>
                                    ): (
                                        <>{renderBlockLIQUID(value, templateId, item)}</>
                                    )}
                                </div> )
                        })
                    )
                }
                
            })
        );
    }

    const Columns = ({ section }) => {
        return (
            section.columns.map(column => {
                // console.log('COLUMN', column)
                return (
                    <div className="row">
                        {(column.column == 1) ? (
                            <div className="col-md-12">
                                <Blocks contents={column.items}/>
                            </div>
                        ) : (
                                <>
                                 <div className="col-md-6">
                                    <Blocks contents={column.items} side={ 'left-side' } />
                                </div>
    
                                <div className="col-md-6">
                                    <Blocks contents={column.items} side={ 'right-side' }/>               
                                </div>
                                </>    
                        )}
                            
                    </div>
                )
                
            })
        )
    }

    const convertCssItem = ({mobile, items}, page) => {
        let jsonObject = {
            children: {}
        };

        Object.keys(items).forEach(key => {
            let item = items[key];
            const cssItems = getCssString(item.items);

            const css = {};
            for (const [key, value] of Object.entries(cssItems)) {
                if (cssProperties.includes(key)) {
                    css[key] = value;
                }
            }
                        
            jsonObject['children'][`.${item.ID}`] = {
                "attributes": css
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
            const cssItems = getCssString(item.items);
            const css = {};
            for (const [key, value] of Object.entries(cssItems)) {
                if (cssProperties.includes(key)) {
                    css[key] = value;
                }
            }
            mobileJSONCSS['children'][`.${item.ID}`] = {
                "attributes": css
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


    const RenderOffer = ({offerData }) => {
        let classSection = 'flex-products';
        const _sections = offerData;
        const element = (
            <>
                {_sections.map((section, index) => (     
                <Section onClick={() => activateSectionBlock(section.ID)} data-click={`/section/${section.ID}`} className={`sa-section-${section.ID} ${('offer-product' === section.handle) ? classSection : ''}`} key={`section-${section.handle}-${index}`}>
                    
                    {(section?.columns && section.columns.length) ? (
                        (section.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    <div className={`flex-box shopadjust---item sa-section-${templateId}`}>
                                        <Columns section={section} />
                                    </div>
                                {`{%- endfor -%}`}
                            </>
                            ) : (<>
                                    <Columns section={section} />
                                </>)
                    ) : null}
                </Section>
            ))}  
            </>
        )

        let params = products;
        const template = decodeHTML(ReactDOMServer.renderToString(element));

        console.log(currency);
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
            console.log('ARGS', args)
            return `<a href='${args}' title="${initial}">${initial}</a>`
        })

        liquidEngine.registerFilter('label', (initial, arg1, arg2, arg3) => {
            // console.log('LABEL', initial)
            let html = stringToHTML(initial);
            if (html.querySelector('span.label')) {
                html.querySelector('span.label').innerHTML = arg1;
            }

            const regex = /data-component="addToCart(\w*)?"/;
            const match = initial.match(regex);

            if (match) {
                const componentValue = match[0];
                const div = document.createElement('div');
                div.innerHTML = initial;
                const addToCartEl = div.querySelector(`[${componentValue}]`);

                if (addToCartEl) {
                    const input = arg1;
                    const output = input.replace(/\$([a-zA-Z0-9_]+)/g, '{{ $1 }}');
                    div.querySelector(`[${componentValue}]`).innerHTML = output;
                    html = div;
                }
            } 

            let contentHtml = `<div>${html.innerHTML}</div>`;
            contentHtml = contentHtml.replace(/\[/g, "{{");
            contentHtml = contentHtml.replace(/\]/g, "}}");

            return engine.parseAndRenderSync(contentHtml, arg2);
        })

        if(typeof params !== 'object') params = params.reduce(function(acc, cur, i) {
            acc[i] = cur;
            return acc;
        }, {});

        let quantity = 0;

        if (params.products) {
            params.products = params.products.map(({ ...p }) => {
                quantity += p.quantity
                if (p?.prices) {
                    const offerDetails = getOfferDetails(p.prices); // Get the offer details from the calculation result

                    // Add the offer details to the product object
                    return {
                        ...p,
                        before_price: offerDetails.before_price,
                        now_price: offerDetails.now_price,
                        save_in_amount: offerDetails.save_in_amount,
                        save_in_procent: offerDetails.save_in_procent,
                    };
                }

                return p;
            })
        }

        params['offerTotal'] = {
            quantity: quantity,
            before_price: params.totalNormalPrice,
            now_price: params.totalOfferPrice,
            save_in_amount: params.totalOfferSave,
            save_in_procent: params.totalOfferSave,
        }

        localStorage.setItem('params', JSON.stringify(params))

        console.log('PARAMS', params)
        
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

    const RenderOfferMemoized = React.memo(RenderOffer);

    console.log('renderedOffer', _items)
    
    return (  
        <>
            <Main style={{display: 'block', width: '100%'}}>
                <Helmet>
                    <style type="text/css">{ 
                    `
                        .all-in-one-offer-product-variants.product-variants {display: none;}
                        ${iframeStyle}
                        ${customStyles}
                    ` 
                    }
                    </style>
                </Helmet>
                <div className={`smooth-transition sa-template-${templateId}`}>
                    { /** <RenderOfferMemoized offerData={sections} /> */}
                    {(renderedOffer) ? (renderedOffer) : <RenderOfferMemoized offerData={sections} />}
                </div>

                <div>
                    <pre style={{
                            height: "auto",
                            color: "#666",
                            tabSize: 4,
                            overflow: "auto",
                            padding: "10px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "3px",
                            background: "#eee",
                            display: 'none'
                            }}>
                        <code>{JSON.stringify(_items?.products?.liquid, null, 2)}</code>
                    </pre>
                    <pre style={{
                            height: "auto",
                            color: "#666",
                            tabSize: 4,
                            overflow: "auto",
                            padding: "10px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "3px",
                            background: "#eee",
                            display: 'none'
                            }}>
                        <code>{JSON.stringify(styles, null, 2)}</code>
                    </pre>
                    <pre style={{
                            height: "auto",
                            color: "#666",
                            tabSize: 4,
                            overflow: "auto",
                            padding: "10px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "3px",
                            background: "#00ff00",
                            display: 'none'
                            }}>
                        <code>{customStyles}</code>
                    </pre>
                </div>
               
            </Main>
        </>
    );

}

export default NewContent;