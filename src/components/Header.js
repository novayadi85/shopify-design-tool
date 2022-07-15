import React, { useState, useCallback, useEffect } from "react";
import {
    Layout,
    ButtonGroup,
    Stack,
    Icon,
    Link,
    Select,
    Label,
    Button
} from "@shopify/polaris";
import { ExitMajor, ExternalMinor } from "@shopify/polaris-icons";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Device from "./header/device";
import { useDispatch } from "react-redux";
import { updatePage } from "../store/product/action";
const TopBarContent = styled.div`
    min-height: 40px;
    
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
    const [selected, setSelected] = useState(null);
    const [options, setOptions] = useState([]);
    // const handleSelectChange = useCallback((value) => setSelected(value), []);
    const { products: { items } } = useSelector(state => state);
    const states= useSelector(state => state);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (items.length) {
            const { offer = {} } = items[0];
            let pageDefault = null;
            
            let _options = Object.values(offer).map(item => {
                pageDefault = item.id;
                return {
                    label: item.title,
                    value: item.id
                }
            })
            setOptions(_options)
            dispatch(updatePage(pageDefault))

            //console.log('offer opt', {pageDefault})
        }
        
    }, [items])

    const handleSelectChange = useCallback((value) => {
        setSelected(value)
        dispatch(updatePage(value))

    }, []);

    //console.log('offer', selected)

    const handleSubmit = () => {
        const url = 'https://app.shopadjust-apps.com/packages/api?domain=finaltestoftheapp.myshopify.com';
        // return fetch('https://app.shopadjust-apps.com/packages/api?domain=finaltestoftheapp.myshopify.com').then(data => data.json()).catch(reason => console.log(reason))
        (async () => {
            console.log(states)
            let params = new URLSearchParams(window.location.search);
            let sourceid = params.get('id')
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                // mode: 'no-cors',
                body: JSON.stringify({
                    id: sourceid ? sourceid : states.products.items[0].templateId,
                    schema: JSON.stringify(states.template),
                    styles: JSON.stringify(states.styles),
                    domain: 'finaltestoftheapp.myshopify.com'
                })
            }).catch(err => {
                alert('We have CORS problem, I\'d like to back later!')
            })

            const content = await rawResponse.json();
            console.log(content);
            
        })();
    }

    return (
        <header className="HeaderArea">
            <div className="TopBar">
                <Layout>
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
                                <Link className="ExitAction">
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
                        <Stack>
                            <TopBarContent className="flex" style={{ margin: 10}}>
                                <Label>
                                    <PaddingRight>Select offer:</PaddingRight>
                                </Label>
                                <Select
                                    label=""
                                    options={options}
                                    onChange={handleSelectChange}
                                    value={selected}
                                />
                                <Link removeUnderline url="/#">
                                    <PaddingLeft>
                                        <Icon
                                        source={ExternalMinor}
                                        color="base"
                                        />
                                    </PaddingLeft>
                                </Link>
                                
                            </TopBarContent>
                        </Stack>
                    </Layout.Section>
                    <Layout.Section oneThird>
                        <Flex content="flex-end" style={{'paddingRight': 10, margin: 10}}>
                            <TopBarContent>
                                <ButtonGroup>
                                    <Device />
                                    <Button onClick={handleSubmit} primary>Save</Button>
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