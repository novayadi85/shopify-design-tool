import { Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, hsbToRgb, rgbString } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";

function Shadow() {
	const [open, setOpen] = useState(false);
	const [y, setX] = useState(0);
	const [x, setY] = useState(0);
	const [width, setWidth] = useState(0);
	const [blur, setBlur] = useState(0);

	const [xType, setXType] = useState('px');
	const [yType, setYType] = useState('px');
	const [blurType, setBlurType] = useState('px');
	const [widthType, setWidthType] = useState('px');

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

	const handlexTypeChange = useCallback((selectedTabIndex) => setXType(selectedTabIndex),[]);
	const handleyTypeChange = useCallback((selectedTabIndex) => setYType(selectedTabIndex),[]);
	const handleblurTypeChange = useCallback((selectedTabIndex) => setBlurType(selectedTabIndex), []);
	const handlewidthTypeChange = useCallback((selectedTabIndex) => setWidthType(selectedTabIndex), []);
	
	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	const suffixStyles = {
		minWidth: "24px",
		textAlign: "right",
	};

	return (
		<li className="has-toggle">
			<div className="flex link border-bottom" onClick={handleToggle}>
				<Button
					ariaExpanded={open}
					ariaControls="basic-collapsible"
					plain 
					monochrome
					removeUnderline>Box-Shadow</Button>
						
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
			</div>
			
			<Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper className="container-fields" BorderBottom={true}>
					<div style={{ marginTop: 10, display: 'inline-block', width: '100%' }}>
						<div style={{marginTop:0, marginBottom: '1rem'}}>
							<RangeSlider
								output
								label="X"
								min={0}
								max={100}
								step={1}
								value={x}
								fontSize={x}
								onChange={setX}
								suffix={<p style={suffixStyles}>{x}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(xType === 'px')? true: false} onClick={() => handlexTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(xType === 'vh')? true: false} onClick={() => handlexTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(xType === 'em')? true: false} onClick={() => handlexTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>
						
						<div style={{marginTop:'1rem', marginBottom: '1rem'}}>
							<RangeSlider
								output
								label="Y"
								min={0}
								max={100}
								step={1}
								value={y}
								fontSize={y}
								onChange={setY}
								suffix={<p style={suffixStyles}>{y}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(yType === 'px')? true: false} onClick={() => handleyTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(yType === 'vh')? true: false} onClick={() => handleyTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(yType === 'em')? true: false} onClick={() => handleyTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>

						<div style={{marginTop:'1rem', marginBottom: '1rem'}}>
							<RangeSlider
								output
								label="Blur"
								min={0}
								max={100}
								step={1}
								value={blur}
								fontSize={blur}
								onChange={setBlur}
								suffix={<p style={suffixStyles}>{blur}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(blurType === 'px')? true: false} onClick={() => handleblurTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(blurType === 'vh')? true: false} onClick={() => handleblurTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(blurType === 'em')? true: false} onClick={() => handleblurTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>

						<div style={{marginTop:'1rem', marginBottom: '1rem'}}>
							<RangeSlider
								output
								label="Width"
								min={0}
								max={100}
								step={1}
								value={width}
								fontSize={width}
								onChange={setWidth}
								suffix={<p style={suffixStyles}>{width}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(widthType === 'px')? true: false} onClick={() => handlewidthTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(widthType === 'vh')? true: false} onClick={() => handlewidthTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(widthType === 'em')? true: false} onClick={() => handlewidthTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>

						<Popover
							active={popoverActive}
							activator={activator}
							autofocusTarget="first-node"
							onClose={togglePopoverActive}
						>
							<ColorPicker onChange={setColor} color={color} allowAlpha />
						</Popover>
						
					</div>
				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Shadow;