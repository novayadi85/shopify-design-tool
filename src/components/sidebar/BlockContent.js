import { useEffect, useState, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { FormLayout, TextField, Icon, Button, Modal, TextContainer, DataTable, Toast, Link} from '@shopify/polaris';
import { editBlock } from "@store/template/action";
import { ClipboardMinor } from '@shopify/polaris-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function BlockContent(props) {
    const  { value: prop } = props
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(prop);
    const [content, setContent] = useState(prop?.label);
    const [focused, setFocused] = useState(prop?.label);
    const [sortedRows, setSortedRows] = useState(null);
    const [selected, setSelected] = useState(null);
    const [active, setActive] = useState(false);
    const [status, setStatus] = useState(false);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const handleContentChange = (val) => {
        setContent(val);
        dispatch(editBlock(value, {
            content: val,
            headline: val
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
                Shortcode
            </Button>
            
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
            "variants",
            "vendor",
            "compare_at_price",
            "textButton",
            "link"
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
        }

        

        const _initiallySortedRows = codes.map(co => {
            let example = (co.type === 'object') ? `{{${co.key}[0].fieldName}}` : `{{${co.key}}}`;

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


    return (
        <>
            {toastMarkup}
            {(!prop?.handle) ? (
                <FormLayout>
                    <TextField labelAction={{ content: <CodeAction/> }} multiline={4} disabled label="Text" showCharacterCount={true} focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                </FormLayout>
            ) : (
                <FormLayout>
                    <TextField labelAction={{ content: <CodeAction/> }} multiline={4} label="Text" showCharacterCount={true}  focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                </FormLayout>
            )}

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