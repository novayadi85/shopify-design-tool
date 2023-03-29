
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Section, SidePanelBottom, Flex} from "@styles/Sidebar";
import { DeleteMinor, ChevronLeftMinor, ToolsMajor } from "@shopify/polaris-icons";
import { Form, Field } from 'react-final-form';
import { Button, Heading, Spinner } from '@shopify/polaris';
import * as Block from '../styles';
import { setCssEditor, updateStyles } from '../../store/style/action';
import { useDispatch, useSelector } from 'react-redux';
import AutoSave from '../actions/AutoSaveStyle';
import { stdStyles } from '../../helper/style';

const style = {
    height: "195px",
    color: "#666",
    tabSize: 4,
    overflow: "auto",
    padding: "10px",
    border: "1px solid #e5e5e5",
    borderRadius: "3px",
    background: "#eee"
};


function CssEditor({ type = false }) {
    const { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [selector, setSelector] = useState(handle);
    const { products: { page, templateId },} = useSelector(state => state);

    //console.log('handle', handle)

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
        if (location.pathname.includes('block')) {
            if (location.pathname.includes('sa-product-block-offer')) {
                return navigate(`/section/${handle}`)
            }
            return navigate(`/block/${handle}`)
        }
        else if (location.pathname.includes('offer-css') || location.pathname.includes('offer-setting')) {
            return navigate(`/setting/${handle}`)
        }

        if (location.pathname.includes('-column-')) {
            let new_handle = handle.split('-column-');
           // console.log(new_handle)
           return navigate(`/product/${new_handle[0]}`)
        }
        else {
            return navigate(`/section/${handle}`)
        }
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
       // console.log('Saving', [handle, `sa-global-${templateId}`])
        
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

                // console.log('newStyles', extraCSS)

                if (newStyles) {
                    if (newStyles['background-type'] && newStyles['background-type'] === 'color') {
                        delete newStyles['background'];
                    }
                }

                return newStyles;
            }
        }

        return stdStyles;
    }

    const _initialValues = InitialValues(); 
    
   // console.log(_initialValues)

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
                            <Form onSubmit={save}
                                initialValues={_initialValues}
                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <AutoSave debounce={1000} save={save} />
                                        <Block.Background initialValues={_initialValues}/>
                                        <Block.Font initialValues={_initialValues}/>
                                        <Block.Text initialValues={_initialValues}/>
                                        <Block.Shadow initialValues={_initialValues}/>
                                        <Block.Border initialValues={_initialValues}/>
                                        <Block.Margin initialValues={_initialValues}/>
                                        <Block.Padding initialValues={_initialValues}/>
                                        <Block.Position initialValues={_initialValues}/>
                                        <Block.Width initialValues={_initialValues}/>
                                        <Block.Height initialValues={_initialValues}/>
                                        <Block.Extra initialValues={_initialValues}/>
                                    </form>
                                        
                                )}
                            />
                               
                        </ul>
                        <pre style={{
                            height: "400px",
                            color: "#666",
                            tabSize: 4,
                            overflow: "auto",
                            padding: "10px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "3px",
                            background: "#eee",
                            display: 'none'
                        }}>
                            <code>{JSON.stringify(_initialValues, null, 2)}</code>
                        </pre>
                           
                    </Section>   
                    
                )};
                
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline onClick={(e) => {
                    e.preventDefault();
                    navigate(`/edit_css/${type}/${handle}`)
                    /*
                    dispatch(setCssEditor(_initialValues));
                    if (document.querySelector('#cssEditor')) {
                        if (document.querySelector('#cssEditor').classList.contains('show')) {
                            document.querySelector('#cssEditor').classList.remove('show');
                        }
                        else {
                            document.querySelector('#cssEditor').classList.add('show');
                        }
                    }
                    */
                }} icon={ToolsMajor}>CSS Manually</Button>
                
            </SidePanelBottom>

        </SidePanel>
    )

}

export default CssEditor;