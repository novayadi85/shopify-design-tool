import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { RemovePadding, RadioGroup, SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Flex, Section as SectionElement, SidePanelBottom, ButtonRightWrapper} from "@styles/Sidebar";
import {DeleteMinor,ChevronLeftMinor } from "@shopify/polaris-icons";
import { Button, Heading, FormLayout, ChoiceList, Spinner, Select, Modal, TextContainer, TextField   } from '@shopify/polaris';
import { useSelector, useDispatch } from 'react-redux';
import { editBlock } from "@store/template/action";
import { Form, Field } from 'react-final-form';
import AutoSave from '../actions/AutoSave';
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


function Product() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(1);
    const [columns, setColumns] = useState([]);
    const [value, setValue] = useState([]);
    const [loading, setLoading] = useState(false);
   
    const [active, setActive] = useState(false);
    const button = useRef();
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => button.current.querySelector("button").focus());
    }, []);

    const handleSelectChange = useCallback((value) => setSelected(Number(value)), []);
    const { items } = useSelector(state => state.template);

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        console.log('Saving', lines)
        dispatch(editBlock(value, {
            headline: value.label,
            column: selected,
            values: lines?.values ? lines.values : value.values,
        }))
        await sleep(2000)
    }
    
    useEffect(() => {
        setLoading(true);
        const options = async () => {
            const ops = [...Array(10 - 1 + 1).keys()].map(x => x + 1).map((n) => {
                return {
                    label: n, value: n
                }
            })

            setColumns(ops);
        };

        setTimeout(() => {
            // call the function
            options().catch(console.error);
            items.forEach(item => {
                if(item.type === 'section' && handle === item.ID){
                    // value = item
                }
        
                if (item.type === 'section' && item?.items) {
                    item.items.forEach(({...t}) => {
                        if (t.ID === handle && t.type === 'block') {
                            
                            const values = [...Array(selected - 1 + 1).keys()].map(x => x + 1).map((n) => {
                                return {
                                    key: n,
                                    content: '',
                                    type: 'text'
                                }
                            });

                            t.setting.values = values;
                            setValue(t);
                        }
        
                    })
                }
            });

            return setLoading(false);
        }, 0)
    

    }, [handle]);
    
    useEffect(() => {
        const values = [...Array(selected - 1 + 1).keys()].map(x => x + 1).map((n) => {
            return {
                key: n,
                content: '',
                type: 'text'
            }
        });
        
        
        dispatch(editBlock(value, {
            headline: value.label,
            values,
        })) 
        
        
        if (value?.setting) {
            let tmp = value;
            tmp.setting.values = values;
            setValue(tmp);
        }
        
        
    }, [selected]);

    console.log(value)
    
    
    const backHandle = () => {
        navigate('/')
    }

    /*
    const ColumnBlocks = () => {
        if (value?.setting?.values) {
            return value.setting.values.map(({...item}) => {
                return <SectionForm key={item.key} type={ 'product'} value={value} setting={item} column={item.key} handle={handle}/>
            })
        }
        return (
            <></>
        )
    }
    */
    
    const editCSSHandle = () => {
        navigate(`/section/css/${handle}`);
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
                            <Heading><span className='capitalize'>{(value?.setting?.heading) ? value.setting.heading : value.label}</span></Heading>
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
                    <SectionElement>
                        {(() => {
                            if (columns.length > 0) {
                                return (
                                    <FormLayout>
                                        <Select
                                            label="Number of columns"
                                            options={columns}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />

                                        <Form
                                            onSubmit={save}        
                                            initialValues={{  }}
                                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                                <form onSubmit={handleSubmit}>
                                                    <AutoSave debounce={1000} save={save} />
                                                    {(value?.setting?.values) ? (
                                                        value.setting.values.filter(item => item?.key).map(({...item}) => {
                                                            return (
                                                                <div key={`key-${item.key}`} style={{ marginTop: '1rem' }}>
                                                                    <Header>
                                                                        <BackAction className={ 'space-between'}  style={{justifyContent: 'space-between'}}>
                                                                            <TitleWrapper style={{padding: 0}}>
                                                                                <Heading><span className='capitalize'>{ `Column ${item.key}` }</span></Heading>
                                                                            </TitleWrapper>
                                                                            <ButtonRightWrapper style={{width: 'auto'}}>
                                                                                <Button onClick={editCSSHandle}>Edit CSS</Button>
                                                                            </ButtonRightWrapper>
                                                                        </BackAction>
                                                                    </Header>
                                                                    <SectionElement>
                                                                        <RemovePadding>
                                                                            <RadioGroup style={{ marginTop: 5 }}>
                                                                                <Field type='select' name={`values.${item.key}.contentType`}>
                                                                                    {props => (
                                                                                    <div>
                                                                                        <ChoiceList
                                                                                            title="Content type"
                                                                                            choices={[
                                                                                                { label: "Button", value: "button" },
                                                                                                { label: "Text", value: "text" },
                                                                                            ]}
                                                                                            selected={(props.input.value) ? props.input.value : 'text'}
                                                                                            value={props.input.value}
                                                                                            onChange={props.input.onChange}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                </Field>
                                                                            </RadioGroup>
                                                                        </RemovePadding>
                                                                        <div style={{ marginTop: 10 }}>
                                                                            <Field name={`values.${item.key}.content`}>
                                                                                {props => (
                                                                                    <div>
                                                                                    <TextField
                                                                                        label="Content"        
                                                                                        name={props.input.name}
                                                                                        value={props.input.value}
                                                                                        onChange={props.input.onChange}
                                                                                        multiline={4}
                                                                                        showCharacterCount
                                                                                        maxLength={500}
                                                                                    />
                                                                                    </div>
                                                                                )}
                                                                            </Field>
                                                                        </div>
                                                                    </SectionElement>
                                                                </div>
                                                            )
                                                        })
                                                    ) : (
                                                        <></>
                                                    )}
                                                </form>
                                            )}
                                        />  
                                    </FormLayout>
                                )
                            }
                            else {
                                return (
                                    <Flex>
                                        <Spinner
                                            size="small" 
                                            accessibilityLabel="Loading"
                                            hasFocusableParent={false}
                                        />
                                    </Flex>
                                )
                            }
                        })()}
                        </SectionElement>
                )}

                
            </SidePanelArea>
            <SidePanelBottom>
                <Button onClick={handleOpen} plain monochrome removeUnderline icon={DeleteMinor}>Delete Section</Button>
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
                        <p>Do you sure to remove this section? </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </SidePanel>
    );
}

export default Product;