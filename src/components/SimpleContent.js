import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { matchPath } from 'react-router'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { iframeStyle } from '@styles/Iframe';
import Editor from "./Editor";
import { SaButton } from "../styles/Iframe";
import { toCSS, toJSON } from 'cssjson';
import { ReactLiquid, liquidEngine, useLiquid  } from 'react-liquid'
import { discounts, toFixedNumber } from "@helper/price";
import { parseJSON } from "@helper/json";
import { decodeHTML } from "@helper/html";
import { serviceUrl } from "@helper/url";
import { setLiquid } from "@store/product/action";
import { formatMoney } from "@helper/price";
import engine from "../helper/template";
import { convertToPlain, dropdownHTML, htmlDecode, htmlToText, stringToHTML } from "../helper/html";

const convertCssItem = (items, page) => {
    let jsonObject = {
        children: {}
    };
    
    Object.keys(items).forEach(key => {
        let item = items[key];
        jsonObject['children'][`.${item.ID}`] = {
            "attributes": getCssString(item.items)
        }
        
    })
    return toCSS(jsonObject);

}


const getCssString = (string) => {
    let newObject = {};
    let skip = ['background-type', 'box-shadow-x', 'box-shadow-y', 'box-shadow-blur', 'box-shadow-width', 'box-shadow-color', 'border-type', 'background-opacity'];
    if (string) {
        
        let shadow = '{box-shadow-x} {box-shadow-y} {box-shadow-blur} {box-shadow-width} {box-shadow-color}';
        Object.keys(string).forEach(key => {
           // console.log(key)
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

const convertCss = (string) => {
    let jsonObject;
    let skip = ['background-type', 'box-shadow-x', 'box-shadow-y', 'box-shadow-blur', 'box-shadow-width', 'box-shadow-color', 'border-type', 'background-opacity'];
    /*
    "box-shadow-x": "8px",
    "box-shadow-y": "9px",
    "box-shadow-blur": "9px",
    "box-shadow-width": "8px",
    */
    if (string) {
        let newObject = {};
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
                
                    default:
                        break;
                }
            }

            
            if ('background-type' === key && string[key] === 'none') {
                //console.log(string[key])
                newObject['background-color'] = 'none;'
            }

        });

        newObject['box-shadow'] = shadow;
        
        jsonObject = {
            "children": {
                ".offer-container ": {
                    "attributes": newObject
                },
            }
        }
        
    }
    return toCSS(jsonObject);
}

