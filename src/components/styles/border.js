import { Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, hsbToRgb, rgbString } from "@shopify/polaris";
import { useState, useCallback, useEffect} from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';
import { RGBAToHSB } from "../../helper/color";

function Border({initialValues}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState('all');
	const [widthType, setWidthType] = useState('px');
	const [width, setWidth] = useState(0);
	const [radius, setRadius] = useState(0);
	const [style, setStyle] = useState('solid');
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
	const handleWidthTypeChange = useCallback((selectedTabIndex) => setWidthType(selectedTabIndex),[]);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	const suffixStyles = {
		minWidth: "24px",
		textAlign: "right",
	};

	useEffect(() => {
		if (initialValues['border-type']) {
			setSelected(initialValues['border-type']);
		}

		if (initialValues['border-radius']) {
			setRadius(initialValues['border-radius']);
		}

		if (initialValues['border-color']) {
			let rba = initialValues['border-color']
			let val = RGBAToHSB(rba);
			setColor(val);
		}

		if (initialValues['border-width']) {
			setWidth(initialValues['border-width']);
		}

		if (initialValues['border-style']) {
			setStyle(initialValues['border-style']);
		}

		if (initialValues['border-style']) {
			setStyle(initialValues['border-style']);
		}

		/*
		if (initialValues['border-left']) {
			setSelected('left');
		}

		if (initialValues['border-top']) {
			setSelected('top');
		}

		if (initialValues['border-right']) {
			setSelected('right');
		}

		if (initialValues['border-bottom']) {
			setSelected('bottom');
		}
		*/

		//"border-type": "left"

	}, [])


	return (
		<li className="has-toggle">
			<div className="flex link border-bottom" onClick={handleToggle}>
				<Button
					ariaExpanded={open}
					ariaControls="basic-collapsible"
					plain 
					monochrome
					removeUnderline>Border</Button>
						
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
			</div>
			
			<Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper className="container-fields" BorderBottom={true}>
					<Field name={`border-type`}>
						{({ input, meta, ...rest }) => (
							<Select
								label="Border Type"
								options={
								[
								{ value: "all", label: "All" },
								{ value: "left", label: "Left" },
								{ value: "right", label: "Right" },
								{ value: "top", label: "Top" },
								{ value: "bottom", label: "Bottom" },
								{ value: "none", label: "None" },
								]
								}
								value={selected}
								onChange={(val) => {
									setSelected(val)
									input.onChange(val)
								}}
							/>
							
						)}
					</Field>

               <div style={{ marginTop: 10, display: 'inline-block', width: '100%' }}>
                  	<div style={{marginTop:10, marginBottom: 10}}>
						<Field name={`border-width`}>
							{({ input, meta, ...rest }) => (
								<RangeSlider
									output
									label="Border Width"
									min={0}
									max={100}
									step={1}
									value={width}
									fontSize={width}
									suffix={<p style={suffixStyles}>{width}</p>}
									onChange={(val) => {
										input.onChange(`${val}${widthType}`)
										setWidth(val)
									}}
									name={input.name}
								/>
							)}
						</Field>
							
                     <ButtonGroup segmented>
                        <Button size="slim" pressed={(widthType === 'px')? true: false} onClick={() => handleWidthTypeChange('px')}>px</Button>
                        <Button size="slim" pressed={(widthType === 'vh')? true: false} onClick={() => handleWidthTypeChange('vh')}>vh</Button>
                        <Button size="slim" pressed={(widthType === 'em')? true: false} onClick={() => handleWidthTypeChange('em')}>em</Button>
					</ButtonGroup>
							
                  	</div>
					<div style={{ marginTop: 10, marginBottom: 10 }}>
						<Field name={`border-style`}>
							{({ input, meta, ...rest }) => (
								<Select
									label="Style"
									options={
									[
									{ value: "solid", label: "solid" },
									{ value: "dotted", label: "dotted" },
									{ value: "dashed", label: "dashed" },
									{ value: "double", label: "double" },
									{ value: "groove", label: "groove" },
									{ value: "ridge", label: "ridge" },
									{ value: "inset", label: "inset" },
									{ value: "outset", label: "outset" },
									]
									}
									onChange={(val) => {
										setStyle(val)
										input.onChange(val)
									}}
									value={style}
								/>
							)}
						</Field>
                     
					</div>
					<div style={{marginTop:10, marginBottom: 10}}>
						<Field name={`border-radius`}>
							{({ input, meta, ...rest }) => (
								<RangeSlider
									output
									label="Border Radius"
									min={0}
									max={100}
									step={1}
									value={radius}
									fontSize={radius}
									suffix={<p style={suffixStyles}>{radius}px</p>}
									onChange={(val) => {
										input.onChange(`${val}px`)
										setRadius(val)
									}}
									name={input.name}
								/>
							)}
						</Field>	
                  	</div>	

						
				<Popover
					active={popoverActive}
					activator={activator}
					autofocusTarget="first-node"
					onClose={togglePopoverActive}
				>
					<Field name={`border-color`}>
						{({ input, meta, ...rest }) => (
							<ColorPicker onChange={(val) => {
								input.onChange(rgbString(hsbToRgb(val)))
								setColor(val)
							}} name={input.name} color={color} allowAlpha />
						)}
					</Field>
				</Popover>

               </div>

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Border;