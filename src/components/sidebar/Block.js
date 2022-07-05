import { useEffect, useState, useRef, useCallback} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, ButtonRightWrapper, Section as SectionElement, SidePanelBottom, Flex} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, TextField, Spinner, Modal, TextContainer} from '@shopify/polaris';
import { useSelector } from 'react-redux';

function Block() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const items = useSelector(state => state.template);
    let value = [];

    const [active, setActive] = useState(false);
    const button = useRef();
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => button.current.querySelector("button").focus());
    }, []);
        
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
        setLoading(true);

        setTimeout(() => {
            return setLoading(false);
        }, 500)

    }, [handle]);

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
                    {(loading) ? (
                        <Flex>
                            <Spinner
                                size="small"
                                accessibilityLabel="Loading"
                                hasFocusableParent={false}
                            />
                        </Flex>
                    
                    ) : (
                        <FormLayout>
                            <TextField label="Text" onChange={() => {}} autoComplete="off" />
                        </FormLayout>      
                    )}

                    
                </SectionElement>
            </SidePanelArea>
            <SidePanelBottom>
                <Button onClick={handleOpen} plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
            <Modal
                small
                open={active}
                onClose={handleClose}
                title="Delete"
                primaryAction={{
                content: "Yes sure",
                onAction: handleClose,
                }}
                secondaryActions={[
                {
                    content: "Cancel",
                    onAction: handleClose,
                },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>Do you sure to remove this block? </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </SidePanel>
    );
}

export default Block;