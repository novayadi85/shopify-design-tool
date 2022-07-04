
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Section, SidePanelBottom, Flex} from "@styles/Sidebar";
import { DeleteMinor,ChevronLeftMinor } from "@shopify/polaris-icons";

import { Button, Heading, Spinner } from '@shopify/polaris';
import * as Block from '../styles';

function CssEditor() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            return setLoading(false);
        }, 1000)
    }, [handle]);
 
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
                {(loading) ? (
                    <Flex>
                        <Spinner
                            size="small"
                            accessibilityLabel="Loading"
                            hasFocusableParent={false}
                        />
                    </Flex>
                    
                ) : (
                    <Section style={{ marginTop: '0' }}>
                        <ul>
                            <Block.Background/>
                            <Block.Font/>
                            <Block.Text/>
                            <Block.Shadow/>
                            <Block.Border/>
                            <Block.Margin/>
                            <Block.Padding/>
                            <Block.Position/>
                            <Block.Width/>
                            <Block.Height/>
                            <Block.Extra/>
                        </ul>
                        
                    </Section>   
                )};
                
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
        </SidePanel>
    )

}

export default CssEditor;