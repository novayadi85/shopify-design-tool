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
import { discounts, toFixedNumber } from "@helper/price";
import { parseJSON } from "@helper/json";
import { decodeHTML } from "@helper/html";
import { serviceUrl } from "@helper/url";
import { setLiquid } from "@store/product/action";
import { formatMoney } from "@helper/price";
import engine from "../helper/template";
import { dropdownHTML, stringToHTML } from "../helper/html";

const NewContent = (props) => {
    const _state = useSelector(state => state);
    const { styles: { items: _styles, mobile: _mobile_styles } } = _state;
    const [_items, setItems] = useState({});
    const [templateId, setTemplateId] = useState(null);
    const [loading, setLoading] = useState(false)
    const itemsRef = useRef({});

    const [currency, setCurrency] = useState(true);
    const [sections, setSections] = useState([]);
    const [styles, setStyles] = useState(_styles);
    const [mobile_styles, setMobStyles] = useState(_mobile_styles);
    const [products, setProducts] = useState({});

    const onMessageReceivedFromIframe = React.useCallback(
        event => {
            const { data = {} } = event;
            console.log(data)
            if (!data?.type) {
                setLoading(true)
                try {
                    const _data = JSON.parse(data)
                    setItems(_data);
                    setSections(_data?.template?.items)
                    itemsRef.current = _data;
                    setLoading(false)
                }
                catch (err) {
                    console.error('Error while parsing message:', err);
                    setLoading(false)
                }
            }
            
        },
        [setItems, setLoading]
      );
      
    React.useEffect(() => {
        window.addEventListener("message", onMessageReceivedFromIframe);
        return () => window.removeEventListener("message", onMessageReceivedFromIframe);
    }, [onMessageReceivedFromIframe]);
    
    useEffect(() => {
        setTimeout(() => {
            console.log(_items); // check if _items is being set correctly
            //console.log('ITEMS', itemsRef.current);
        }, 3000);
    }, [_items]);
    
    const RenderOfferConvert = () => {
        const html = RenderOffer();
        //console.log('domNode', html)
        return html;
    }

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

    const renderBlockLIQUID = (item, templateId) => {
        const { setting = {}, ID, label } = item;
        const content = setting.content || label;
        return (
          <span data-click={`/block/${ID}`}>{content}</span>
        );
    };

    const renderChildrenLIQUID = (section, templateId) => {
        const { ID, items = [], setting: sectionSetting } = section;
        console.log('ITEMSSS section', section)
        console.log('ITEMSSS', items)
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

    const Blocks = ({ contents, side = 'full-side' }) => {
        console.log(contents)
        return (
            contents.map(item => {
                if (item.handle === side) {
                    return (
                        item.items.map(value => {
                            return (<div>
                                <Block className={`aside-block-item-offer aside-display-${value?.setting?.display}`}>
                                    {('block-product' === value.handle || value.handle === 'offer-product') ? (
                                        <>
                                            {`{%- for product in products -%}`}
                                                <div className={value?.setting?.separator ? ('shopadjust---item item-separator') : ('shopadjust---item')}>
                                                    {renderBlockLIQUID(value, templateId)}
                                                </div>
                                            {`{%- endfor -%}`}
                                        </>
                                    ): (
                                        <>{renderBlockLIQUID(value)}</>
                                    )}
                                </Block> 
                            </div>)
                        })
                    )
                }
                
            })
        );
    }

    const Columns = ({ section }) => {
        return (
            section.columns.map(column => {
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

    const RenderOffer = () => {
        const element = (
            <>
            {sections.map((section, index) => (
                <Section onClick={() => activateSectionBlock(section.ID)} data-click={`/section/${section.ID}`} className={`sa-section-${section.ID}`} key={`section-${section.handle}-${index}`}>
                    <div>
                        {section?.label}
                    </div>
                    {(section?.columns && section.columns.length) ? (
                        <Columns section={section} />
                    ) : null}
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
    
    return (  
        <>
            <Main style={{display: 'block', width: '100%'}}>
                <Helmet>
                    <style type="text/css">{ 
                    `
                        .all-in-one-offer-product-variants.product-variants {display: none;}
                        ${iframeStyle}
                        
                        .row {
                            width: 100%;
                            display: flex;
                            gap: 2px;
                            border: 1px solid #00ff00;
                            padding: 10px;
                            margin: 5px 0;
                        }

                        .col-md-12 {
                            width: 100%;
                            border: 1px solid green;
                            padding: 10px;
                        }

                        .col-md-6 {
                            width: 50%;
                            border: 1px solid green;
                            padding: 10px;
                        }
                    ` 
                    }
                    </style>
                </Helmet>
                <div className={`sa-global-${templateId}`}>
                    <RenderOfferConvert/>
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
                            background: "#eee"
                            }}>
                        <code>{JSON.stringify(_items?.template?.items, null, 2)}</code>
                    </pre>
                    <p>HALLO</p>
                </div>
               
            </Main>
        </>
    );

}

export default NewContent;