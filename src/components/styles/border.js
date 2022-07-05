import { Select, Button, Collapsible, ButtonGroup, ColorPicker, RangeSlider, Popover, TextField, hsbToRgb, rgbString } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Border() {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState('all');
	const [widthType, setWidthType] = useState('px');
	const [width, setWidth] = useState(0);
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
					<ButtonGroup segmented>
						<Button size="slim" pressed={(selected === 'all')? true: false} onClick={() => handleTabChange('all')}>All</Button>
						<Button size="slim" pressed={(selected === 'left')? true: false} onClick={() => handleTabChange('left')}>Left</Button>
						<Button size="slim" pressed={(selected === 'top')? true: false} onClick={() => handleTabChange('top')}>Top</Button>
						<Button size="slim" pressed={(selected === 'right')? true: false} onClick={() => handleTabChange('right')}>Right</Button>
						<Button size="slim" pressed={(selected === 'bottom')? true: false} onClick={() => handleTabChange('bottom')}>Bottom</Button>
					</ButtonGroup>
          

               <div style={{ marginTop: 10, display: 'inline-block', width: '100%' }}>
                  <div style={{marginTop:10, marginBottom: 10}}>
                     <RangeSlider
                        output
                        label="Border Width"
                        min={0}
                        max={100}
                        step={1}
                        value={width}
                        fontSize={width}
                        onChange={setWidth}
                        suffix={<p style={suffixStyles}>{width}</p>}
                     />

                     <ButtonGroup segmented>
                        <Button size="slim" pressed={(widthType === 'px')? true: false} onClick={() => handleWidthTypeChange('px')}>px</Button>
                        <Button size="slim" pressed={(widthType === 'vh')? true: false} onClick={() => handleWidthTypeChange('vh')}>vh</Button>
                        <Button size="slim" pressed={(widthType === 'em')? true: false} onClick={() => handleWidthTypeChange('em')}>em</Button>
                     </ButtonGroup>
                  </div>
                  <div style={{marginTop:10, marginBottom: 10}}>
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
                        onChange={setStyle}
                        value={style}
                        fontFamily={style}
                        />
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
  
  
export default Border;