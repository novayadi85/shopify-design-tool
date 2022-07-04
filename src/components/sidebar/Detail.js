import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, ButtonRightWrapper, Section, SidePanelBottom} from "@styles/Sidebar";

import {
	DeleteMinor,
	MobileChevronMajor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, TextField } from '@shopify/polaris';

function Detail() {
    let { handle } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const backHandle = () => {
        navigate('/')
    }

    const editCSSHandle = () => {
        navigate(`/block/css/${handle}`);
    }

    return (
        <SidePanel>
            <SidePanelArea>
                <Header>
                    <BackAction>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ MobileChevronMajor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading>Text</Heading>
                        </TitleWrapper>
                        <ButtonRightWrapper>
                            <Button onClick={editCSSHandle}>Edit CSS</Button>
                        </ButtonRightWrapper>
                    </BackAction>
                </Header>
                <Section>
                    <FormLayout>
                        <TextField label="Text" onChange={() => {}} autoComplete="off" />
                    </FormLayout>
                </Section>
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
        </SidePanel>
    );
}

export default Detail;