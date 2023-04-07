import React, { useState, useCallback, useEffect } from "react";
import {
    Layout,
    ButtonGroup,
    Stack,
    Icon,
    Link,
    Select,
    Label,
    Button,
    Toast,
    Modal,
    TextContainer
} from "@shopify/polaris";
import { ExitMajor, ExternalMinor } from "@shopify/polaris-icons";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Device from "./header/device";
import { useDispatch } from "react-redux";
import { updatePage } from "../store/product/action";
import { serviceUrl } from "../helper/url";
import { useNavigate } from "react-router-dom";
const TopBarContent = styled.div`
    min-height: 3.3rem;
    
`
const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
    justify-content: ${props => props.content};
`

const PaddingRight = styled.div`
    padding-right: 1rem;
`
const PaddingLeft = styled.div`
    padding-left: 1rem;
`

const ExitAction = styled.div`
    align-items: center;
    display: flex;
    flex: 0 1 auto;
    height: 100%;
    position: relative;
    min-height: 40px;
    padding: 1rem;
    &:after{
        background-color: #999;
        bottom: 0;
        content: "";
        position: absolute;
        right: -0.0625rem;
        top: 0;
        transition: 0.7;
        width: 0.0625rem;
    }
    .Polaris-Icon {
        margin: 0;
    }
