import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import engine  from "../helper/template";
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { Label } from "@shopify/polaris";
import { iframeStyle } from '@styles/Iframe';
import { SaButton } from "../styles/Iframe";

const SimpleContent = (props) => {
    const { products: { items }, template: {items : sections}}  = useSelector(state => state);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [style, setStyle] = useState('');

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

            setContent(html)
            setLoading(false);
        }
        renderHtml()
    }, [items]);

    const renderChildren = ({ ID, items = [] }) => {
        return (
            <div>
                <div style={{marginLeft: '10px'}}>
                    {items.map((value, index) => {
                        return (
                            <div props={value} className={`sa-content`}>
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

    return (
        <Main>
            <Helmet>
                <link rel="stylesheet" href={style} />
                <style type="text/css">{
                `
                    .all-in-one-offer-product-variants.product-variants {display: none;}
                    ${iframeStyle}
                `
                }
                </style>
            </Helmet>
            <div>
                {sections.map((value, index) => (
                    <Section key={index}>
                        <>
                            <Label>{value.label}</Label>
                            <Block>{renderChildren(value)}</Block>
                        </>
                    </Section>
                ))}

                <p style={{marginTop: '5rem', borderTop: '1px solid #000'}}>Sample is like this :</p>
                <div
                    dangerouslySetInnerHTML={{__html: content}}
                />

                
            </div>
            
        </Main>
    );
};

export default SimpleContent;