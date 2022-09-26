import { useEffect, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormLayout, TextField, Icon, Button, Modal, TextContainer, DataTable, Toast, Select} from '@shopify/polaris';
import { editBlock } from "@store/template/action";
import { ToolsMajor } from '@shopify/polaris-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ResourceIcon from '@icons/Resource';
import BlockCss from './BlockCss';
import { Form, Field } from 'react-final-form';
import AutoSave from '../actions/AutoSaveStyle';

function BlockContent(props) {
    const { value: prop } = props;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(prop);
    const [content, setContent] = useState(prop?.setting?.content);
    const [content2, setContent2] = useState(prop?.setting?.content2);
    const [focused, setFocused] = useState(prop?.label);
    const [sortedRows, setSortedRows] = useState(null);
    const [selected, setSelected] = useState(null);
    const [active, setActive] = useState(false);
    const [formLabel, setFormLabel] = useState(prop?.setting?.content?.formLabel);
    const [formName, setFormName] = useState(prop?.setting?.content?.formName);
    const [formType, setFormType] = useState(prop?.setting?.content?.formType);
    const [formValue, setFormValue] = useState(prop?.setting?.content?.defaultValue);
    const [status, setStatus] = useState(false);
    

    const handleChange = useCallback(() => setActive(!active), [active]);
    const handleChangeCSS = () => {

    }

    const handleContentChange = (val) => {
        setContent(val);
        dispatch(editBlock(value, {
            content: val,
            content2: content2,
            headline: val
        }))   
        setFocused(true);
    }
 
    const handleContentChange2 = (val) => {
        setContent2(val);
        dispatch(editBlock(value, {
            ...value.setting,
            content2: val,
        }))   
        setFocused(true);
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            return setLoading(false);
        }, 500)

    }, []);

    const CodeAction = () => {
        return (
            <Button plain size="slim" onClick={handleChange}>
                <ResourceIcon/>
            </Button>
            
        );
    }

    const LineCSSAction = () => {
        return (
            <>
                <Button plain size="slim" onClick={handleChangeCSS} icon={ ToolsMajor}/>
                <Button plain size="slim" onClick={handleChange}>
                    <ResourceIcon/>
                </Button>
            </>
        );
    }

     function sortData(rows, index, direction) {
        return [...rows].sort((rowA, rowB) => {
          const amountA = parseFloat(rowA[index].substring(1));
          const amountB = parseFloat(rowB[index].substring(1));
    
          return direction === "descending" ? amountB - amountA : amountA - amountB;
        });
      }
    

    const ShortCodes = () => {
        // console.log('codes', [])
        let codes = [];
        let used = [];
        let whiteList = [
            "addToCart",
            "headline",
            "description",
            "offer_text_cart_product_accomplished",
            "offer_text_cart_product_not_accomplished",
            "offer_text_cart_top_accomplished",
            "offer_text_cart_top_not_accomplished",
            "offer_text_collection_top",
            "offer_text_product_top",
            "title",
            "totalNormalPrice",
            "totalOfferPrice",
            "totalOfferSave",
            "OfferSave",
            "featured_image",
            "handle",
            "image",
            "imageHtml",
            "images",
            "normalPrice",
            "offerId",
            "offerPrice",
            "price",
            "productOfferSaveInProcent",
            "quantity",
            "selectVariants",
            "specialPrice",
            "tags",
            "totalOfferPrice",
            "totalOfferSaveInProcent",
            "url",
           // "variants",
            "vendor",
            "compare_at_price",
            "textButton",
            "link",
        ];

        if (localStorage.getItem('params')) {
            const items = JSON.parse(localStorage.getItem('params'));
            for (const property in items) {
                if (whiteList.includes(property) && property !== 'quantity') {
                    if (!used.includes(`${property}`)) {
                        // codes.push({ [property]: items[property] })
                        used.push(property)

                        codes.push({
                            key: property,
                            type: typeof items[property]
                        })
                    }
                }

                if (property === 'products') {
                    const products = items[property]
                    for (const index in products) {
                        for (const key in products[index]) {
                            if (whiteList.includes(key)) {
                                if (!used.includes(`product.${key}`)) {
                                    /*
                                    codes.push({
                                        [`product.${key}`]: products[index][key]
                                    })
                                    */
                                    
                                    if (key === 'image') continue;
                                    
                                    if (products[index] !== '') {
                                        codes.push({
                                            key: `product.${key}`,
                                            type: typeof products[index][key]
                                        })
                                        used.push(`product.${key}`)
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            } 

            
            if (value.handle === "block-button") {
                codes = [];
                used = [];
                for (const property in items) {
                    if (property === 'products') {
                        const products = items[property]
                        for (const index in products) {
                            for (const key in products[index]) {
                                if (whiteList.includes(key)) {
                                    if (!used.includes(`product.${key}`)) {
                                        if (key === 'image') continue;
                                        
                                        if (products[index] !== '') {
                                            codes.push({
                                                key: `${key}`,
                                                type: typeof products[index][key]
                                            })

                                            used.push(`${key}`)
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
                } 

            }
        }


        const _initiallySortedRows = codes.map(co => {
            //let delimeter = '{{}}';
            let example = (co.type === 'object') ? `{{${co.key}[0].fieldName}}` : `{{${co.key}}}`;
            
            if (value.handle === "block-button") {
                example = (co.type === 'object') ? `[${co.key}[0].fieldName]` : `[${co.key}]`;

                if (co.type === 'object' && co.key.includes('images')) {
                    example = `[${co.key}[0].src]`
                }

                if (co.type === 'object' && co.key.includes('variants')) {
                    example = `[{co.key}[0].title]`
                }

                if (co.type === 'string' && co.key === 'product.image') {
                    co.type = 'object';
                    example = `[${co.key}.src]`
                }

                if (co.key.includes('price') || co.key.includes('Price')) {
                    example = `[${co.key} | money]`
                }
            
                if (co.key.includes('addToCart')) {
                    example = `[addToCart | label: "Add To Cart"]`
                }

            }
            else {
                

                if (co.type === 'object' && co.key.includes('images')) {
                    example = `{{${co.key}[0].src}}`
                }

                if (co.type === 'object' && co.key.includes('variants')) {
                    example = `{{${co.key}[0].title}}`
                }

                if (co.type === 'string' && co.key === 'product.image') {
                    co.type = 'object';
                    example = `{{${co.key}.src}}`
                }

                if (co.key.includes('price') || co.key.includes('Price')) {
                    example = `{{${co.key} | money}}`
                }
            
                if (co.key.includes('addToCart')) {
                    example = `{{addToCart | label: "Add To Cart"}}`
                }

            }


            return [
                co.key,
                co.type,
                <CopyToClipboard
                    text={example}
                    onCopy={() => alert('copied')}>
                    <>{example}</>
                </CopyToClipboard>
            ]
        })

        // setInitiallySortedRows(_initiallySortedRows);

        const rows = sortedRows ? sortedRows : _initiallySortedRows;

        return (
            <DataTable
                columnContentTypes={[
                    "text",
                    "text",
                    "text",
                ]}
                headings={[
                    "Shortcode",
                    "Type",
                    "How to use?",
                ]}
                rows={rows}
                //sortable={[true, false, false]}
                //handleSort={({rows, index, direction}) => sortData(rows, index, direction)}
                hasZebraStripingOnData
                stickyHeader
                />
        )
    }

    const toggleActive = useCallback(() => setStatus((status) => !status), []);

    const toastMarkup = status ? (
        <Toast content="Copied" onDismiss={toggleActive} />
    ) : null;

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        console.log('Saving', [lines])
        if (!lines?.formType) lines.formType = 'input';
        dispatch(editBlock(value, {
            content: lines,
            headline: lines?.formLabel
        })) 

        await sleep(2000)
    }

    const InitialValues = () => {
        return prop?.setting?.content ? prop.setting.content : {}
    }

    const _initialValues = InitialValues(); 

    return (
        <>
            {toastMarkup}
            {(!prop?.handle) ? (
                <FormLayout>
                    <TextField labelAction={{ content: <CodeAction/> }} multiline={4} disabled label="Text" showCharacterCount={true} focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                </FormLayout>
            ) : (
                    <FormLayout>
                        {(value.handle === "block-button") ? (
                            <>
                                <div style={{marginBottom: 10}}>
                                    <TextField labelAction={{ content: <LineCSSAction /> }} multiline={4} label="Text 1" showCharacterCount={true} onChange={handleContentChange} value={content} autoComplete="off" />
                                
                                </div>
                                <div style={{marginBottom: 0}}>
                                    <TextField labelAction={{ content: <LineCSSAction /> }} multiline={4} label="Text 2" showCharacterCount={true} onChange={handleContentChange2} value={content2} autoComplete="off" />
                                </div>
                                
                            </>
                            
                        ) : (
                            (value.handle === 'block-form') ? (
                                <Form onSubmit={save}
                                    initialValues={_initialValues}
                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit}>
                                            <AutoSave debounce={1000} save={save} />
                                            <div style={{marginTop:10}}>
                                                <Field name={`formLabel`}>
                                                    {({ input, meta, ...rest }) => (
                                                        <TextField
                                                            label="Label"
                                                            value={formLabel}
                                                            onChange={(val) => {
                                                                input.onChange(`${val}`)
                                                                setFormLabel(val)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            <div style={{marginTop:10}}>
                                                <Field name={`formName`}>
                                                    {({ input, meta, ...rest }) => (
                                                        <Select
                                                        label="Form type"
                                                        options={
                                                        [
                                                            { value: "first_name", label: "Firtname" },
                                                            { value: "last_name", label: "Lastname" },
                                                            { value: "email", label: "Email" },
                                                            { value: "submit", label: "Submit" },
                                                            { value: "agreement", label: "Agreement" },
                                                        ]
                                                        }
                                                        placeholder={'Choose type: '}
                                                            
                                                        value={formName}
                                                        onChange={(val) => {
                                                            input.onChange(`${val}`)
                                                            setFormName(val)
                                                        }}
                                                        name={input.name}
                                                    />
                                                    )}
                                                </Field>
                                            </div>
                                            { /* <div style={{marginTop:10}}>
                                                <Field name={`formType`}>
                                                    {({ input, meta, ...rest }) => (
                                                        <Select
                                                        label="Form type"
                                                        options={
                                                        [
                                                            { value: "input", label: "Input" },
                                                            { value: "checkbox", label: "Checkbox" },
                                                            { value: "button", label: "Button" },
                                                        ]
                                                        }
                                                        placeholder={'Choose type: '}
                                                            
                                                        value={formType}
                                                        onChange={(val) => {
                                                            input.onChange(`${val}`)
                                                            setFormType(val)
                                                        }}
                                                        name={input.name}
                                                    />
                                                    )}
                                                </Field>
                                            </div>
                                            */ }
                                            <div style={{ marginTop: 10 }}>
                                                <Field name={`defaultValue`}>
                                                    {({ input, meta, ...rest }) => (
                                                        <TextField
                                                            label="DefaultValue"
                                                            value={formValue}
                                                            onChange={(val) => {
                                                                input.onChange(`${val}`)
                                                                setFormValue(val)
                                                            }}
                                                            multiline={2}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        </form>
                                        )}
                                    />
                            ) : (
                                <TextField labelAction={{ content: <CodeAction/> }} multiline={4} label="Text" showCharacterCount={true}  focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />     
                            )
                        )}
                    
                </FormLayout>
            )}

            <BlockCss type={'block'}/>          
            <div style={{ height: "300px" }}>
                <Modal
                    open={active}
                    onClose={handleChange}
                    title="Copy and paste code below to insert in textfield"
                    primaryAction={{
                    content: "Close",
                    onAction: handleChange,
                    
                    }}
                    large
                >
                    <Modal.Section>
                        <TextContainer>
                            <ShortCodes/>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </div>         
        </>
    )
}

export default BlockContent;