import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, ButtonRightWrapper, Section as SectionElement, SidePanelBottom} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, TextField } from '@shopify/polaris';
import { useSelector } from 'react-redux';

function Block() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const items = useSelector(state => state.template);
    let value = [];
    items.forEach(item => {
        if (item.type === 'section' && item?.items) {
            item.items.forEach(t => {
                if (t.handle === handle && t.type === 'block') {
                    value = t;
                }

            })
        }
    });

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
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading><span className='capitalize'>{ value.label }</span></Heading>
                        </TitleWrapper>
                        <ButtonRightWrapper>
                            <Button onClick={editCSSHandle}>Edit CSS</Button>
                        </ButtonRightWrapper>
                    </BackAction>
                </Header>
                <SectionElement>
                    <FormLayout>
                        <TextField label="Text" onChange={() => {}} autoComplete="off" />
                    </FormLayout>
                </SectionElement>
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
        </SidePanel>
    );
}

export default Block;