import { FormLayout, Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, hsbToRgb, rgbString, rgbToHsb } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';
import { RGBAToHSB } from "../../helper/color";
function Background({initialValues}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
	const [color, setColor] = useState({
		hue: 300,
		brightness: 1,
		saturation: 0.7
	});

	const rgbaColor = rgbString(hsbToRgb(color));
	const [popoverActive, setPopoverActive] = useState(false);
	const [rangeValue, setRangeValue] = useState(32);
	const handleRangeSliderChange = useCallback(
		(value) => setRangeValue(value),
		[]
	);

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),[]
	);

	const activator = (
		<Wrapper BorderBottom={false} BorderTop={false} rem={true}>
			<TextField onFocus={togglePopoverActive} value={rgbaColor} label="Color" autoComplete="off" />
		</Wrapper>
	);
	
    const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);
	//eslint-disable-next-line

	useEffect(() => {
		if (initialValues['background-type']) {
			setSelected(initialValues['background-type']);
		}

		if (initialValues['background-color']) {
			let rba = initialValues['background-color']
			let val = RGBAToHSB(rba);
			setColor(val);
		}

		if (initialValues['opacity']) {
			setRangeValue(initialValues['opacity']);
		}

	}, [])

    return (
        <li className="has-toggle">
          	<div className="flex link border-bottom" onClick={handleToggle}>
				<Button
					ariaExpanded={open}
					ariaControls="basic-collapsible"
					plain 
					monochrome
					removeUnderline
				>Background</Button>
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
            </div>
            
            <Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper BorderBottom={true}>
					
						<Field name={`background-type`}>
							{({ input, meta, ...rest }) => (
								<ButtonGroup segmented>
									<Button size="slim" pressed={(selected === 'color') ? true : false} onClick={() => {
										handleTabChange('color')
										input.onChange('color')
									}}>Color</Button>
									<Button size="slim" pressed={(selected === 'image')? true: false} onClick={() => {
										handleTabChange('image')
										input.onChange('image')
									}}>Image</Button>
									<Button size="slim" pressed={(selected === null || selected=== 'none')? true: false} onClick={() => {
										handleTabChange('none')
										// setColor(null);
										input.onChange('none')
									}}>None</Button>
								</ButtonGroup>
							)}
						</Field>

					{(selected === 'color') ? (
						<>
							<Popover
								active={popoverActive}
								activator={activator}
								autofocusTarget="first-node"
								onClose={togglePopoverActive}
							>
								
								<Field name={`background-color`}>
									{({ input, meta, ...rest }) => (
										<ColorPicker onChange={(val) => {
											console.log(val)
											input.onChange(rgbString(hsbToRgb(val)))
											setColor(val)
										}} name={input.name} color={color} allowAlpha />
									)}
								</Field>
							</Popover>
							<Field name={`opacity`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										label="Opacity percentage"
										value={rangeValue}
										onChange={(val) => {
											input.onChange(`${val}%`)
											handleRangeSliderChange(val)
										}}
										output
										name={input.name}
									/>
								)}
							</Field>			
							
						</>
					) : (null)}

					{(selected === 'image') ? (
						<div style={{marginTop: 10, display: 'inline-block', width: '100%'}}>
							<FormLayout>
								<Field name={`background-image`}>
									{props => (
										<TextField
											label="Image path"        
											name={props.input.name}
											value={props.input.value}
											onChange={props.input.onChange}
										/>
								)}
								</Field>
								
								<Field name={`background-repeat`}>
									{props => (
										<Select
											label="Repeat"
											options={
												[
													{ label: "Repeat", value: "repeat" },
													{ label: "Repeat-X", value: "repeat-x" },
													{ label: "Repeat-Y", value: "repeat-y" },
													{ label: "No repeat", value: "no-repeat" },
												]
											}
											name={props.input.name}
											value={props.input.value}
											onChange={props.input.onChange}
										/>
									)}
								</Field>
								
								<Field name={`background-position`}>
									{props => (
										<Select
											label="Position"
											options={[
												{ value: "left top", label: "Left top" },
												{ value: "center top", label: "Center top" },
												{ value: "right top", label: "Right top" },
												{ value: "left center", label: "Left center" },
												{ value: "center center", label: "Center center" },
												{ value: "right center", label: "Right center" },
												{ value: "left bottom", label: "Left bottom" },
												{ value: "center bottom", label: "Center bottom" },
												{ value: "right bottom", label: "Right bottom" },
											]}
											name={props.input.name}
											value={props.input.value}
											onChange={props.input.onChange}
										/>
									)}
								</Field>
							</FormLayout>
						</div>
					) : (null)}

				</Wrapper>
            </Collapsible>
        </li>
    );
}
  
  
export default Background;