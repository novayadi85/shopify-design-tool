import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { iframeStyle } from '@styles/Iframe';
import { SaButton } from "../styles/Iframe";
import { toCSS, toJSON } from 'cssjson';
import { ReactLiquid } from 'react-liquid'
import { discounts, toFixedNumber } from "@helper/price";
import { parseJSON } from "@helper/json";
import { decodeHTML } from "@helper/html";
import { serviceUrl } from "@helper/url";
import { setLiquid } from "@store/product/action";


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
                
                    default:
                        break;
                }
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
    const { products: { items, page }, template: { items: sections }, styles: { items: styles } } = useSelector(state => state);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [appendCss, setAppendCss] = useState('');
    const [products, setProducts] = useState('');
    const [style, setStyle] = useState('');
    const states = useSelector(state => state);
    const [fetchData, setFetchData] = useState(false)
    const [liquidCode, setLiquidCode] = useState('');

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

    const RenderOffer = () => {
        const element = (
            <>
            {sections.map((value, index) => (
                <Section className={`sa-section-${value.ID}`} key={index}>
                    <>
                    <Block>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    {renderChildren(value, page)}
                                {`{%- endfor -%}`}
                            </>
                        ): (
                            <>{renderChildren(value)}</>
                        )}
                    </Block>  
                    </>
                </Section>
            ))}  
            </>
        )

        let params = products;
        const template = ReactDOMServer.renderToStaticMarkup(element);

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
            if (items.length) {
                const { offer = {} } = items[0];
                let template = Object.values(offer).find(item => {
                    return item.id === page
                })
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
                    case 'tier':
                        _newProducts = await Promise.all(template.childs.map(async (child) => {
                            const { products: _tierProduct } = child;
                            const tierProduct = JSON.parse(_tierProduct);
                            let _product = await simulateFetchData(tierProduct.id);
                            
                            _product.price = _product.variants[0].price
                            let prices = await (discounts({
                                quantity: tierProduct.qty,
                                specialPrice: tierProduct.specialPrice,
                                priceType: child.value_type,
                                groupType: child.group_type,
                                price: _product.price
                            }));
    
                            
                            return {
                                ..._product,
                                ...{
                                    quantity: tierProduct.qty,
                                    productQuantity: tierProduct.qty,
                                    specialPrice: tierProduct.specialPrice,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    totalOfferSave: prices.totalOfferSave,
                                    offerPrice: child.specialPrice,
                                    selectVariants: '',
                                    totalOfferPrice: (prices.totalOfferPrice / 100),
                                    totalNormalPrice: _product.price * Number(tierProduct.qty) / 100,
                                    addToCart: '',
                                    imageHtml: "<img src='" + _product.featured_image + "' width='100px'>",
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
                            console.log('template', collections)
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

                                console.log('prices 1', prices)

                                products.push({
                                    ..._product,
                                    ...{
                                        quantity: child,
                                        specialPrice: discount,
                                        offerPrice: prices.offerPrice,
                                        OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                        totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                        selectVariants: '',
                                        totalOfferPrice: (prices.totalOfferPrice / 100),
                                        addToCart: '',
                                        normalPrice: (_product.price / 100) * parseFloat(child),
                                        imageHtml: "<img src='" +_product.featured_image + "' width='100px'>",
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

                                    console.log('prices 2', prices)

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
                                            selectVariants: '',
                                            totalOfferPrice: prices.totalOfferPrice / 100,
                                            addToCart: '',
                                            imageHtml: "<img src='" + _product.featured_image + "' width='100px'>",
                                            productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`
                                        },
                                        offerId: offer.id
                                    })
                                }
                                
                            }
                        
                            console.log('products' , products)
                            _products = products
                        break;
                    
                    
                    default:
                        console.log(template)
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
                                // imageHtml = "<img src='" + _product?.featured_image ? _product.featured_image : featured_image + "' width='100px'>",
                            }

                            return {
                                ..._product,
                                ...{
                                    quantity: child.qty,
                                    specialPrice: child.specialPrice,
                                    offerPrice: prices.offerPrice,
                                    OfferSave: prices?.totalOfferSave ? prices.totalOfferSave : prices.saved,
                                    totalOfferSaveInProcent: toFixedNumber(prices.totalOfferSaveInProcent, 2),
                                    selectVariants: '',
                                    totalOfferPrice: (prices.totalOfferPrice / 100),
                                    addToCart: '',
                                    normalPrice: (_product.price / 100) * parseFloat(child.qty),
                                    imageHtml: "<img src='" +_product.featured_image + "' width='100px'>",
                                    image: _product?.media ? _product.media[0] : '',
                                    productOfferSaveInProcent: `${toFixedNumber(prices.totalOfferSaveInProcent, 2)}%`,
                                    
                                    
                                },
                                offerId: template.id
                            }
                        }))
                            
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
                    products: _products,
                    addToCart: "Add To cart",
                    headline: parseJSON(template[`headline_${lang}`]),
                    description: decodeHTML(parseJSON(template[`description_${lang}`])),
                    totalNormalPrice: totalNormalPrice,
                    totalOfferPrice: totalOfferPrice,
                    totalOfferSave: totalOfferSave,
                    BuyNow: "Buy It NOW"
                }

                
            }

            setProducts(params)
            console.log('params', params)
            
        }

        renderPage();
        setLiquidCode(true);
        
    }, [page, fetchData]);

    useEffect(() => {
        // console.log('liquidCode', liquidCode)
        const element = (
            <>
            {sections.map((value, index) => (
                <Section className={`sa-section-${value.ID}`} key={index}>
                    <>
                    <Block>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    {renderChildren(value, page)}
                                {`{%- endfor -%}`}
                            </>
                        ): (
                            <>{renderChildren(value)}</>
                        )}
                    </Block>  
                    </>
                </Section>
            ))}  
            </>
        )

        const template = ReactDOMServer.renderToStaticMarkup(element);
        dispatch(setLiquid(template))
        
    }, [liquidCode])


    const renderChildren = ({ setting = { display: ''}, ID, items = [] , handle}, page) => {
        return (
            <>
                <div className={(handle === 'offer-product') ? `sa-${handle} sa-section-${page} sa-rows-${setting.display}`: `sa-section-${ID}`}>
                    {items.map((value, index) => {
                        if (value.handle === 'product-block') {
                           // console.log("HANDLE", value.setting.values)
                        }

                        let className = '';
                        if (setting?.display) {
                            className = `sa-display-${setting.display}`
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

    console.log(states)

    return (
        <Main style={{display: 'block', width: '100%'}}>
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
            <div className={`sa-global-${page}`}>
                <div className="offer-container">
                    
                </div>
                <RenderOffer/>
                <div style={{display: 'none'}}>
                    <p style={{marginTop: '5rem', borderTop: '1px solid #000'}}>Sample is like this :</p>
                    <div
                        dangerouslySetInnerHTML={{__html: content}}
                    />
                </div>
                
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
                    <code>{JSON.stringify(products, null, 2)}</code>
                </pre>
        </Main>
    );
};

export default SimpleContent;