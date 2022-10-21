import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Heading, Select, ColorPicker, Popover, TextField, Checkbox, hsbToRgb, rgbString } from "@shopify/polaris";
import { Header, BackAction, TitleWrapper, ButtonRightWrapper, Section as SectionElement, RadioGroup, RemovePadding, Flex} from "@styles/Sidebar";
import { Form, Field } from 'react-final-form';
import { Wrapper } from "@styles/Sidebar";
import { updateStyles } from '@store/style/action';
import { useDispatch, useSelector } from 'react-redux';
import AutoSave from '../actions/AutoSaveStyle';
import { stdStyles } from '@helper/style';
import { RGBAToHSB } from "@helper/color";

const BgColorSelector = ({defaultValues}) => {
    const [popoverBgActive, setPopoverBgActive] = useState(false);
    const [bgColor, setBgColor] = useState({
		hue: 0,
		brightness: 1,
		saturation: 0
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

function CustomSectionColumn({type, templateType}) {
    const { handle } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initial_values_styles = (useSelector(state => state.styles));
    const [popoverActive, setPopoverActive] = useState(false);
    const [posLeft, setPosLeft] = useState(0);
    const [radius, setRadius] = useState(0);
	const [posTop, setPosTop] = useState(0);
	const [width, setWidth] = useState('100');
	const [height, setHeight] = useState('100');
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [position, setPosition] = useState('absolute');
    const [lastInput, setLastInput] = useState(null);
    const [alignContent, setAlignContent] = useState('normal');
    const [alignItems, setAlignItems] = useState('normal');
    const [justify, setJustify] = useState('center');

    const { products: { page, templateId },} = useSelector(state => state);

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        /*
        if(lines['background-image']){
            lines['background-image'] = lines['background-image'].match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            lines['background-image'] = `url(${lines['background-image']})`
        }
        */

        if(lines['background-image']){
            lines['background-size'] = '100%';
        }

        dispatch(updateStyles(`sa-${type}-${handle}`, lines));
        localStorage.setItem('lastInput', lastInput);
        await sleep(2000)
    }

    const editCSSHandle = () => {
        navigate(`/section/css/${handle}`);
    }
       

    const InitialValues = () => {
        let initialHandle = `sa-${type}-${handle}`;
        if (initial_values_styles.items) {
            let found = initial_values_styles.items.find(item => item.ID === initialHandle);
            
            if (found) {
                const extraCSS = found.items;
                let newStyles = {
                    ...extraCSS
                }

                if (newStyles) {
                    if (newStyles['background-type'] && newStyles['background-type'] === 'color') {
                        delete newStyles['background'];
                    }

                    newStyles['justify-content'] = 'center';
                }

                return newStyles;
            }
        }

        if (stdStyles['left']) {
			stdStyles['left'] = stdStyles['left'].replace('px', '');
            if(stdStyles['left'] === 'auto') stdStyles['left'] = '0';
		}

        if (stdStyles['top']) {
			stdStyles['top'] = stdStyles['top'].replace('px','');
            if(stdStyles['top'] === 'auto') stdStyles['top'] = '0';
		}

        if (stdStyles['width']) {
			stdStyles['width'] = stdStyles['width'].replace('px','');
            if(stdStyles['width'] === 'auto') stdStyles['width'] = '100px';
		}

        if (stdStyles['height']) {
			stdStyles['height'] = stdStyles['height'].replace('px','');
            if(stdStyles['height'] === 'auto') stdStyles['height'] = '100px';
        }
        
        if (stdStyles['border-radius']) {
			stdStyles['border-radius'] = stdStyles['border-radius'].replace('px','');
            if(stdStyles['border-radius'] === 'auto') stdStyles['border-radius'] = '0px';
		}

        if (stdStyles['background-image']) {
            const result = stdStyles['background-image'].match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            stdStyles['background-image'] = result
        }
        
        if (stdStyles['background-image']) {
            const result = stdStyles['background-image'].match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            stdStyles['background-image'] = result
		}

        stdStyles.display = 'flex';
        stdStyles['justify-content'] = 'center';
        
        // console.log('stdStyles', stdStyles)
        return stdStyles;
    }

    const _initialValues =  InitialValues(); 
    
    useEffect(() => {
        
        const defaultValues = InitialValues(); 
        
        if (defaultValues['background-image']) {
			setBackgroundImage(defaultValues['background-image']);
		}

        if (defaultValues['left']) {
			setPosLeft(defaultValues['left'].replace('px', ''));
            if(posLeft === 'auto') setPosLeft(0);
		}

        if (defaultValues['top']) {
			setPosTop(defaultValues['top'].replace('px', ''));
            if(posTop === 'auto') setPosTop(0);
		}

        if (defaultValues['width']) {
			setWidth(defaultValues['width'].replace('px', ''));
            if(width === 'auto') setWidth(100);
		}

        if (defaultValues['height']) {
			setHeight(defaultValues['height'].replace('px', ''));
            if(height === 'auto') setHeight(100);
        }
        
        if (defaultValues['border-radius']) {
			setRadius(defaultValues['border-radius'].replace('px', ''));
            if(radius === 'auto') setPosTop(0);
		}

        if (defaultValues['background-image']) {
            const result = defaultValues['background-image'].match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            setBackgroundImage(result);
        }
        
        defaultValues['justify-content'] = 'center';
        
    }, [])
    
    return (
        <div style={{ marginTop: 25 }}>
            <Header>
                <BackAction className={ 'space-between'}  style={{justifyContent: 'space-between'}}>
                    <TitleWrapper style={{padding: 0}}>
                        <Heading style={{display: 'none'}}><span className='capitalize'>{ `Section` }</span></Heading>
                    </TitleWrapper>
                    <ButtonRightWrapper style={{width: 'auto'}}>
                        <Button onClick={editCSSHandle}>Edit CSS</Button>
                    </ButtonRightWrapper>
                </BackAction>
            </Header>
        
             <Form onSubmit={save}
                initialValues={_initialValues}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <AutoSave debounce={3000} save={save} />
                        <div style={{ marginTop: 10 }}>
                            <Field name={`align-content`}>
                                {({ input, meta, ...rest }) => (
                                    <Checkbox
                                        label="Center vertically"
                                        checked={input.value === 'center'? true : false}
                                        onChange={(val) => {
                                            if (val === true) {
                                                setAlignItems('center');
                                                setJustify('center');
                                                input.onChange('center');
                                            }
                                            else {
                                                input.onChange('normal');
                                            }
                                        }}
                                    />		
                            )}
                            </Field>
                            <Field name={`align-items`}>
                                {({ input, meta, ...rest }) => (
                                    <Checkbox
                                        label="Center horizontally"
                                        checked={input.value === 'center'? true : false}
                                        onChange={(val) => {
                                            if (val === true) {
                                                setAlignItems('center');
                                                setJustify('center');
                                                input.onChange('center');
                                            }
                                            else {
                                                input.onChange('normal');
                                            }
                                            
                                        }}
                                    />		
                            )}
                            </Field>
                            
                        </div>
                        <BgColorSelector defaultValues={ _initialValues} />
                        <div style={{ marginTop: 10 }}>
                            <Field name={`background-image`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="Background Image(URL)"
                                        value={backgroundImage}
                                        onChange={(val) => {
                                            input.onChange(`url(${val})`)
                                            setBackgroundImage(val)
                                            setLastInput('background-image');
                                        }}
                                        helpText="Paste the image URL here."
                                    />
                                )}
                            </Field>
                        </div> 
                        
                        <div style={{marginTop:10}}>
                            <Field name={`width`}>
                                {({ input, meta, ...rest }) => (
                                    <Field name={`width`}>
                                        {({ input, meta, ...rest }) => (
                                            <TextField
                                                output
                                                label="Width"
                                                value={width}
                                                focused={(localStorage.getItem('lastInput') === 'width') ? true : false}
                                                onChange={(val) => {
                                                    input.onChange(`${val}px`)
                                                    setWidth(val)
                                                    setLastInput('width');
                                                }}
                                                suffix={'px'}
                                            />
                                        )}
                                    </Field>
                                )}
                            </Field>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Field name={`height`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="Height"
                                        focused={(localStorage.getItem('lastInput') === input.name) ? true : false}
                                        value={height}
                                        onChange={(val) => {
                                            input.onChange(`${val}px`)
                                            setHeight(val)
                                            setLastInput('height');
                                        }}
                                        suffix={'px'}
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
                                        focused={(localStorage.getItem('lastInput') === input.name) ? true : false}
                                        onChange={(val) => {
                                            input.onChange(`${val}px`)
                                            setPosTop(val)
                                            setLastInput('top');
                                        }}
                                        placeholder={`0px`}
                                        suffix={'px'}
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
                                        focused={(localStorage.getItem('lastInput') === input.name) ? true : false}
                                        onChange={(val) => {
                                            input.onChange(`${val}px`)
                                            setPosLeft(val)
                                            setLastInput('left');
                                        }}
                                        placeholder={`0px`}
                                        suffix={'px'}
                                    />
                                )}
                            </Field>
                        </div> 
                        <div style={{ marginTop: 10 }}>
                            <Field name={`border-radius`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="Border Radius"
                                        value={radius}
                                        focused={(localStorage.getItem('lastInput') === input.name) ? true : false}
                                        onChange={(val) => {
                                            input.onChange(`${val}px`)
                                            setRadius(val)
                                            setLastInput('border-radius');
                                        }}
                                        placeholder={`0px`}
                                        suffix={'px'}
                                    />
                                )}
                            </Field>
                        </div> 
                        <div style={{ marginTop: 10, display: 'none' }}>
                            <Field name={`position`}>
                                {({ input, meta, ...rest }) => (
                                    <Select
                                        label="Position"
                                        options={
                                            [
                                                { value: "relative", label: "Relative" },
                                                { value: "absolute", label: "Absolute" },
                                                { value: "inherit", label: "Inherit" },
                                                { value: "initial", label: "Initial" },
                                            ]
                                        }
                                        onChange={(val) => {
                                            setPosition(val);
                                            input.onChange(val);
                                        }}
                                        value={position}
                                        />
                                )}
                            </Field>
                            <Field name={`background-size`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="background-size"
                                        value={'100%'}
                                        onChange={(val) => {
                                            input.onChange(`100%`)
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name={`justify-content`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="justify-content"
                                        value={'center'}
                                        onChange={(val) => {
                                            input.onChange(`center`)
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name={`display`}>
                                {({ input, meta, ...rest }) => (
                                    <TextField
                                        output
                                        label="display"
                                        value={(alignItems === 'center' || alignContent === 'center') ? 'flex' : 'block'}
                                        onChange={(val) => {
                                            input.onChange((alignItems === 'center') ? 'flex' : 'block')
                                        }}
                                    />
                                )}
                            </Field>
                            
                        </div> 
                        { /* <pre>{JSON.stringify(values, 0, 2)}</pre>  */}
                    </form>
                )}
            />
            
        </div>
    )
}

export default CustomSectionColumn;