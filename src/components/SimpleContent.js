import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import engine  from "../helper/template";
import { Helmet } from "react-helmet";
import { Main, Section, Block } from "@styles/Main";
import { Label } from "@shopify/polaris";

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
                <div  style={{marginLeft: '10px'}}>
                    {items.map((value, index) => (
                        <div key={index}>{value.label}</div>
                ))}
                </div>
            </div>
        )
	}

    return (
        <Main>
            <Helmet>
                <link rel="stylesheet" href={style} />
                <style type="text/css">{`
                    .all-in-one-offer-product-variants.product-variants {display: none;}
                `}</style>
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