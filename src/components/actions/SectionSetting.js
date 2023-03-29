import React, { useCallback, useState, useEffect } from "react";
import { ActionList, Button, Icon, Popover, Select, TextField, Checkbox, RadioButton, Label } from "@shopify/polaris";
import { TextAlignmentLeftMajor, CirclePlusOutlineMinor, BlockMinor } from "@shopify/polaris-icons";
import { useSelector, useDispatch } from 'react-redux';
import { getSidebar, addNewBlock } from "../../store/template/action";
import { editBlock } from "@store/template/action";
import { FieldGroup } from "../../styles/Sidebar";
import AutoSave from './AutoSave';
import { Form, Field } from 'react-final-form'

export default function SectionSetting({props}) {
    const dispatch = useDispatch();
    const  {value: prop } = props
    const [focused, setFocused] = useState(prop?.label ?? false);
    const [formData, setFormData] = useState({
        columns: 'rows'
    });
    const { products }  = useSelector(state => state);
    const [template_type, setTemplateType]  = useState(null)

    const handleFieldChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    };

    useEffect(() => {
        /*
        dispatch(editBlock(prop, {
            headline: formData.label,
            display: formData.display,
            label: formData.label
        })) 

        console.log(formData)
        */
        if (products?.items) {
            setTemplateType(products.items[0]?.template?.type_offer)
            if(prop.handle === 'sa-product-block-offer')
            prop.setting.label = products.items[0]?.template?.label ?? prop?.setting?.label
        }
    }, [])

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        let setting = prop?.setting ?? {};
        lines.label = lines?.heading ?? prop.label

        dispatch(editBlock(prop, {
            ...setting,
            ...lines
        })) 

        await sleep(2000)
    }

    const InitialValues = () => {
        
        if (template_type === 'tier') {
            if(!prop?.setting){
                prop.setting = {

                }
            }
            prop.setting.columns = 'rows'
            prop.setting.display = 'rows'
        }
        
        return prop?.setting ?? {
            label: prop.label,
            columns: 'rows',
            separator: false
        };
    }

    const _initialValues = InitialValues(); 
    
    return (
        <>
            <Form
                onSubmit={save}
                initialValues={_initialValues}
                subscription={{}}
                >
                {() => (
                    <div className="form">
                        <AutoSave debounce={1000} save={save} />
                        {(template_type === 'tier') ? (null): (
                            <>
                                <Label>Product Placement</Label>
                                <FieldGroup style={{marginBottom: 0, marginTop: 0}}>
                                    <Field name={`display`}>
                                        {({input}) => (
                                            <RadioButton
                                                label={`Side by side`} 
                                                id="columns"
                                                name="display"
                                                checked={_initialValues['columns'] === 'columns' || input.value === 'columns'}
                                                onChange={(value) => {
                                                    handleFieldChange('display', 'columns')
                                                    input.onChange('columns')
                                                }}
                                            />   
                                        )}
                                    </Field>
                                </FieldGroup>
                                <FieldGroup style={{marginTop: 0}}>
                                    <Field name={`display`}>
                                        {({input}) => (
                                            <RadioButton
                                                label={`Under each other`} 
                                                id="rows"
                                                name="display"
                                                checked={_initialValues['columns'] === 'rows' || input.value === 'rows'}
                                                onChange={(value) => {
                                                    handleFieldChange('display', 'rows')
                                                    input.onChange('rows')
                                                }}
                                            />   
                                        )}
                                    </Field>
                                </FieldGroup>
                            </>
                        )}
                        
                        <FieldGroup>
                            <Field name={`widthColumn1`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="Width Column Left"
                                        name={input.name}
                                       
                                        value={input.value}
                                        onChange={(value) => {
                                            handleFieldChange('widthColumn1', value)
                                            input.onChange(value)
                                        }}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                        <FieldGroup>
                            <Field name={`widthColumn2`}>
                                    {({ input, meta, ...rest }) => (
                                        <TextField
                                            output
                                            label="Width Column Right"
                                            name={input.name}
                                            
                                            value={input.value}
                                            onChange={(value) => {
                                                handleFieldChange('widthColumn2', value)
                                                input.onChange(value)
                                            }}
                                        />
                                    )}
                            </Field>
                        </FieldGroup>
                        {(template_type === 'tier') ? (null) : (
                            <FieldGroup>
                                <Field name={`separator`}>
                                    {({ input }) => (
                                        <Checkbox
                                            label="Show (+) in between products"
                                            checked={_initialValues['separator'] ? true : false}
                                            onChange={(value) => {
                                                handleFieldChange('separator', value)
                                               // console.log('separator', value)
                                                input.onChange(value)
                                            }}
                                        />
                                    )}
                                </Field>
                            </FieldGroup>
                        )}
                        
                    </div>
                )}
    
            </Form>
        </>
    )

}