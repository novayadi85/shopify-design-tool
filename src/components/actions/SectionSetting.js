import React, { useCallback, useState, useEffect } from "react";
import { ActionList, Button, Icon, Popover, Select, TextField } from "@shopify/polaris";
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
    const [formData, setFormData] = useState({});

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
        return prop?.setting ?? {
            label: prop.label,
            columns: 'row'
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
                        <FieldGroup>
                            <Field name={`display`}>
									{({input}) => (
                                    <Select
                                        label="Display"
                                        name={input.name}
                                        value={input.value}
                                        options={[
                                            {
                                                label: 'Vertical', value: "rows"
                                            },
                                            {
                                                label: 'Horisontal', value: "columns"
                                            }
                                        ]}
                                        onChange={(value) => {
                                            handleFieldChange('display', value)
                                            input.onChange(value)
                                        }}
                                    />
								)}
                            </Field>
                        </FieldGroup>
                    </div>
                )}
    
            </Form>
        </>
    )

}