`
  
function Header() {
    const [selected, setSelected] = useState('');
    const [alert, setAlert] = useState(false);
    const [options, setOptions] = useState([]);
    const [liveLink, setLiveLink] = useState('/builder');
    // const handleSelectChange = useCallback((value) => setSelected(value), []);
    const { products: { items } } = useSelector(state => state);
    const states = useSelector(state => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [submited, setSubmited] = useState(false);
    const [active, setActive] = useState(false);
    const [hasOffer, setHasOffer] = useState(false);
    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const toastMarkup = active ? (
        <Toast content="Template saved" onDismiss={toggleActive} />
    ) : null;
    
    useEffect(() => {
        if (items.length) {
            const { offer = {} } = items[0];
            let pageDefault = null;
            let domain = '';
            let configs = localStorage.getItem('sa-config');
            try {
                configs = JSON.parse(configs)
                domain = configs.store;
            
            } catch (error) {
                // console.log(error)     
            }
                
            
            let _options = Object.values(offer).map(item => {
                if (!pageDefault) {
                    pageDefault = item.id;
                    try {
                        if (item.products) {
                            const lists = JSON.parse(item.products);
                        
                            if (lists?.handle) {
                                setLiveLink(`https://${domain}/products/${lists.handle}`);
    
                            }
    
                            if (lists[0]?.handle) {
                                setLiveLink(`https://${domain}/products/${lists[0]?.handle}`);
    
                            }
                        }
    
                        if (item.collections) {
                            const lists = JSON.parse(item.collections);
                            
                            if (lists?.handle) {
                                setLiveLink(`https://${domain}/collections/${lists.handle}`);
    
                            }
    
                            if (lists[0]?.handle) {
                                setLiveLink(`https://${domain}/collections/${lists[0]?.handle}`);
    
                            }
                        }
    
                    } catch (error) {
                        
                    }
                }
                
                return {
                    label: item.title,
                    value: item.id
                }
            })

            if (_options.length <= 0) {
                setAlert(true);
                setHasOffer(false) 
            }
            else {
                setHasOffer(true) 
            }
            setOptions(_options)
            dispatch(updatePage(pageDefault))

            //console.log('offer opt', {pageDefault})
        }
        
    }, [items])

    const handleSelectChange = useCallback((value) => {
        setSelected(value)
        let domain = '';
        let configs = localStorage.getItem('sa-config');
        try {
            configs = JSON.parse(configs)
            domain = configs.store;
        
        } catch (error) {

           // console.log(error)     
        }
    
        try {
            const { offer = {} } = items[0];
            Object.values(offer).map(item => {
                if (value === item.id) {
                    
                    if (item.products) {
                        const lists = JSON.parse(item.products);
                    
                        if (lists?.handle) {
                            setLiveLink(`https://${domain}/products/${lists.handle}`);

                        }

                        if (lists[0]?.handle) {
                            setLiveLink(`https://${domain}/products/${lists[0]?.handle}`);

                        }
                    }

                    if (item.collections) {
                        const lists = JSON.parse(item.collections);
                        
                        if (lists?.handle) {
                            setLiveLink(`https://${domain}/collections/${lists.handle}`);

                        }

                        if (lists[0]?.handle) {
                            setLiveLink(`https://${domain}/collections/${lists[0]?.handle}`);

                        }
                    }
                    
                }
                
            });
        } catch (error) {

            //console.log(error)     
        }

        dispatch(updatePage(value))

    }, []);

    //console.log('offer', selected)

    const handleSubmit = () => {
        const url = serviceUrl();
        
        (async () => {
            let domain = '';
            let params = new URLSearchParams(window.location.search);
            let sourceid = params.get('id')
             
            let configs = localStorage.getItem('sa-config');
            try {
                configs = JSON.parse(configs)
                domain = configs.store;
            } catch (error) {
                
            }

            //console.log('states?.products?.liquid', states?.products?.liquid)
            //console.log('states?.', states)

            setSubmited(true)
             
            const rawResponse = await fetch(url, {
                method: 'OPTIONS',
                headers: {
                    "Content-Type": "application/json"
                },
                //  mode: 'no-cors',
                body: JSON.stringify({
                    id: sourceid ? sourceid : states.products.items[0].templateId,
                    schema: JSON.stringify(states.template),
                    styles: JSON.stringify(states.styles),
                    liquid: JSON.stringify(states?.products?.liquid ?? null),
                    templateId: states?.products?.templateId ?? null,
                    templateType: states?.products?.templateType ?? null,
                    domain: domain
                })
            }).then((res) => {
               // console.log('res', res)
                toggleActive();
                setSubmited(false)
            })
            .catch(err => {
                //console.log(err)
                // alert('We have CORS problem, I\'d like to back later!')
                toggleActive();
                setSubmited(false)
            })

            const content = await rawResponse.json();
            //console.log(content);
            
        })();
    }

    const ExitApplication = () => {
        /*
        let configs = localStorage.getItem('sa-config');
        let previous = localStorage.getItem('sa-prev-url');
        //const REACT_APP_ADMIN_PATH = process.env.NODE_ENV === "development" ? process.env.REACT_APP_ADMIN_PATH : 'admin/apps/the-sales-suite/redirect-builder/offerPricesTemplate/RCCG-4631-445dac54d8db4a295a954b61f85386d3';
        // const REACT_APP_ADMIN_PATH = 'admin/apps/090f1e91ea9b6d5b0744bd556b357a18/redirect-builder/offerPricesTemplate/RCCG-4631-445dac54d8db4a295a954b61f85386d3';
        try {
            configs = JSON.parse(configs)
            let domain = configs.store;
            //window.location.href = `https://${domain}/${REACT_APP_ADMIN_PATH}`
            window.location.href = `https://${domain}${previous}`
            //console.log(`https://${domain}${previous}`)
        } catch (error) {
            
        }
        */
        // Called from the iframe

        const message = JSON.stringify({
            message: 'CloseMe',
        });
        
        window.parent.postMessage(message, '*');

    }
    
    //https://shopxaucci.myshopify.com/admin/apps/090f1e91ea9b6d5b0744bd556b357a18/editor/NVEO-7166-7e7add1b913b2b06a81fb8ee2650c8c1/bWJqeFNFdDBzcDI2a3dQVlhDUEpmZVU3ZDNXeU9GREtFeXltZGFXbjA1enBNekcxeFVxUHhqWXoxT3ZRUEltYVZRNC8vblArVG81cDE3UkQrM3VKdGRQbWdJWlZNY3JxclhrUUd4RVRjR0lIUE5lQS8yZGRlNC9IK01CbFMxUzl0aWthS0tnWVovdy9yNzRTdFJ6ZGU5RnEvNE1mK3ZLSGZuV2hPcVlQc09JYzFIYnppelQrUmxPcm5LWURUdXFGOU9rNlRJeTBrdTIzbSt0UnFzcW9Ja09ZdGx4Y29aN2p1aUk3dHVlbG12cTdSSkVuRTJMdWFrc1k3MnBObGpTRTEwRFYrdy85STB1YVIrTjZ6SWI3aGRGUjFPMXZCT3JmMVp4V1pSb1ZHUTRpeHFmN2dlUnk2UTRvMUxYb0w2WUorbmJPS3grUk5hRjVZM0drd3RORzgyK2Z6SkN6VjdCZ2oxUGYrbGdTRlFYQ3ZDbVd0aEdPRGNDR2t2OWdOTUlFM0ViMDRXMTgvMVFKclBmei9IU0NoVk5yZkcyRklhRkxuVFVBME40cU9CVFFyQkVhQXNYSmFQS3RnU3pERUEraXZvNVpndDVVUVJyTW5QYkwxMlhwK3VSYjMrUE5hNHJEZ3dCMU44OFV4czRUNGo1VUxLdDdzRGgyWmMwMmtMaHI4aURXZjc3YTVkK2psZGd5ZkJvVCtBPT0=

    const gotoStore = (event) => {
        event.preventDefault();
        let domain = '';
        let configs = localStorage.getItem('sa-config');
        try {
            configs = JSON.parse(configs)
            domain = configs.store;
            window.location.href = `https://${domain}/${liveLink}`
           
        } catch (error) {
           //(error)     
        }
    }

    const handleChange = useCallback(() => setAlert(!alert), [alert]);

    

    return (
        <header className="HeaderArea">
            <div className="TopBar">
                <Modal
                    open={alert}
                    onClose={handleChange}
                    title="There is no offers on this template,"
                    primaryAction={{
                        content: "Close",
                        onAction: handleChange,
                    }}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>All product or collection only for example.</p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
                    
                <Layout>
                    {toastMarkup}
                    <Layout.Section oneThird>
                        <Stack>
                            <TopBarContent style={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                flexDirection: 'row',
                                alignContent: 'center',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Link className="ExitAction" onClick={ExitApplication}>
                                    <ExitAction>
                                        <Icon source={ExitMajor} color="base"/>
                                    </ExitAction>
                                </Link>
                                <PaddingLeft>
                                    <Link removeUnderline url="/#">Offer template builder</Link>
                                </PaddingLeft>
                            </TopBarContent>
                        </Stack>
                    </Layout.Section>
                    
                    <Layout.Section oneThird>
                        <div style={{display: (hasOffer) ? "block" : "none"}}>
                            <Stack>
                                <TopBarContent className="flex" style={{ margin: '0px 10px'}}>
                                    <Label>
                                        <PaddingRight>Select offer:</PaddingRight>
                                    </Label>
                                    <Select
                                        label=""
                                        options={options}
                                        onChange={handleSelectChange}
                                        value={selected}
                                    />
                                    <Link url={liveLink} blank external removeUnderline>
                                        <PaddingLeft>
                                            <Button icon={ExternalMinor}></Button>
                                        </PaddingLeft>
                                    </Link>
                                </TopBarContent>
                            </Stack>
                        </div>
                    </Layout.Section>
                    <Layout.Section oneThird>
                        <Flex content="flex-end" style={{'paddingRight': 10, margin: 0}}>
                            <TopBarContent style={{paddingTop: '7px'}}>
                                <ButtonGroup>
                                    <Device />

                                    {(!alert) ? (<Button loading={ submited ?? false }  onClick={handleSubmit} primary>Save</Button>) : (null)}
                                    
                                </ButtonGroup>
                            </TopBarContent>
                        </Flex>
                    </Layout.Section>
                </Layout>
            </div>
        </header>
    )
}

export default Header;