import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { Button, Heading, FormLayout, ChoiceList, Spinner, Select, Modal, TextContainer, TextField } from '@shopify/polaris';
import { RemovePadding, RadioGroup, SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Flex, Section as SectionElement, SidePanelBottom, ButtonRightWrapper} from "@styles/Sidebar";

import {DeleteMinor, ChevronLeftMinor } from "@shopify/polaris-icons";
import { useSelector, useDispatch } from 'react-redux';
import { editBlock } from "@store/template/action";
import { Form, Field } from 'react-final-form';
import AutoSave from '../actions/AutoSave';
function Product() {
    const { items } = useSelector(state => state.template);
    let { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(1);
    const [columns, setColumns] = useState([]);
    const [value, setValue] = useState([]);
    const [initialValues, setInitialValues] = useState({});
    const [templateItems, setTemplateItems] = useState([]);
    const [loading, setLoading] = useState(false);
   
    const [active, setActive] = useState(false);
    const button = useRef();
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => button.current.querySelector("button").focus());
    }, []);

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const states = useSelector(state => state);

    useEffect(() => {
        let _columns = {};
        let number_column = 1;
        const _items = items.map(async ({...item}) => {
            if (item.type === 'section' && item?.items) {
                item.items = await Promise.all(item.items.map(async ({...t}) => {
                    if (t.ID === handle && t.type === 'block') {
                        number_column = t?.setting?.column ?? selected
                        let values = [...Array(number_column - 1 + 1).keys()].map(x => x + 1).map((n) => {
                            return {
                                key: n ,
                                content: '',
                               // type: 'text'
                            }
                        });

                        t.setting.column = number_column;
                        
                        if (t?.setting?.values && t.setting.values.length > 0) {
                            values = t.setting.values;
                        }

                        t.setting.values = values;
                        _columns = t;
                        return t;
                    }
                    else  return t;
                }))
            }
            
            return item;
        });

        Promise.all(_items).then(data => {
            //console.log('promise items', data)
            return data;
        }).then(data => {
            let nol = null;
            setValue(_columns);
            setSelected(number_column);
            setTemplateItems(data);
            setColumns(_columns)
            setInitialValues({
                values: [..._columns?.setting?.values ?? {}]
            })
        })

    }, []);

    const editCSSHandle = (item, unique) => {
        navigate(`/block/css/${handle}-column-${unique}`, {
            back : `/product/${handle}`
        });
    }

    const handleSelectChange = ((column) => {
        setSelected(Number(column))
        if (columns?.setting?.values) {
            columns.setting.column = column;
            /*
            if (selected > columns.setting.column) {
                const diff = selected - columns.setting.column;
                columns.setting.values.splice((1 - diff))
            }
            else {
                columns.setting.values.push(
                    {
                        key: column,
                        content: '',
                        type: 'text'
                    }
                )
                console.log('setting', values)
            }
            */
            
            columns.setting.values = [...Array(column - 1 + 1).keys()].map(x => x + 1).map((n) => {
                return {
                    key: n , 
                }
            });

            
            
            setValue(columns);
        }

    });


    const backHandle = () => {
        navigate('/')
    }

    const save = async lines => {
       // console.log('Saving', lines)
        const __lines = await Promise.all(lines.values.filter(async ln => {
            if (!ln.content) {
                return false;
            }
            return true;
        })).then(data => data);

        //console.log('data __lines', __lines)
        await Promise.all(__lines.map(async (line , index) => {
            line.key = line?.key ?? (index + 1);
            line.ID = btoa(index);
            line.index = index;
            line.contentType = line?.contentType ?? ['text']
            return line;
        })).then(data => {
            //console.log('data saved', data)
            dispatch(editBlock(value, {
                headline: value.label,
                column: selected,
                values: data.length ? data : value.values,
            }))
        })


        

        // value.values = lines?.values ? lines.values : value.values;
        /*
        states.template.items.forEach(async (item) => {
            if (item.items) {
                item.items.forEach(t => {
                    if (t.ID === value.ID) {
                        if (t?.setting?.values) {
                            t.setting.values.map((tt, index) => {
                                tt.key = index;
                            })
                        }

                        // setValue(t);
                    }
                })
            }
            
        })
        */
        
        await sleep(2000)
    }

    const updateValues = (key, input) => {
        //console.log('updateValues', [key, input])
        if (columns?.setting?.values) {
            let values = columns;
            let settings = columns.setting.values;
            let newSetting = settings.map(({ ...set }) => {
                if(key === set.key)
                    set.content = input.value;
                
                return set;
            })
            
            values.setting.values = newSetting
            //console.log('setting', values)
            setColumns(values);
        }
    }

    //console.log('use effect set', value)
    //console.log('use effect columns', columns)
    //console.log('_initialValues', initialValues)
    
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

                <SectionElement>
                <FormLayout>
                            <Select
                                label="Number of columns"
                                options={[
                                    {
                                        label: 1,
                                        value: 1
                                    },
                                    {
                                        label: 2,
                                        value: 2
                                    },
                                    {
                                        label: 3,
                                        value: 3
                                    },
                                    {
                                        label: 4,
                                        value: 4
                                    },
                                    
                                ]}
                                onChange={handleSelectChange}
                                value={selected}
                            />

                            <Form
                                onSubmit={save}        
                                initialValues={initialValues}
                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <AutoSave debounce={1000} save={save} />
                                        {(columns?.setting?.values.length) ? (
                                            columns.setting.values.filter(col => col.key).map(col => {
                                               
                                                return (
                                                    <div key={`key-${col.key}`} style={{ marginTop: '1rem' }}>
                                                        <Header>
                                                            <BackAction className={ 'space-between'}  style={{justifyContent: 'space-between'}}>
                                                                <TitleWrapper style={{padding: 0}}>
                                                                    <Heading><span className='capitalize'>{ `Column ${col.key}` }</span></Heading>
                                                                </TitleWrapper>
                                                                <ButtonRightWrapper style={{width: 'auto'}}>
                                                                    <Button onClick={() => {
                                                                        editCSSHandle(col, (col.key + 1));
                                                                    }}>Edit CSS</Button>
                                                                </ButtonRightWrapper>
                                                            </BackAction>
                                                        </Header>
                                                        <SectionElement>
                                                            <RemovePadding>
                                                                <RadioGroup style={{ marginTop: 5 }}>
                                                                    <Field type='select' name={`values.${col.key}.contentType`}>
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
                                                                <Field name={`values.${col.key}.content`}>
                                                                    {({ input, meta, ...rest }) => (
                                                                        <div>
                                                                        <TextField
                                                                            label="Content"        
                                                                            name={input.name}
                                                                            value={input.value}
                                                                            onChange={(val) => {
                                                                                input.onChange(val)
                                                                                updateValues(col.key, input)
                                                                            }}
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
                                        <pre style={{
                                            height: "195px",
                                            color: "#666",
                                            tabSize: 4,
                                            overflow: "auto",
                                            padding: "10px",
                                            border: "1px solid #e5e5e5",
                                            borderRadius: "3px",
                                            background: "#eee"
                                        }}>
                                            <code>{JSON.stringify(initialValues, null, 2)}</code>
                                            <code>{JSON.stringify(values, null, 2)}</code>
                                        </pre>
                                    </form>
                                )}
                            />  
                        </FormLayout>
                </SectionElement>
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