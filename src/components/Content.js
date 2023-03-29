import React from "react";
import IframeComm from "react-iframe-comm";
import { useSelector } from 'react-redux';

const Content = ({ }) => {
    const {items} = useSelector(state => state.template);

    const attributes = {
        src: "https://novayadi85.github.io/index.html",
        width: "100%",
        height: "100%",
        frameBorder: 0, // show frame border just for fun...
    };


    const postMessageData = JSON.stringify([
        {
            items : items
        }
    ]);

    const onReceiveMessage = () => {
        //console.log("onReceiveMessage");
    };

    const onReady = () => {
        //console.log("onReady");
    };

    return (
        <IframeComm
            attributes={attributes}
            postMessageData={postMessageData}
            handleReady={onReady}
            handleReceiveMessage={onReceiveMessage}
        />
    );
};

export default Content;