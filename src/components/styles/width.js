import { Select, Button, Collapsible, ButtonGroup, RangeSlider } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Wide() {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState('screen');
	const [typeElement, setTypeElement] = useState('px');
	const [width, setWidth] = useState(100);

	const handleTypeChange = useCallback((selectedTabIndex) => setTypeElement(selectedTabIndex),[]);
	
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
					removeUnderline>Width</Button>
						
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
			</div>
			
			<Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper className="container-fields" BorderBottom={true}>
					<div style={{ marginTop: 0, display: 'inline-block', width: '100%' }}>
						<div style={{marginTop:0, marginBottom: 10}}>
							<Select
								label="Type"
								options={
								[
								{ value: "auto", label: "Auto" },
								{ value: "screen", label: "% of page width" },
								{ value: "fixed", label: "Fixed" },
								{ value: "max", label: "Max" },
								{ value: "min", label: "min" },
								]
								}
								onChange={setType}
								value={type}
								fontFamily={type}
								/>
						</div>

						<div style={{marginTop:10, marginBottom: 10}}>
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
								<Button size="slim" pressed={(typeElement === 'px')? true: false} onClick={() => handleTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(typeElement === 'vh')? true: false} onClick={() => handleTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(typeElement === 'em')? true: false} onClick={() => handleTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>
						
						
					</div>

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Wide;