import React, {useState, useEffect, useContext } from 'react';

import {
    SkeletonPage,
    Layout,
    Card,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
    Spinner
} from '@shopify/polaris'; 

import IframeComm from "react-iframe-comm";
import { useDispatch, useSelector } from "react-redux";
import { setLiquid } from "../store/product/action";
import { ThemeContent } from "../Context";
import { useNavigate } from 'react-router-dom';

function Skeleton() {
    return (
      <SkeletonPage primaryAction>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
}
  
const Iframe = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const states = useSelector(state => state);
    const { products: { items, page, templateId, store: currency, template:templateActive }, template: { items: sections }, styles  } = useSelector(state => state);
    const [state, setState] = useState(states);
    const [context, setContext] = useContext(ThemeContent);
    const [loading, setLoading] = useState(true);
    const [attributes, setAttributes] = useState({
        src: "/builder/content/",
        width: "100%",
        height: "100%",
        frameBorder: 0,
    });

    // parent received a message from iframe
    const onReceiveMessage = (event) => {
        const { data } = event;
        try {
            const html = JSON.parse(data);
            if (Array.isArray(html)) {
              const link = html[0].link;
              navigate(link)
            }
            dispatch(setLiquid(html))
        } catch (error) {

        }
        //console.log("onReceiveMessage", JSON.parse(data));
    };
 
    // iframe has loaded
    const onReady = () => {
        //console.log("onReady");
      setLoading(false);
      if(context.ready !== true) setContext({ready: true})
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
        <div className="device-preview">
            <div style={{display: (loading) ? 'none' : 'contents'}}>
                <IframeComm
                    attributes={attributes}
                    postMessageData={state}
                    handleReady={onReady}
                    handleReceiveMessage={onReceiveMessage}
                />
            </div>
            <div style={{ display: (loading) ? 'block' : 'none' }}>
                <div style={{textAlign:'center'}}><Spinner accessibilityLabel="Spinner example" size="small" /></div>
                <Skeleton/>
            </div>
            
        </div>
    );
};
 
export default Iframe;