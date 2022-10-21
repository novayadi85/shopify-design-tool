
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Section, Flex} from "@styles/Sidebar";
import {  ChevronLeftMinor } from "@shopify/polaris-icons";
import { Button, Heading, Spinner } from '@shopify/polaris';
import { updateStyles } from '../../store/style/action';
import { useDispatch, useSelector } from 'react-redux';
import { stdStyles } from '../../helper/style';
import Editor from "@components/Editor";
import colorcolor from 'colorcolor';

function CssManual() {
    const { type, handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [selector, setSelector] = useState(handle);
    const { products: { page, templateId },} = useSelector(state => state);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (handle === 'offer-setting') {
                setSelector('offer-container');
            }
            else {
                setSelector(handle);
            }
            
            return setLoading(false);
        }, 1000)
    }, [handle]);
 
    const backHandle = () => {
        if (location.pathname.includes('offer-css') || location.pathname.includes('offer-setting')) {
            return navigate(`/setting/offer-setting`)
        }

        return navigate(`/${type}/css/${handle}`)
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        //console.log('Saving', [handle, `sa-global-${templateId}`])
        
        if (handle === 'sa-product-block-offer') {
            dispatch(updateStyles(`sa-${type}-${templateId}`, lines));
        }
        else if(handle === 'global') {
            dispatch(updateStyles(`sa-global-${templateId}`, lines));
        }
        else if(handle === 'offer-setting') {
            dispatch(updateStyles(`sa-global-${templateId}`, lines));
        }
        else {
            dispatch(updateStyles(`sa-${type}-${handle}`, lines));
        }
        await sleep(2000)
    }

    

    const InitialValues = () => {
        const initial_values_styles = (useSelector(state => state.styles));
        let initialHandle = `sa-${type}-${handle}`;

        if (handle === 'sa-product-block-offer') {
            initialHandle = `sa-${type}-${templateId}`;
        }
        else if (handle === 'global') {
            initialHandle = `sa-global-${templateId}`
        }
        else if (handle === 'offer-setting') {
            initialHandle = `sa-global-${templateId}`
        }
        else {
            initialHandle = `sa-${type}-${handle}`;
        }

        if (initial_values_styles.items) {
            let found = initial_values_styles.items.find(item => item.ID === initialHandle);
            
            if (found) {
                const extraCSS = found.items;
                let newStyles = {
                    // ...stdStyles,
                    ...extraCSS
                }

                if (newStyles) {
                    if (newStyles['background-type'] && newStyles['background-type'] === 'color') {
                        delete newStyles['background'];
                    }

                    if(newStyles['background-color']) newStyles['background-color'] = colorcolor( newStyles['background-color'], "hex" );
                    if (newStyles['color']) newStyles['color'] = colorcolor(newStyles['color'], "hex");
                    
                }

                return newStyles;
            }
        }

        return stdStyles;
    }

    const _initialValues = InitialValues(); 
    
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
                        <div id="cssEditor">
                            <Editor values={_initialValues} type={ type } handle={handle} />
                        </div>  
                    </Section>   
                    
                )};
                
            </SidePanelArea>
        </SidePanel>
    )

}

export default CssManual;