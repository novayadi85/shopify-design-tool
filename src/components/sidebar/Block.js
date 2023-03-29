import { useEffect, useState, useRef, useCallback} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, ButtonRightWrapper, Section as SectionElement, SidePanelBottom, Flex} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, TextField, Spinner, Modal, TextContainer} from '@shopify/polaris';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import BlockContent from './BlockContent';
import { updateSidebar } from '@store/template/action';
import { getBlockbyId } from '../../helper/block';

function Block() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const {items} = useSelector(state => state.template);
    let value = [];

    const [active, setActive] = useState(false);

    const buttonRef = useRef(null);

    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => buttonRef.current.querySelector("button").focus());
    }, []);

    const handleDelete = useCallback(() => {
        let _items = items.map(({ ...item }) => {
            item.items = item?.items ? item.items.filter(t => t.ID !== value.ID) : [];
            return item;
        })

        dispatch(updateSidebar(_items));
        setActive(false);
        navigate('/');
        
    }, []);
        
    /*
    items.forEach(item => {
        if (item.type === 'section' && item?.items) {
            item.items.forEach(t => {
                if (t.ID === handle && t.type === 'block') {
                    value = t;
                }
            })
        }
    });
    */
    
    value = getBlockbyId(items, handle)

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

    if ('offer-container' === handle) value = { label: "Offer content" }

    const activator = (
        <div ref={buttonRef}>
            <Button props={value} onClick={handleOpen} plain monochrome removeUnderline icon={DeleteMinor}>{t('Remove')} Block</Button>
        </div>
    );

    return (
        <SidePanel>
            <SidePanelArea>
                <Header>
                    <BackAction>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper style={{maxWidth: 100}}>
                            <Heading><span className='capitalize truncate-text'>{ value?.label }</span></Heading>
                        </TitleWrapper>
                    </BackAction>
                </Header>
                <>
                <BackAction style={{marginTop: 10}}>
                    <ButtonRightWrapper>
                        <Button onClick={editCSSHandle}>Edit CSS</Button>
                    </ButtonRightWrapper>
                </BackAction>
                </>
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
                            <>
                                <BlockContent type={'block'} value={value} />    
                            </>
                          
                    )}

                    
                </SectionElement>
            </SidePanelArea>
            <SidePanelBottom>
                {activator}
            </SidePanelBottom>
            <Modal
                activator={buttonRef}
                small
                open={active}
                onClose={handleClose}
                title="Delete"
                primaryAction={{
                    content: "Yes sure",
                    onAction: handleDelete,
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