import { useEffect, useCallback,useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Header, BackAction, TitleWrapper, ButtonRightWrapper, Section as SectionElement, RadioGroup, RemovePadding} from "@styles/Sidebar";

import { Button, Heading, FormLayout, TextField, RadioButton, Label  } from '@shopify/polaris';

function SectionColumn({column, handle, type}) {
    const navigate = useNavigate();
    useEffect(() => {

    }, []);

    const [value, setValue] = useState(null);

    const handleChange = useCallback(
        (_checked, newValue) => setValue(newValue), []
    );

    const editCSSHandle = () => {
        navigate(`/section/css/${handle}`);
    }

    console.log(value);

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
                    <FormLayout>
                        <RemovePadding>
                            <Label>Content type</Label>
                            <RadioGroup style={{marginTop: 5}}>
                                <RadioButton
                                    label="Text"
                                    checked={value === `Text[${column}]` || value === null}
                                    id={`Text[${column}]`}
                                    name={`Text[${column}]`}
                                    value={`Text[${column}]`}
                                    onChange={handleChange}
                                />
                                <RadioButton
                                    label="Button"
                                    id={`Button[${column}]`}
                                    name={`Button[${column}]`}
                                    checked={value === `Button[${column}]`}
                                    value="Button"
                                    onChange={handleChange}
                                />
                            </RadioGroup>
                        </RemovePadding>
                        
                        
                        <TextField label="Content" onChange={() => {}} autoComplete="off" />
                    </FormLayout>
                </SectionElement>
            </div>
        </div>
    );
}

export default SectionColumn;