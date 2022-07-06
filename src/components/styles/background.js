import { FormLayout, Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, hsbToRgb, rgbString } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Background() {
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
					<ButtonGroup segmented>
						<Button size="slim" pressed={(selected === 'color')? true: false} onClick={() => handleTabChange('color')}>Color</Button>
						<Button size="slim" pressed={(selected === 'image')? true: false} onClick={() => handleTabChange('image')}>Image</Button>
						<Button size="slim" pressed={(selected === null)? true: false} onClick={() => handleTabChange(null)}>None</Button>
					</ButtonGroup>

					{(selected === 'color') ? (
						<>
							<Popover
								active={popoverActive}
								activator={activator}
								autofocusTarget="first-node"
								onClose={togglePopoverActive}
							>
								<ColorPicker onChange={setColor} color={color} allowAlpha />
							</Popover>

							<RangeSlider
								label="Opacity percentage"
								value={rangeValue}
								onChange={handleRangeSliderChange}
								output
							/>
						</>
					) : (null)}

					{(selected === 'image') ? (
						<div style={{marginTop: 10, display: 'inline-block', width: '100%'}}>
							<FormLayout>
								<TextField label="Image path" onChange={() => {}} autoComplete="off" />
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
									onChange={''}
									value={selected}
								/>

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
									onChange={''}
									value={selected}
								/>
							</FormLayout>
						</div>
					) : (null)}

				</Wrapper>
            </Collapsible>
        </li>
    );
}
  
  
export default Background;