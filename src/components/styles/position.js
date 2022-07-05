import { Select, Button, Collapsible, ButtonGroup, RangeSlider } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Position() {
	const [open, setOpen] = useState(false);
	const [_position, setPosition] = useState('relative');
	
	const [topType, setTopType] = useState('auto');
	const [leftType, setLeftType] = useState('auto');
	const [bottomType, setBottomType] = useState('auto');
	const [rightType, setRightType] = useState('auto');
	
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);
	const [bottom, setBottom] = useState(0);
	const [right, setRight] = useState(0);

	const handleTopTypeChange = useCallback((selectedTabIndex) => setTopType(selectedTabIndex),[]);
	const handleLeftTypeChange = useCallback((selectedTabIndex) => setLeftType(selectedTabIndex),[]);
	const handleBottomTypeChange = useCallback((selectedTabIndex) => setBottomType(selectedTabIndex),[]);
	const handleRightTypeChange = useCallback((selectedTabIndex) => setRightType(selectedTabIndex), []);
	
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
					removeUnderline>Position</Button>
						
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
								label="Position"
								options={
								[
								{ value: "none", label: "None" },
								{ value: "static", label: "Static" },
								{ value: "relative", label: "Relative" },
								{ value: "absolute", label: "Absolute" },
								{ value: "fixed", label: "Fixed" },
								{ value: "inherit", label: "Inherit" },
								{ value: "initial", label: "Initial" },
								]
								}
								onChange={setPosition}
								value={_position}
								fontFamily={_position}
								/>
						</div>

						<div style={{marginTop:10, marginBottom: 10}}>
							<RangeSlider
								output
								label="Top"
								min={0}
								max={100}
								step={1}
								value={top}
								fontSize={top}
								onChange={setTop}
								suffix={<p style={suffixStyles}>{top}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(topType === 'px')? true: false} onClick={() => handleTopTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(topType === 'vh')? true: false} onClick={() => handleTopTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(topType === 'em')? true: false} onClick={() => handleTopTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>
						
						<div style={{marginTop:10, marginBottom: 10}}>
							<RangeSlider
								output
								label="Left"
								min={0}
								max={100}
								step={1}
								value={left}
								fontSize={left}
								onChange={setLeft}
								suffix={<p style={suffixStyles}>{left}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(leftType === 'px')? true: false} onClick={() => handleLeftTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(leftType === 'vh')? true: false} onClick={() => handleLeftTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(leftType === 'em')? true: false} onClick={() => handleLeftTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>
						
						<div style={{marginTop:10, marginBottom: 10}}>
							<RangeSlider
								output
								label="Right"
								min={0}
								max={100}
								step={1}
								value={right}
								fontSize={right}
								onChange={setRight}
								suffix={<p style={suffixStyles}>{right}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(rightType === 'px')? true: false} onClick={() => handleBottomTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(rightType === 'vh')? true: false} onClick={() => handleBottomTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(rightType === 'em')? true: false} onClick={() => handleBottomTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>

						<div style={{marginTop:10, marginBottom: 10}}>
							<RangeSlider
								output
								label="Bottom"
								min={0}
								max={100}
								step={1}
								value={bottom}
								fontSize={bottom}
								onChange={setBottom}
								suffix={<p style={suffixStyles}>{bottom}</p>}
							/>

							<ButtonGroup segmented>
								<Button size="slim" pressed={(bottomType === 'px')? true: false} onClick={() => handleRightTypeChange('px')}>px</Button>
								<Button size="slim" pressed={(bottomType === 'vh')? true: false} onClick={() => handleRightTypeChange('vh')}>vh</Button>
								<Button size="slim" pressed={(bottomType === 'em')? true: false} onClick={() => handleRightTypeChange('em')}>em</Button>
							</ButtonGroup>
						</div>
					</div>

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Position;