const SimpleContent = (props) => {
    const urlParams = useParams();
    const { products: { items, page, templateId, store: currency, template:templateActive }, template: { items: sections }, styles: { items: styles } } = useSelector(state => state);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [appendCss, setAppendCss] = useState('');
    const [products, setProducts] = useState('');
    const [style, setStyle] = useState('');
    const states = useSelector(state => state);
    const [fetchData, setFetchData] = useState(false)
    const [liquidCode, setLiquidCode] = useState('');
    const [templateOffer, setTemplate] = useState(templateActive);
    
    const liquid = useLiquid();
    //console.log(states)

    useEffect(() => {
        setLoading(true);
        async function renderCSS() {
            setAppendCss(__styles(styles))
            setLoading(false);
        }

        renderCSS();
        
    }, [styles]);

    const simulateFetchData = async (allowProduct) => {
        const url = serviceUrl('product');
        return fetch(`${url}&id=${allowProduct}`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
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

    const RenderOffer = () => {
        const element = (
            <>
            {sections.map((value, index) => (
                <Section className={`sa-section-${value.ID}`} key={index}>
                    <>
                    <Block className={`aside-block-item-offer aside-display-${templateOffer?.type_offer}-${value?.setting?.display} items-${value?.setting?.separator ? 'separator' : 'no-separator'}`}>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    <div className="shopadjust---item">
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

        liquidEngine.registerFilter('label', (initial, arg1, arg2) => {
            let html = stringToHTML(initial);
            if (html.querySelector('span.label')) {
                html.querySelector('span.label').innerHTML = arg1;
                return `<div>${html.innerHTML}</div>`
            }

            return initial
        })


        localStorage.setItem('params', JSON.stringify(params))

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

    useEffect(() => {        
        async function renderPage() {
            setFetchData(true)
            
            let _products = [];
            let lang = 'en';
            let params = {};
            //console.log('items', items)
            if (items.length) {
                const { offer = {}, template: templateActive} = items[0];
                let template = Object.values(offer).find(item => {
                    return item.id === page
                })

                setTemplate(templateActive);
                /*
                let allowProducts = template?.allowProducts ?? [];
                if (allowProducts.length) {
                    console.time("promise all");
                    _products = await Promise.all(allowProducts.map(async (allowProduct) => {
                        return await simulateFetchData(allowProduct);
                    }))
                    console.timeEnd("promise all");
                }
                */
                
                let totalNormalPrice = 0,
                    totalOfferPrice = 0,
                    totalOfferSave = 0;
                
                let _newProducts = [];
                // console.log('template.group_type', template.group_type)
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
                            
                            if(_product.variants.length > 0){
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
                            const { product: _childs, discount,  discount_type, collection_in_products} = collections;
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
                                
                                if(_product.variants.length > 0){
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
                                        imageHtml: "<img src='" +_product.featured_image + "'>",
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
                                    
                                    if(_product.variants.length > 0){
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
                        const { extra_free_products, upsell_data  } = template;
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
                                    amount_discount = (_product.price / 100) * disc ;
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
                                
                                if(_product.variants.length > 0){
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
                                    imageHtml: "<img src='" +_product.featured_image + "'>",
                                    image: _product?.media ? _product.media[0] : '',
                                    productOfferSaveInProcent: `${toFixedNumber(((_product.price - _product.finalPrice) / _product.price) * 100, 2)}%`,
                                }
                            }))
                        }
                       
                        //console.log('_extra_free_products', _products)

                    break;
                    
                    case 'amount_off':
                    case 'discount_product':
                    case 'discount_product_collection':
                        const { extra_config, collections: __collections } = template;
                        let __parseCollections = (parseJSON(__collections))
                        let _extra_config = (parseJSON(extra_config))
                        const { collection_in_products : _collection_in_products,  discount: discs } = __parseCollections;
                        
                        let size = 4; 
                        params['headline'] =   _extra_config?.other_offer_collections_title  ? _extra_config.other_offer_collections_title : offer['headline']
                        params['description'] =   _extra_config?.other_offer_collections_decription  ? _extra_config.other_offer_collections_decription : offer['description']
                        template[`headline_${lang}`] = params['headline'] ? params['headline'] : template[`headline_${lang}`]
                        template[`description_${lang}`] = params['description'] ?  params['description'] : template[`description_${lang}`] 
                        
                        template.link = `/collections/${__parseCollections?.handle}`;
                        template.textButton = _extra_config?.other_offer_collections_button_text && _extra_config.other_offer_collections_button_text !=='' ? _extra_config.other_offer_collections_button_text : 'See collection'

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
                                
                                if(_product.variants.length > 0){
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
                                    offerPrice: prices.offerPrice,
                                    OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    selectVariants: '',
                                    totalOfferPrice: (prices.totalOfferPrice / 100),
                                    addToCart: renderButtonHtml,
                                    normalPrice: (_product.price / 100) * parseFloat(1),
                                    imageHtml: "<img src='" +_product.featured_image + "'>",
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

                                

                                let dropdown = '';
                                
                                if(_product.variants.length > 0){
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
                                        offerPrice: prices.offerPrice,
                                        OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                        totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                        selectVariants: dropdown,
                                        totalOfferPrice: (prices.totalOfferPrice / 100),
                                        addToCart: renderButtonHtml,
                                        normalPrice: (_product.price / 100) * parseFloat(child.qty),
                                        imageHtml: "<img src='" +_product.featured_image + "'>",
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

                
                _products.forEach(t => {
                    totalNormalPrice += t?.normalPrice ? parseFloat(t.normalPrice) : 0;
                });

                
                _products.forEach(t => {
                    totalOfferPrice += t?.offerPrice ? parseFloat(t.offerPrice) : 0;
                });

                
                _products.forEach(t => {
                    totalOfferSave += t?.OfferSave ? parseFloat(t.OfferSave) : 0;
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
                    
                /*
                offer_text_cart_product_accomplished: ""
                offer_text_cart_product_not_accomplished: ""
                offer_text_cart_top_accomplished: ""
                offer_text_cart_top_not_accomplished: ""
                offer_text_collection_top: ""
                */
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
            // console.log('params', params)
            
        }

        renderPage();
        setLiquidCode(true);
    }, [page, fetchData]);

    useEffect(() => {
        // console.log('liquidCode', liquidCode)
        const element = (
            <>
            {sections.map((value, index) => (
                <div className={`sa-section-${value.ID}`} key={index}>
                    <div className={`aside-block-item-offer aside-display-${templateOffer?.type_offer}-${value?.setting?.display} items-${value?.setting?.separator ? 'separator' : 'no-separator'}`}>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    <div className="shopadjust---item">
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
        // console.log(html)
        dispatch(setLiquid(html))
        
    }, [sections])

    useEffect(() => {
        //console.log('PROPS', urlParams)
        //console.log('PROPS', props)
    }, [urlParams])

    const renderChildrenLIQUID = ({ setting = { display: ''}, ID, items = [] , handle}, templateId) => {
        return (
            <>
                <div className={(handle === 'offer-product' || 'sa-product-block-offer' === handle) ? `sa-${handle} sa-section-${templateId} sa-rows-${templateOffer?.type_offer && templateOffer.type_offer === 'tier' ? `volume-${setting.display}` : setting.display}`: `sa-section-${ID}`}>
                    {items.map((value, index) => {
                        if (value.handle === 'product-block') {
                           // console.log("HANDLE", value.setting.values)
                        }

                        let className = '';
                        if (setting?.display) {
                            className = `sa-display-${setting.display}`

                            if (templateOffer?.type_offer && templateOffer.type_offer === 'tier') {
                                className = `sa-display-volume-${setting.display}`
                            }
                        }
                        return (
                            <>
                             {(value.handle === 'block-button') ? (
                                    <div style={{ display: 'inline-block' }} key={index} className={`sa-content sa-block-${value.ID}`}>{ `{{addToCart | label: "${value.label}"}} ` }</div>
                                ): (
                                    <div key={`child-${index}`} className={`sa-content sa-block-${value.ID} ${className}`}>
                                    {('block-product' === value.handle || value.handle === 'offer-product') ? (
                                        <>
                                        
                                        <div className={`sa-row`}>
                                            {(value?.setting?.values) ? (
                                                value.setting.values.filter(item => item.content !== '' ).map((item, idx) => {
                                                    return (
                                                        <>
                                                            {(item?.contentType && item.contentType.includes('button')) ? (
                                                                <div style={{ display: 'inline-block'}} key={`${index}-${idx}`} className={`sa-block-${value.ID}-column-${item.key} sa-columns-${value.setting.values.length } column-id-${item.key}`}>{item.content}</div>
                                                            ): (
                                                                <div key={`${index}-${idx}`} className={`sa-block-${value.ID}-column-${item.key} sa-columns-${value.setting.values.length } column-id-${item.key}`}>
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
                                        <div key={index}>{value.label}</div>
                                        
                                    )}
                                    
                                </div>    
                            )}
                            </>
                            
                        )
                    })}

                        
                </div>
            </>
        )
	}


    const renderChildren = ({ setting = { display: '' }, ID, items = [], handle }, templateId) => {
        return (
            <>
                <div className={(handle === 'offer-product' || 'sa-product-block-offer' === handle) ? `sa-${handle} sa-section-${templateId} sa-rows-${templateOffer?.type_offer && templateOffer.type_offer === 'tier' ? `volume-${setting.display}` : setting.display}`: `sa-section-${ID}`}>
                    {items.map((value, index) => {
                        if (value.handle === 'product-block') {
                           // console.log("HANDLE", value.setting.values)
                        }

                        let className = '';
                        if (setting?.display) {
                            className = `sa-display-${setting.display}`

                            if (templateOffer?.type_offer && templateOffer.type_offer === 'tier') {
                                className = `sa-display-volume-${setting.display}`
                            }
                        }



                        return (
                            <>
                             {(value.handle === 'block-button') ? (
                                    <SaButton key={index} className={`sa-content sa-block-${value.ID}`}>{value.label}</SaButton>
                                ): (
                                    <div key={`child-${index}`} className={`sa-content sa-block-${value.ID} ${className}`}>
                                    {('block-product' === value.handle || value.handle === 'offer-product') ? (
                                        <>
                                        
                                        <div className={`sa-row`}>
                                            {(value?.setting?.values) ? (
                                                value.setting.values.filter(item => item.content !== '' ).map((item, idx) => {
                                                    return (
                                                        <>
                                                            {(item?.contentType && item.contentType.includes('button')) ? (
                                                                <SaButton key={`${index}-${idx}`} className={`sa-block-${value.ID}-column-${item.key} sa-columns-${value.setting.values.length } column-id-${item.key}`}>{item.content}</SaButton>
                                                            ): (
                                                                <div key={`${index}-${idx}`} className={`sa-block-${value.ID}-column-${item.key} sa-columns-${value.setting.values.length } column-id-${item.key}`}>
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
                                        <div key={index}>{value.label}</div>
                                        
                                    )}
                                    
                                </div>    
                            )}
                            </>
                            
                        )
                    })}

                        
                </div>
            </>
        )
	}

    const __styles = () => {
        let css = ``
        if (styles.length) {
            styles.forEach((name, value) => {
                css += `${name} : "${value}"`
            })
        }
        

        return css;
    }


    return (
        <Main style={{display: 'block', width: '100%', marginLeft: 10}}>
            <Helmet>
                <link rel="stylesheet" href={style} />
                <style type="text/css">{ 
                `
                    .all-in-one-offer-product-variants.product-variants {display: none;}
                    ${iframeStyle}
                    ${convertCssItem(states.styles.items, page)}
                `
                }
                </style>
            </Helmet>
            <div className={`sa-template-${templateId}`}>
                <RenderOffer/>
                <div style={{display: 'none'}}>
                    <p style={{marginTop: '5rem', borderTop: '1px solid #000'}}>Sample is like this :</p>
                    <div
                        dangerouslySetInnerHTML={{__html: content}}
                    />
                </div>
                
            </div>

            <div id="cssEditor">
                <Editor/>
            </div>

            <pre style={{
                    height: "400px",
                    color: "#666",
                    tabSize: 4,
                    overflow: "auto",
                    padding: "10px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "3px",
                    background: "#eee",
                    display: 'none'
                }}>
                    <code>{JSON.stringify(states.styles.items, null, 2)}</code>
                </pre>
        </Main>
    );
};

export default SimpleContent;