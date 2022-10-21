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
import GeneralSetting from './GeneralSetting';
import { updateSidebar } from '@store/template/action';

function CssSimple() {
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
        
    items.forEach(item => {
        if (item.type === 'section' && item?.items) {
            item.items.forEach(t => {
                if (t.ID === handle && t.type === 'block') {
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
        navigate(`/setting/detail/${handle}`);
    }

    if ('offer-setting' === handle) value = { label: "Offer Setting" }

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
                            <Heading><span className='capitalize truncate-text'>{ value.label }</span></Heading>
                        </TitleWrapper>
                        
                    </BackAction>
                </Header>
                <>
                <BackAction  style={{marginTop: 10, justifyContent: 'flex-end'}}>
                    <ButtonRightWrapper style={{width: 'auto'}}>
                        <Button onClick={editCSSHandle}>Edit CSS</Button>
                    </ButtonRightWrapper>
                </BackAction>
                    
                </>
                <SectionElement style={{marginTop: 0}}>
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
                            <GeneralSetting type={'block'} value={value} />    
                        </>
                    )}

                    
                </SectionElement>
            </SidePanelArea>
        </SidePanel>
    );
}

export default CssSimple;