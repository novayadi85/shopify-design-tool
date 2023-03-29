import { useEffect, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormLayout, TextField, Icon, Button, Modal, TextContainer, DataTable, Toast, Link, RadioButton, Label} from '@shopify/polaris';
import { editBlock } from "@store/template/action";
import { ToolsMajor } from '@shopify/polaris-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ResourceIcon from '@icons/Resource';
import BlockCss from './BlockCss';
import { FieldGroup } from '../../styles/Sidebar';

function BlockContent(props) {
    const { value: prop } = props;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(prop);
    const [content, setContent] = useState(prop?.setting?.content ?? prop?.label );
    const [content2, setContent2] = useState(prop?.setting?.content2);
    const [focused, setFocused] = useState(prop?.label);
    const [sortedRows, setSortedRows] = useState(null);
    const [selected, setSelected] = useState(null);
    const [active, setActive] = useState(false);
    const [status, setStatus] = useState(false);

    const { products }  = useSelector(state => state);
    const [template_type, setTemplateType] = useState(null)
    
    const handleChange = useCallback(() => setActive(!active), [active]);
    const handleChangeCSS = () => {

    }

    const [column, setColumn] = useState(prop?.setting?.column ?? 'column3');

    const handleChangeColumn = (val) => {
        //console.log('column', content)
        setColumn(val);
        dispatch(editBlock(value, {
            ...value.setting,
            column: val,
            headline: content,
            content: content
        }))   

        setFocused(true);
    }

    const handleContentChange = (val) => {
        
        setContent(val);
        dispatch(editBlock(value, {
            content: val,
            content2: content2,
            headline: val,
            column: column
        }))   
        setFocused(true);
    }
 
    const handleContentChange2 = (val) => {
        setContent2(val);
        dispatch(editBlock(value, {
            ...value.setting,
            content2: val,
            column: column
        }))   
        setFocused(true);
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            return setLoading(false);
        }, 500)

        if (products?.items) {
            setTemplateType(products.items[0]?.template?.type_offer)
        }

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

    //console.log('TYPE', template_type)

    return (
        <>
            {toastMarkup}
            {(!prop?.handle) ? (
                <FormLayout>
                    <TextField labelAction={{ content: <CodeAction/> }} multiline={4} label="Text" showCharacterCount={true} focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
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

                                <FieldGroup style={{display: `${template_type === 'bannerText' || template_type === 'badge' || template_type === 'ads'  ? 'none': 'block'}`}}>
                                    <Label>Column</Label>
                                    <FieldGroup style={{margin:0}}>
                                        <RadioButton
                                            label={`Column Left`} 
                                            id="column1"
                                            name="column"
                                            checked={column === 'column1'}
                                            onChange={(value) => {
                                                handleChangeColumn('column1')
                                            }}
                                        />   
                                    </FieldGroup>
                                        
                                    <FieldGroup style={{margin:0}}>
                                        <RadioButton
                                            label={`Column Right`} 
                                            id="column2"
                                            name="column"
                                            checked={column === 'column2'}
                                            onChange={(value) => {
                                                handleChangeColumn('column2')
                                            }}
                                        />      
                                    </FieldGroup>
                                    <FieldGroup style={{margin:0}}>
                                        <RadioButton
                                            label={`Full Column`} 
                                            id="column3"
                                            checked={column === 'column3'}
                                            name="column"
                                            onChange={(value) => {
                                                handleChangeColumn('column3')
                                            }}
                                        />
                                    </FieldGroup> 
                                </FieldGroup>  
                            </>
                            
                        ) : (
                                <>  
                                    <div style={{display: `${template_type === 'bannerText' ? 'none': 'block'}`}}>
                                        <TextField labelAction={{ content: <CodeAction/> }} multiline={4} label="Text" showCharacterCount={true}  focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                                    </div>
                                    <FieldGroup style={{ display: `${template_type === 'bannerText' || template_type === 'badge' || template_type === 'ads' ? 'none' : 'block'}` }}>
                                        <Label>Column</Label>
                                        <FieldGroup style={{margin:0}}>
                                            <RadioButton
                                                label={`Column Left`} 
                                                id="column1"
                                                name="column"
                                                checked={column === 'column1'}
                                                onChange={(value) => {
                                                    handleChangeColumn('column1')
                                                }}
                                            />   
                                        </FieldGroup>
                                            
                                        <FieldGroup style={{margin:0}}>
                                            <RadioButton
                                                label={`Column Right`} 
                                                id="column2"
                                                name="column"
                                                checked={column === 'column2'}
                                                onChange={(value) => {
                                                    handleChangeColumn('column2')
                                                }}
                                            />      
                                        </FieldGroup>
                                        <FieldGroup style={{margin:0}}>
                                            <RadioButton
                                                label={`Full Column`} 
                                                id="column3"
                                                checked={column === 'column3'}
                                                name="column"
                                                onChange={(value) => {
                                                    handleChangeColumn('column3')
                                                }}
                                            />
                                        </FieldGroup> 
                                    </FieldGroup>    
                                </>
                            
                        )}
                    
                </FormLayout>
            )}

            <BlockCss type={'block'} templateType={template_type}/> 

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