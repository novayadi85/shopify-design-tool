import { useEffect, useCallback,useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Header, BackAction, TitleWrapper, ButtonRightWrapper, Section as SectionElement, RadioGroup, RemovePadding, Flex} from "@styles/Sidebar";

import { Button, Heading, FormLayout, TextField, ChoiceList, Spinner } from '@shopify/polaris';

function SectionColumn({column, handle, type}) {
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            return setLoading(false);
        }, 500)
        
    }, [column]);

    const [value, setValue] = useState('text');
    const [loading, setLoading] = useState(true);
    const handleChange = useCallback((value) => setValue(value), []);

    const editCSSHandle = () => {
        navigate(`/section/css/${handle}`);
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
                            
                            
                            <TextField label="Content" onChange={() => {}} autoComplete="off" />
                        </FormLayout>    
                    )}

                    
                    
                </SectionElement>
            </div>
        </div>
    );
}

export default SectionColumn;