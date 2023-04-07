import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, Label, hsbToRgb, rgbString } from "@shopify/polaris";
import { Form, Field } from 'react-final-form';
import { Wrapper, RemovePadding } from "@styles/Sidebar";
import { setCssEditor, updateStyles } from '@store/style/action';
import { useDispatch, useSelector } from 'react-redux';
import AutoSave from '../actions/AutoSaveStyle';
import { stdStyles } from '@helper/style';
import { RGBAToHSB } from "@helper/color";
import { updateTemplate } from '../../store/template/action';
import { toCSS } from 'cssjson';

const suffixStyles = {
    minWidth: "24px",
    textAlign: "right",
};

const BgColorSelector = ({defaultValues}) => {
    const [popoverBgActive, setPopoverBgActive] = useState(false);
    const [bgColor, setBgColor] = useState({
		hue: 0,
		brightness: 1,
		saturation: 1
    });

    const rgbaBgColor = rgbString(hsbToRgb(bgColor));

    const togglePopoverBgActive = useCallback(
	    () => setPopoverBgActive((popoverBgActive) => !popoverBgActive),[]
    );

    const bgActivator = (
        <Wrapper BorderBottom={false} BorderTop={false} rem={true}>
            <TextField onFocus={togglePopoverBgActive} value={rgbaBgColor} label="Background Color" autoComplete="off" />
        </Wrapper>
    );

    useEffect(() => {
        if (defaultValues['background-color']) {
            let rba = defaultValues['background-color']
            let val = RGBAToHSB(rba);
            setBgColor(val);
        }
    }, []);

    return (
        <div style={{marginTop:10}}>
            <Popover
                active={popoverBgActive}
                activator={bgActivator}
                autofocusTarget="bg-node"
                onClose={togglePopoverBgActive}
            >	
                <Field name={`background-color`}>
                    {({ input, meta, ...rest }) => (
                        <ColorPicker onChange={(val) => {
                            input.onChange(rgbString(hsbToRgb(val)))
                            setBgColor(val)
                        }} name={input.name} color={bgColor} allowAlpha />
                    )}
                </Field>
            </Popover>
        </div>
    )
}

