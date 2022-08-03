import React, { useEffect, useState } from "react";
import IframeComm from "react-iframe-comm";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setLiquid } from "../store/product/action";
 
const Iframe = ({ }) => {
    const dispatch = useDispatch();
    const states = useSelector(state => state);
    const { products: { items, page, templateId, store: currency, template:templateActive }, template: { items: sections }, styles  } = useSelector(state => state);
    const [state, setState] = useState(states);
    const [attributes, setAttributes] = useState({
        src: "/builder/content/",
        width: "100%",
        height: "100%",
        frameBorder: 0,
    });

    // parent received a message from iframe
    const onReceiveMessage = (event) => {
        const { data } = event;
        // dispatch(setLiquid(JSON.parse(msg.data)))
        try {
            const html = JSON.parse(data);
            dispatch(setLiquid(html))
        } catch (error) {

        }
        // console.log("onReceiveMessage", event);
    };
 
    // iframe has loaded
    const onReady = () => {
        console.log("onReady");
    };

    useEffect(() => {
        setState(states);
        const { products: { page } } = states;
        setAttributes({
            ...attributes,
            ...{
                src: `/builder/content/${page}`
            }
        })
    }, [items, page, templateId, templateActive, sections, styles, currency])
 
    return (
        <div className="device-preview" >
            <IframeComm
                attributes={attributes}
                postMessageData={state}
                handleReady={onReady}
                handleReceiveMessage={onReceiveMessage}
            />
        </div>
    );
};
 
export default Iframe;