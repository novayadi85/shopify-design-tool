import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { useSelector, useDispatch } from 'react-redux';
import engine  from "../helper/template";
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { Label } from "@shopify/polaris";
import { iframeStyle } from '@styles/Iframe';
import { SaButton } from "../styles/Iframe";
import { css } from "styled-components";
import { toCSS, toJSON } from 'cssjson';
import { useParams, useLocation } from "react-router-dom";
import { ReactLiquid } from 'react-liquid'
import { discounts, toFixedNumber } from "../helper/price";
import { parseJSON } from "../helper/json";
import { decodeHTML } from "../helper/html";
/*
const jsonObject = {
    "children": {
      ".offer-container ": {
        "attributes": {
          "margin": "0 7.6%",
          "width": "auto"
        }
      },
    },
}
*/

const convertCssItem = (items) => {
    let jsonObject = {
        children: {}
    };
    
    Object.keys(items).forEach(key => {
        let item = items[key];

        if (item.ID.includes('global')) {
            jsonObject['children'][`.sa-offer-container`] = {
                "attributes": getCssString(item.items)
            }
        }
        else {
            jsonObject['children'][`.${item.ID}`] = {
                "attributes": getCssString(item.items)
            }
        }
    })

    
    //console.log(jsonObject)
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
    
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [appendCss, setAppendCss] = useState('');
    const [products, setProducts] = useState('');
    const [style, setStyle] = useState('');
    const states = useSelector(state => state);
    const [fetchData, setFetchData] = useState(false)

    // console.log(states)
    useEffect(() => {
        setLoading(true);
        /*
        async function renderHtml() {
            let html = '';
            if (items?.template?.liquid) {
                // console.log(items.template.liquid)
                let params = {
                    ...items.params,
                    headline: "Headline",
                    description: "description",
                }
                
                html = await engine.parseAndRender(items.template.liquid, params).then(html => html);
            }

            if (items?.asset) {
                setStyle(items.asset)
            }

            setContent(html);
            setAppendCss(__styles(styles))
            setLoading(false);
            // console.log(appendCss)
        }

        // renderHtml()
        */
        
        async function renderCSS() {
            setAppendCss(__styles(styles))
            setLoading(false);
        }

        renderCSS();
        
    }, [styles]);

    const simulateFetchData = async (allowProduct) => {
        const url = 'https://app.shopadjust-apps.com/packages/api/product?domain=finaltestoftheapp.myshopify.com';
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
                <Section className={(value.handle === 'offer-product') ? '': `sa-section-${value.ID}`} key={index}>
                    <>
                    <Block>
                            {('block-product' === value.handle || value.handle === 'offer-product') ? (
                            <>
                                {`{%- for product in products -%}`}
                                    {renderChildren(value)}
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

        //console.log('params', params)

        const template = ReactDOMServer.renderToStaticMarkup(element);

        return (
            <ReactLiquid
                template={template}
                data={params}
                render={(renderedTemplate) => {
                    return <span dangerouslySetInnerHTML={renderedTemplate} />
                }}
            />
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
                    default:
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

                            console.log('prices', {
                                quantity: child.qty,
                                specialPrice: child.specialPrice,
                                priceType: template.value_type,
                                groupType: template.group_type,
                                price: _product.price,
                            })

                            _product.featured_image = '';
                            if (_product.images.length >= 0) {
                                _product.featured_image = _product.images[0]['src']
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
        
    }, [page, fetchData]);

    
    //console.log(states.template)

        /*
    <Block>
        {('block-product' === value.handle || value.handle === 'offer-product') ? (
        <>
            {`{%- for product in products -%}`}
                {renderChildren(value)}
            {`{%- endfor -%}`}
        </>
    ): (
        <>{renderChildren(value)}</>
    )}
</Block>  
*/


    const renderChildren = ({ setting = { display: ''}, ID, items = [] , handle}) => {
        return (
            <>
                <div className={(handle === 'offer-product') ? `sa-${handle} sa-section-${ID} sa-rows-${setting.display}`: `sa-section-${ID}`}>
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
                                    <div key={`child-${index}`} props={value} className={`sa-content sa-block-${value.ID} ${className}`}>
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
                                                                <div props={item} key={`${index}-${idx}`} className={`sa-block-${value.ID}-column-${item.key} sa-columns-${value.setting.values.length } column-id-${item.key}`}>
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

    //console.log(states)

    return (
        <Main style={{display: 'block', width: '100%'}}>
            <Helmet>
                <link rel="stylesheet" href={style} />
                <style type="text/css">{ 
                `
                    .all-in-one-offer-product-variants.product-variants {display: none;}
                    ${iframeStyle}
                    ${convertCssItem(states.styles.items)}
                `
                }
                </style>
            </Helmet>
            <div className="sa-offer-container">
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
                    display: 'block'
                }}>
                    <code>{JSON.stringify(products, null, 2)}</code>
                </pre>
        </Main>
    );
};

export default SimpleContent;