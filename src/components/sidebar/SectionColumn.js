import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Header, BackAction, TitleWrapper, ButtonRightWrapper, Section as SectionElement, RadioGroup, RemovePadding, Flex} from "@styles/Sidebar";
import { Button, Heading, FormLayout, TextField, ChoiceList, Spinner } from '@shopify/polaris';
import { editBlock } from "@store/template/action";

function SectionColumn(props) {
    const  { column, handle, type, value: prop } = props
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [textFieldValue, setTextFieldValue] = useState(prop.label);
    const [content, setContent] = useState(prop?.setting?.content);
    const [focused, setFocused] = useState(prop.label);
    
    useEffect(() => {
        setLoading(false);
        setTimeout(() => {
            return setLoading(false);
        }, 500)
        
    }, [column]);

    const [value, setValue] = useState('text');
    const [loading, setLoading] = useState(false);
    const handleChange = useCallback((value) => setValue(value), []);

    const editCSSHandle = () => {
        navigate(`/section/css/${handle}`);
    }

    const handleTextFieldChange = (value) => {
        setTextFieldValue(value);
        dispatch(editBlock(prop, {
            headline: value
        }))   
        setFocused(true);
    }

    const handleContentChange = (value) => {
        setContent(value);
        dispatch(editBlock(prop, {
            content: value,
            headline: prop.label
        }))   
        setFocused(true);
    }

    return (
        <div style={{paddingBottom: 10}}>
            <div>
                <Header>
                    <BackAction className={ 'space-between'}  style={{justifyContent: 'space-between'}}>
                        <TitleWrapper style={{padding: 0}}>
                            <Heading><span className='capitalize'>{ `Column ${column}` }</span></Heading>
                        </TitleWrapper>
                        <ButtonRightWrapper style={{width: 'auto'}}>
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
                                {(type === 'product') ? (
                                    <>
                                    <RemovePadding>
                                        <RadioGroup style={{marginTop: 5}}>
                                            <ChoiceList
                                                title="Content type"
                                                choices={[
                                                    { label: "Button", value: "button" },
                                                    { label: "Text", value: "text" },
                                                ]}
                                                selected={value}
                                                onChange={handleChange}
                                            />
                                        </RadioGroup>
                                    </RemovePadding>
                                    <div style={{ marginTop: 10 }}>
                                        <TextField focused={focused} onChange={handleContentChange} label="Content" value={content} autoComplete="off" />   
                                    </div>
                                    
                                    </>
                                ): (
                                    <TextField focused={focused} onChange={handleTextFieldChange} label="Label" value={textFieldValue} autoComplete="off" />
                                )}        
                            
                            
                        </FormLayout>    
                    )}
                </SectionElement>
            </div>
        </div>
    );
}

export default SectionColumn;