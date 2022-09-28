import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Header, BackAction, TitleWrapper, ButtonRightWrapper, Section as SectionElement, RadioGroup, RemovePadding, Flex} from "@styles/Sidebar";
import { Button, Heading, FormLayout, TextField, ChoiceList, Spinner, Select } from '@shopify/polaris';
import { editBlock } from "@store/template/action";
import SectionSetting from '../actions/SectionSetting';

let contents = [];
function SectionColumn(props) {
    const { column, handle, type, value: prop, setting } = props
    const { products }  = useSelector(state => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [textFieldValue, setTextFieldValue] = useState(prop.label);
    const [content, setContent] = useState(prop?.setting?.content);
    const [text, setText] = useState('');
    const [focused, setFocused] = useState(prop?.label);
    const [headline, setHeadline] = useState('Section');
    const searchInput = useRef(null);
    
    //console.log(setting);

    useEffect(() => {
        setLoading(false);
        setTimeout(() => {
            return setLoading(false);
        }, 500)

        if (products?.items) {
            setHeadline(products.items[0]?.template?.label)
        }
        
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
            headline: value,
        }))   
        setFocused(true);
    }

    const handleContentChange = (e) => {
        let value = e.target.value;
        setText(value)

        let update = props.value.setting.values.map(({ ...t }) => {
            if (t.key === props.setting.key) {
                t.value = value;
            }
            return t;
        })

        dispatch(editBlock(prop, {
            ...prop.setting,
            values: update,
        }))  

        
        setFocused(true);

    }
    
    return (
        <div style={{paddingBottom: 10, marginTop: 10}}>
            <div>
                <Header>
                    <BackAction className={ 'space-between'}  style={{justifyContent: 'space-between'}}>
                        <TitleWrapper style={{padding: 0}}>
                            <Heading style={{display: 'none'}}><span className='capitalize'>{ `Section` }</span></Heading>
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
                                        <input ref={searchInput} type={'text'} onChange={handleContentChange} value={text} autoComplete="off"/>
                                    </div>
                                    </>
                                ) : (
                                        <>
                                            {('sa-product-block-offer' === handle) ? (
                                                <SectionSetting props={props} />
                                            ): (
                                                <TextField focused={focused} onChange={handleTextFieldChange} label="Label" value={textFieldValue} autoComplete="off" />
                                            )}
                                            
                                        </>
                                    
                                )}        
                            
                            
                        </FormLayout>    
                    )}
                </SectionElement>
            </div>
        </div>
    );
}

export default SectionColumn;

