import { Button, Collapsible, ButtonGroup, RangeSlider, Label } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Margin() {
	const [open, setOpen] = useState(false);
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
	const handleRightTypeChange = useCallback((selectedTabIndex) => setRightType(selectedTabIndex),[]);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	const std = 'px';
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
					removeUnderline>Margin</Button>
						
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
						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Label>Margin Top</Label>
							<ButtonGroup segmented>
								<Button size="slim" pressed={(topType === 'auto')? true: false} onClick={() => handleTopTypeChange('auto')}>Auto</Button>
								<Button size="slim" pressed={(topType === 'detail')? true: false} onClick={() => handleTopTypeChange('detail')}>Detail</Button>
							</ButtonGroup>	
							{(topType === 'detail') ? (
								<RangeSlider
									output
									label=""
									min={0}
									max={100}
									step={1}
									value={top}
									fontSize={top}
									onChange={setTop}
									suffix={<p style={suffixStyles}>{top} {std}</p>}
								/>
							): (
								<></>	
							)}
							
						</div>
						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Margin Left</Label>
							<ButtonGroup segmented>
								<Button size="slim" pressed={(leftType === 'auto')? true: false} onClick={() => handleLeftTypeChange('auto')}>Auto</Button>
								<Button size="slim" pressed={(leftType === 'detail')? true: false} onClick={() => handleLeftTypeChange('detail')}>Detail</Button>
							</ButtonGroup>	
							{(leftType === 'detail') ? (
								<RangeSlider
									output
									label="Left"
									min={0}
									max={100}
									step={1}
									value={left}
									fontSize={left}
									onChange={setLeft}
									suffix={<p style={suffixStyles}>{left} {std}</p>}
								/>) : (
								<></>
							)}
						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Margin Bottom</Label>
							<ButtonGroup segmented>
								<Button size="slim" pressed={(bottomType === 'auto')? true: false} onClick={() => handleBottomTypeChange('auto')}>Auto</Button>
								<Button size="slim" pressed={(bottomType === 'detail')? true: false} onClick={() => handleBottomTypeChange('detail')}>Detail</Button>
							</ButtonGroup>	
							{(bottomType === 'detail') ? (
								<RangeSlider
									output
									label="Bottom"
									min={0}
									max={100}
									step={1}
									value={bottom}
									fontSize={bottom}
									onChange={setBottom}
									suffix={<p style={suffixStyles}>{bottom} {std}</p>}
								/>) : (
									<></>
								)}

						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Margin Right</Label>
							<ButtonGroup segmented>
								<Button size="slim" pressed={(rightType === 'auto')? true: false} onClick={() => handleRightTypeChange('auto')}>Auto</Button>
								<Button size="slim" pressed={(rightType === 'detail')? true: false} onClick={() => handleRightTypeChange('detail')}>Detail</Button>
							</ButtonGroup>	
							{(rightType === 'detail') ? (
								<RangeSlider
									output
									label="Right"
									min={0}
									max={100}
									step={1}
									value={right}
									fontSize={right}
									onChange={setRight}
									suffix={<p style={suffixStyles}>{right} {std}</p>}
								/>
							) : (
								<></>
							)}
						</div>
					</div>
				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Margin;