function BlockCss({type, templateType}) {
    const { handle } = useParams();
    const dispatch = useDispatch();
    const initial_values_styles = (useSelector(state => state.styles));
    const states = (useSelector(state => state));
    const initial_template = (useSelector(state => state.template));

    // const [templateOffer, setTemplate] = useState(null);
    const [fontSize, setFontSize] = useState(12);
    const [fontWeight, setFontWeight] = useState(400);
    const [popoverActive, setPopoverActive] = useState(false);
    const [maxWidth, setMaxWidth] = useState('1024px');
    const [align, setAlign] = useState('left');
    const [top, setTop] = useState(0);
    const [bottom, setBottom] = useState(0);
    const [columnType, setColumnType] = useState(initial_template?.setting?.columnType || 'automatic')
    const [widthColumn, setWidthColumn] = useState(initial_template?.setting?.widthColumn || 100)
	
    /*
    const [posLeft, setPosLeft] = useState(0);
	const [posTop, setPosTop] = useState(0);
	const [width, setWidth] = useState('100');
	const [height, setHeight] = useState('100');
	const [backgroundImage, setBackgroundImage] = useState(null);
    */

    const { products: { page, templateId, items },} = useSelector(state => state);

    const [color, setColor] = useState({
		hue: 0,
		brightness: 1,
		saturation: 1
	});

    const rgbaColor = rgbString(hsbToRgb(color));

	const togglePopoverActive = useCallback(
	    () => setPopoverActive((popoverActive) => !popoverActive),[]
    );
    
    const handleAlignChange = useCallback((selectedTabIndex) => setAlign(selectedTabIndex), []);    
    
	const activator = (
        <Wrapper BorderBottom={false} BorderTop={false} rem={true}>
            <TextField onFocus={togglePopoverActive} value={rgbaColor} label="Color" autoComplete="off" />
        </Wrapper>
    );

    

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
       // console.log('Saving', [handle, `sa-template-${templateId}`])
        if (handle === 'sa-product-block-offer') {
            dispatch(updateStyles(`sa-${type}-${templateId}`, lines));
        }
        else if(handle === 'global') {
            dispatch(updateStyles(`sa-template-${templateId}`, lines));
        }
        else if(handle === 'offer-setting') {
            dispatch(updateStyles(`sa-template-${templateId}`, lines));
        }
        else {
            dispatch(updateStyles(`sa-${type}-${handle}`, lines));
        }
        await sleep(2000)
    }

    const InitialValues = () => {
        let initialHandle = `sa-${type}-${handle}`;
        if (handle === 'sa-product-block-offer') {
            initialHandle = `sa-${type}-${templateId}`;
        }
        else if (handle === 'global') {
            initialHandle = `sa-template-${templateId}`
        }
        else if (handle === 'offer-setting') {
            initialHandle = `sa-template-${templateId}`
        }
        else {
            initialHandle = `sa-${type}-${handle}`;
        }

        if (initial_values_styles.items) {
            let found = initial_values_styles.items.find(item => item.ID === initialHandle);
            
            if (found) {
                const extraCSS = found.items;
                let newStyles = {
                    // ...stdStyles,
                    ...extraCSS
                }

                // console.log('newStyles', extraCSS)

                if (newStyles) {
                    if (newStyles['background-type'] && newStyles['background-type'] === 'color') {
                        delete newStyles['background'];
                    }
                }

                return newStyles;
            }
        }

        return stdStyles;
    }

    const _initialValues = InitialValues(); 
    
    useEffect(() => {
        const defaultValues = InitialValues(); 
       // console.log(defaultValues)
		if (defaultValues['color']) {
			let rba = defaultValues['color']
			let val = RGBAToHSB(rba);
			setColor(val);
        }
        
        if (defaultValues['text-align']) {
			setAlign(defaultValues['text-align']);
        }
        
        if (defaultValues['max-width']) {
			setMaxWidth(defaultValues['max-width']);
		}
        
        if (defaultValues['font-size']) {
			setFontSize(defaultValues['font-size'].replace('px', '').replace('vh', '').replace('em', ''));
		}

		if (defaultValues['font-weight']) {
			setFontWeight(defaultValues['font-weight'].replace('px', '').replace('vh', '').replace('em', ''));
        }
        
        if (defaultValues['padding-top']) {
            if(defaultValues['padding-top'] !== 'auto')
			setTop(defaultValues['padding-top'].replace('px', '').replace('vh', '').replace('em', ''));
        }
        
        if (defaultValues['padding-bottom']) {
            if(defaultValues['padding-top'] !== 'auto')
			setBottom(defaultValues['padding-bottom'].replace('px', '').replace('vh', '').replace('em', ''));
		}

        

    }, [])

    useEffect(() => {
        //console.log('states', states)
        let setting = initial_template?.setting ?? {};
        setting.columnType = columnType;
        setting.widthColumn = columnType != 'fixed' ? null : widthColumn; 
        const template = items[0]?.template || {}
        let classSection = 'flex-products';
        if (setting?.columnType) {
            
            let JSONCSSOBJ = {
                children: {},
            };

            if (setting?.columnType === 'automatic') {
                if (['bundle'].includes(template?.type_offer)) {
                    JSONCSSOBJ['children'][`.${classSection}`] = {
                        "children": {},
                        "attributes": {
                            "display": 'flex',
                            'justify-content': 'center',
                            'gap': '20px'
                        }
                    }
                }
                else {
                    JSONCSSOBJ['children'][`.${classSection}`] = {
                        "children": {},
                        "attributes": {
                            "width": "100%",
                            "display": 'block'
                        }
                    }
                }
                
            }

            if (setting?.columnType === 'fixed') {
                JSONCSSOBJ['children'][`.${classSection}`] = {
                    "children": {},
                    "attributes": {
                        "width": "100%",
                        'margin-right': '-15px',
                        'margin-left': '-15px',
                        "clear": "both",
                    }
                }

                JSONCSSOBJ['children'][`.${classSection}::after`] = {
                    "children": {},
                    "attributes": {
                        "clear": "both",
                        'content': '',
                    }
                }

                JSONCSSOBJ['children'][`.${classSection} > div`] = {
                    "children": {},
                    "attributes": {
                        "width": `${setting?.widthColumn}%`,
                        "float": 'left',
                        'position': 'relative',
                        'min-height': '1px',
                        'padding-right': '15px',
                        'padding-left': '15px',
                    }
                }

            }

            if (setting?.columnType === 'screen') {
                JSONCSSOBJ['children'][`.${classSection}`] = {
                    "children": {},
                    "attributes": {
                        "width": "100%",
                        "display": 'block'
                    }
                }
            }

            setting.css = toCSS(JSONCSSOBJ);
        }
        
        dispatch(updateTemplate({
            ...setting,
        })) 
         

    }, [columnType, widthColumn]);
    
    return (
        <div style={{marginTop: 10}}>
             <Form onSubmit={save}
                initialValues={_initialValues}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <AutoSave debounce={1000} save={save} />
                        {handle === 'offer-setting' ? (
                            <>
                                <div style={{marginTop:10}}>
                                    <Field name={`columnType`}>
                                    {({ input, meta, ...rest }) => (
                                        <Select
                                            label="Column type"
                                            options={
                                                [
                                                    { value: "automatic", label: "Automatic" },
                                                    { value: "screen", label: "100%" },
                                                    { value: "fixed", label: "Fixed" },
                                                ]
                                            }
                                            onChange={(val) => {
                                                setColumnType(val)
                                                input.onChange(val)
                                                
                                            }}
                                            value={columnType}
                                        />
                                    )}
                                    </Field>
                                </div>

                                {(columnType === 'fixed') ? (
                                <div style={{marginTop:10}}>
                                <Field name={`---width-column`}>
                                    {({ input, meta, ...rest }) => (
                                        <TextField
                                            output
                                            label="Width Column"
                                            name={input.name}
                                            value={widthColumn}
                                            onChange={(value) => {
                                                input.onChange(value)
                                                setWidthColumn(value)
                                            }}
                                        />
                                    )}
                                    </Field>
                                </div>
                                ) : (null)}

                                <div style={{ marginTop: 10 }}>
                                    <Field name={`max-width`}>
                                        {({ input, meta, ...rest }) => (
                                        
                                            <RangeSlider
                                                output
                                                label="Max width"
                                                step={1}
                                                value={maxWidth}
                                                width={maxWidth}
                                                min={0}
                                                max={1440}
                                                onChange={(val) => {
                                                    setMaxWidth(val);
                                                    input.onChange(`${maxWidth}${'px'}`)
                                                }}
                                                suffix={<p style={suffixStyles}>{`${maxWidth}px`}</p>}
                                            />
                                                
                                        )}
                                    </Field>
                                </div>
                            </>
                            
                        ) : null}
                        
                        <div style={{marginTop:10}}>
                            <Field name={`font-size`}>
                                {({ input, meta, ...rest }) => (
                                    <RangeSlider
                                        output
                                        label="Font Size"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={fontSize}
                                        fontSize={fontSize}
                                        onChange={(val) => {
                                            input.onChange(`${fontSize}px`)
                                            setFontSize(val)
                                        }}
                                        suffix={<p>{fontSize}px</p>}
                                    />
                                )}
                            </Field>
                        </div>
                        <div style={{marginTop:10}}>
                            <Field name={`font-weight`}>
                                {({ input, meta, ...rest }) => (
                                    <RangeSlider
                                        output
                                        label="Font Weight"
                                        min={100}
                                        max={700}
                                        step={100}
                                        value={fontWeight}
                                        fontSize={fontWeight}
                                        suffix={<p>{fontWeight}px</p>}
                                        onChange={(val) => {
                                            input.onChange(`${val}px`)
                                            setFontWeight(val)
                                        }}
                                        name={input.name}
                                    />
                                )}
                            </Field>     
                        </div>  
                        <div style={{marginTop:10}}>
                            <Popover
                                active={popoverActive}
                                activator={activator}
                                autofocusTarget="first-node"
                                onClose={togglePopoverActive}
                            >	
                                <Field name={`color`}>
                                    {({ input, meta, ...rest }) => (
                                        <ColorPicker onChange={(val) => {
                                            input.onChange(rgbString(hsbToRgb(val)))
                                            setColor(val)
                                        }} name={input.name} color={color} allowAlpha />
                                    )}
                                </Field>
                            </Popover>
                        </div>
                        <div style={{marginTop:10, marginBottom: 10}}>
                            <RemovePadding><Label>Text align</Label></RemovePadding>
                            <Field name={`text-align`}>
                                {({ input, meta, ...rest }) => (
                                    <ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Text align'}>
                                        <Button size="slim"  pressed={(align === 'left')? true: false} onClick={() => {
                                            handleAlignChange('left')
                                            input.onChange('left')
                                        }}>Normal</Button>
                                        <Button size="slim" pressed={(align === 'center')? true: false} onClick={() => {
                                            handleAlignChange('center')
                                            input.onChange('center')
                                        }}>Center</Button>
                                        <Button size="slim" pressed={(align === 'right')? true: false} onClick={() => {
                                            handleAlignChange('right')
                                            input.onChange('right')
                                        }}>Right</Button>
                                    </ButtonGroup>
                                )}
                            </Field>
                        </div>
                        <div style={{marginTop:10, marginBottom: 10}}>
                            <Field name={`padding-top`}>
                                {({ input, meta, ...rest }) => (
                                    <RangeSlider
                                        output
                                        label="Padding Top"
                                        min={0}
                                        max={300}
                                        step={1}
                                        value={top}
                                        fontSize={top}
                                        onChange={(val) => {
                                            setTop(val)
                                            input.onChange(`${val}px`)
                                        }}
                                        suffix={<p>{top}px</p>}
                                        name={input.name}
                                    />
                                )}
                            </Field>
                        </div>
                        <div style={{marginTop:10, marginBottom: 10}}>
                            <Field name={`padding-bottom`}>
                                {({ input, meta, ...rest }) => (
                                    <RangeSlider
                                        output
                                        label="Padding Bottom"
                                        min={0}
                                        max={300}
                                        step={1}
                                        value={bottom}
                                        fontSize={bottom}
                                        onChange={(val) => {
                                            setBottom(val)
                                            input.onChange(`${val}px`)
                                        }}
                                        suffix={<p>{bottom}px</p>}
                                        name={input.name}
                                    />
                                )}
                            </Field>
                        </div>   
                        <BgColorSelector defaultValues={ _initialValues} />

                        { /*
                        {templateType === 'badge' ||  templateType === 'ads' ? (
                            <>
                                <div style={{ marginTop: 10 }}>
                                    <Field name={`background-image`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Background Image(URL)"
                                                value={backgroundImage}
                                                onChange={(val) => {
                                                    input.onChange(val)
                                                    setBackgroundImage(val)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div>  

                                <div style={{ marginTop: 10 }}>
                                    <Field name={`width`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Width"
                                                value={width}
                                                onChange={(val) => {
                                                    input.onChange(`${val}px`)
                                                    setWidth(val)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div> 
                                <div style={{ marginTop: 10 }}>
                                    <Field name={`height`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Height"
                                                value={height}
                                                onChange={(val) => {
                                                    input.onChange(`${val}px`)
                                                    setHeight(val)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div> 
                                <div style={{ marginTop: 10 }}>
                                    <Field name={`top`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Top"
                                                value={posTop}
                                                onChange={(val) => {
                                                    input.onChange(`${val}px`)
                                                    setPosTop(val)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div> 
                                <div style={{ marginTop: 10 }}>
                                    <Field name={`left`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Left"
                                                value={posLeft}
                                                onChange={(val) => {
                                                    input.onChange(`${val}px`)
                                                    setPosLeft(val)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div> 
                            </>
                        ) : (<></>) }
                        */ }
                    </form>
                )}
            />
            
        </div>
    )
}

export default BlockCss;