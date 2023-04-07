/* eslint-disable react-hooks/exhaustive-deps */
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
import { useLocation, useNavigate } from 'react-router-dom';
import Column from '../pages/Column';

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
  
const Iframe = (params) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const states = useSelector(state => state);
    const { products: { items, page, templateId, store: currency, template:templateActive }, template: { items: sections }, styles  } = useSelector(state => state);
    const [state, setState] = useState(states);
    const [context, setContext] = useContext(ThemeContent);
    const [loading, setLoading] = useState(true);
	const [prevStateData, setPrevOfferData] = useState(null);
	
    const [attributes, setAttributes] = useState({
        src: "/builder/content/",
        width: "100%",
        height: "100%",
        frameBorder: 0,
    });

    // parent received a message from iframe
    const onReceiveMessage = (event) => {
      const { data } = event;
		  console.log('loading', 'onReceiveMessage')
        try {
			const html = JSON.parse(data);
			console.log('LIQUID', html)
            if (Array.isArray(html)) {
              const link = html[0].link;
              navigate(link)
            }
            else dispatch(setLiquid(html))
          
        } catch (error) {

		}
		
    };
 
    // iframe has loaded
    const onReady = () => {
        console.log("onReady");
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
	
		if (prevStateData != null && JSON.stringify(prevStateData) !== JSON.stringify(states)) {
			
		}

		setPrevOfferData(states)
		
		console.log("states changed!");

	}, [states])
 
    return (
        <div className="device-preview">
            <div style={{display: (loading) ? 'none' : 'contents'}}>
                
				
				{(location.pathname.includes('/column')) ? (<Column/>) : (
					<IframeComm
						attributes={attributes}
						postMessageData={state}
						handleReady={onReady}
						handleReceiveMessage={onReceiveMessage}
					/>
				)}

            </div>
            <div style={{ display: (loading) ? 'block' : 'none' }}>
                <div style={{textAlign:'center'}}><Spinner accessibilityLabel="Spinner example" size="small" /></div>
                <Skeleton/>
            </div>
            
        </div>
    );
};
 
export default Iframe;