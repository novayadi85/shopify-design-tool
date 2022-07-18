import { Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, Label, hsbToRgb, rgbString } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { RemovePadding } from "../../styles/Sidebar";
import { Field } from 'react-final-form';
import { RGBAToHSB } from "../../helper/color";

function Font({initialValues}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState('normal');
	const [fontFamily, setFontFamily] = useState('arial');
	const [fontSize, setFontSize] = useState(12);
	const [fontWeight, setFontWeight] = useState(400);
	const [fontStyle, setFontStyle] = useState('normal');
	const [fontElement, setFontElement] = useState('px');
	const [color, setColor] = useState({
		hue: 0,
		brightness: 1,
		saturation: 0
	});

	const rgbaColor = rgbString(hsbToRgb(color));

	const [popoverActive, setPopoverActive] = useState(false);

	const togglePopoverActive = useCallback(
	() => setPopoverActive((popoverActive) => !popoverActive),[]
	);

	const activator = (
	<Wrapper BorderBottom={false} BorderTop={false} rem={true}>
		<TextField onFocus={togglePopoverActive} value={rgbaColor} label="Color" autoComplete="off" />
	</Wrapper>
	);

	const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);
	const handleFontStyleChange = useCallback((selectedTabIndex) => setFontStyle(selectedTabIndex),[]);
	const handleFontElmChange = useCallback((selectedTabIndex) => setFontElement(selectedTabIndex),[]);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	const suffixStyles = {
		minWidth: "24px",
		textAlign: "right",
	};

	useEffect(() => {
		if (initialValues['font-family']) {
			setFontFamily(initialValues['font-family']);
		}

		if (initialValues['font-style']) {
			setFontStyle(initialValues['font-style']);
		}

		if (initialValues['font-size']) {
			setFontSize(initialValues['font-size']);
		}

		if (initialValues['color']) {
			let rba = initialValues['color']
			let val = RGBAToHSB(rba);
			setColor(val);
		}

		if (initialValues['font-weight']) {
			setFontWeight(initialValues['font-weight']);
		}

	}, [])

	console.log('font-size', fontSize)

	return (
		<li className="has-toggle">
			<div className="flex link border-bottom" onClick={handleToggle}>
				<Button
					ariaExpanded={open}
					ariaControls="basic-collapsible"
					plain 
					monochrome
					removeUnderline>Font</Button>
						
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
			</div>
			
			<Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper className="container-fields" BorderBottom={true}>
					<ButtonGroup segmented>
						<Button size="slim" pressed={(selected === 'normal')? true: false} onClick={() => handleTabChange('normal')}>Normal</Button>
						<Button size="slim" pressed={(selected === 'google')? true: false} onClick={() => handleTabChange('google')}>Google Font</Button>
					</ButtonGroup>

					<div style={{ marginTop: 10, display: 'inline-block', width: '100%' }}>
						{(selected === 'google') ? (
						<Field name={`font-family`}>
							{({ input, meta, ...rest }) => (
								<Select
									label="Font family"
									options={
									[
										{ value: "arial", label: "Arial" },
										{ value: "arial black", label: "Arial Black" },
										{ value: "comic sans ms", label: "Comic Sans MS" },
										{ value: "georgia", label: "Georgia" },
										{ value: "courier new", label: "Courier New" },
										{ value: "helvetica", label: "Helvetica" },
										{ value: "impact", label: "Impact" },
										{ value: "serif", label: "Serif" },
										{ value: "times new roman", label: "Times New Roman" },
										{ value: "trebuchet ms", label: "Trebuchet MS" },
										{ value: "verdana", label: "Verdana" },
									]
									}
									value={fontFamily}
									fontFamily={fontFamily}
									onChange={(val) => {
										input.onChange(`${val}`)
										setFontFamily(val)
									}}
									name={input.name}
								/>
								)}
							</Field>
						) : (
							<Field name={`font-family`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Font family"
										options={
										[
											{ value: "arial", label: "Arial" },
											{ value: "arial black", label: "Arial Black" },
											{ value: "comic sans ms", label: "Comic Sans MS" },
											{ value: "georgia", label: "Georgia" },
											{ value: "courier new", label: "Courier New" },
											{ value: "helvetica", label: "Helvetica" },
											{ value: "impact", label: "Impact" },
											{ value: "serif", label: "Serif" },
											{ value: "times new roman", label: "Times New Roman" },
											{ value: "trebuchet ms", label: "Trebuchet MS" },
											{ value: "verdana", label: "Verdana" },
										]
										}
										value={fontFamily}
										fontFamily={fontFamily}
										onChange={(val) => {
											input.onChange(`${val}`)
											setFontFamily(val)
										}}
										name={input.name}
									/>
								)}
							</Field>

						)}

						<div style={{marginTop:10, marginBottom: 10}}>
							<RemovePadding><Label>Font style</Label></RemovePadding>
							<Field name={`font-style`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Font style'}>
										<Button size="slim" pressed={(fontStyle === 'normal')? true: false} onClick={() => {
										handleFontStyleChange('normal')
										input.onChange('normal')
									}}>Normal</Button>
										<Button size="slim" pressed={(fontStyle === 'italic')? true: false} onClick={() => {
										handleFontStyleChange('italic')
										input.onChange('italic')
									}}>Italic</Button>
									</ButtonGroup>
								)}
							</Field>
							
						</div>
						

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
									suffix={<p style={suffixStyles}>{fontWeight}</p>}
									onChange={(val) => {
										input.onChange(`${val}`)
										setFontWeight(val)
									}}
									name={input.name}
								/>
							)}
						</Field>
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
										input.onChange(`${fontSize}${fontElement}`)
										setFontSize(val)
									}}
									suffix={<p style={suffixStyles}>{fontSize}</p>}
								/>
							)}
						</Field>
						<ButtonGroup segmented>
							<Button size="slim" pressed={(fontElement === 'px')? true: false} onClick={() => handleFontElmChange('px')}>px</Button>
							<Button size="slim" pressed={(fontElement === 'vh')? true: false} onClick={() => handleFontElmChange('vh')}>vh</Button>
							<Button size="slim" pressed={(fontElement === 'em')? true: false} onClick={() => handleFontElmChange('em')}>em</Button>
						</ButtonGroup>
					</div>

					

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Font;