import React, { useState, useCallback } from "react";
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
import styled from 'styled-components';
import Device from "./header/device";
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
    const [selected, setSelected] = useState("today");
    const handleSelectChange = useCallback((value) => setSelected(value), []);
    const options = [
        { label: "Buy more t-shirt and save money", value: "1" },
        { label: "Buy more pan and save money", value: "2" },
        { label: "Buy more cap and save money", value: "3" },
    ];
    
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
                                    <Button primary>Save</Button>
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