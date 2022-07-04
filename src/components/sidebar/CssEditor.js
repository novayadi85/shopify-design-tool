
import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Section, SidePanelBottom} from "@styles/Sidebar";
import { DeleteMinor,ChevronLeftMinor } from "@shopify/polaris-icons";

import { Button, Heading } from '@shopify/polaris';
import * as Block from '../cssBlock';

function CssEditor() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // console.log('location',location)
    }, []);
 
    const backHandle = () => {
        if (location.pathname.includes('block')) {
            navigate(`/block/${handle}`)
        }
        else {
            navigate(`/section/${handle}`)
        }
    }

    return (
        <SidePanel>
            <SidePanelArea style={{padding: 0}}>
                <Header>
                    <BackAction style={{paddingLeft: '10px'}}>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading>Go Back</Heading>
                        </TitleWrapper>
                    </BackAction>
                </Header>
                <Section style={{ marginTop: '0' }}>
                    <ul>
                        <Block.background/>
                        <Block.font/>
                        <Block.text/>
                        <Block.shadow/>
                        <Block.border/>
                        <Block.margin/>
                        <Block.padding/>
                        <Block.position/>
                        <Block.width/>
                        <Block.height/>
                        <Block.extra/>
                    </ul>
                    
                </Section>
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
        </SidePanel>
    )

}

export default CssEditor;