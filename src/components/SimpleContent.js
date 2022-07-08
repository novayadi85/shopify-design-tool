import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import engine  from "../helper/template";
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { Label } from "@shopify/polaris";
import { iframeStyle } from '@styles/Iframe';
import { SaButton } from "../styles/Iframe";
import { css } from "styled-components";
import { toCSS, toJSON } from 'cssjson';

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
    const { products: { items }, template: {items : sections}, styles: { items: styles }}  = useSelector(state => state);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [appendCss, setAppendCss] = useState('');
    const [style, setStyle] = useState('');
    const states = useSelector(state => state);
    useEffect(() => {
        setLoading(true);
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
            console.log(appendCss)
        }
        renderHtml()
    }, [items, styles]);

    console.log('states', states.styles.items)

    const renderChildren = ({ ID, items = [] }) => {
        return (
            <div>
                <div style={{marginLeft: '10px'}}>
                    {items.map((value, index) => {
                        return (
                            <div key={`child-${index}`} props={value} className={`sa-content`}>
                                <div key={index}>{value.label}</div>
                                <div className={`sa-row`}>
                                {(value?.setting?.values) ? (
                                    value.setting.values.map((item, idx) => {
                                        return (
                                            <div props={item} key={`${index}-${idx}`} className={`sa-columns-${value?.setting?.column} column-id-${item.key}`}>
                                                {(item?.contentType && item.contentType.includes('button')) ? (
                                                    <SaButton>{item.content}</SaButton>
                                                ): (
                                                    <>{item.content}</>
                                                )}
                                            </div>
                                        )
                                    })
                                    
                                    ): (
                                        <></>    
                                    )}
                                </div>
                            </div>
                        )
                    })}

                        
                </div>
            </div>
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
        <Main>
            <Helmet>
                <link rel="stylesheet" href={style} />
                <style type="text/css">{
                `
                    .all-in-one-offer-product-variants.product-variants {display: none;}
                    ${iframeStyle}
                    ${convertCss(states.styles.items)}
                `
                }
                </style>
            </Helmet>
            <div className="sa-offer-container">
                <div className="offer-container">
                    {sections.map((value, index) => (
                        <Section key={index}>
                            <>
                                <Label>{value.label}</Label>
                                <Block>{renderChildren(value)}</Block>
                            </>
                        </Section>
                    ))}
                </div>
                <p style={{marginTop: '5rem', borderTop: '1px solid #000'}}>Sample is like this :</p>
                <div
                    dangerouslySetInnerHTML={{__html: content}}
                />

                <pre style={{
                    height: "195px",
                    color: "#666",
                    tabSize: 4,
                    overflow: "auto",
                    padding: "10px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "3px",
                    background: "#eee"
                }}>
                    <code>{JSON.stringify(styles, null, 2)}</code>
                </pre>
            </div>

            
        </Main>
    );
};

export default SimpleContent;