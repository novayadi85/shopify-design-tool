import { Select, Button, Collapsible, ButtonGroup, RangeSlider } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';

function Position() {
	const [open, setOpen] = useState(false);
	const [_position, setPosition] = useState('relative');
	
	const [topType, setTopType] = useState('px');
	const [leftType, setLeftType] = useState('px');
	const [bottomType, setBottomType] = useState('px');
	const [rightType, setRightType] = useState('px');
	
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
						<div style={{ marginTop: 0, marginBottom: 10 }}>
						<Field name={`position`}>
							{({ input, meta, ...rest }) => (
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
									onChange={(val) => {
										setPosition(val);
										input.onChange(val);
									}}
									value={_position}
									fontFamily={_position}
									/>
							)}
						</Field>
							
						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Field name={`top`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										output
										label="Top"
										min={0}
										max={100}
										step={1}
										value={top}
										fontSize={top}
										onChange={(val) => {
											setTop(val);
											input.onChange(`${val}${topType}`);
										}}
										suffix={<p style={suffixStyles}>{top}{ topType }</p>}
									/>
								)}
							</Field>
							
							<Field name={`top`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(topType === 'px') ? true : false} onClick={() => {
											handleTopTypeChange('px');
											input.onChange(`${top}px`)
										}}>px</Button>
										<Button size="slim" pressed={(topType === 'vh') ? true : false} onClick={() => {
											handleTopTypeChange('vh');
											input.onChange(`${top}vh`)
										}}>vh</Button>
										<Button size="slim" pressed={(topType === 'em') ? true : false}  onClick={() => {
											handleTopTypeChange('em');
											input.onChange(`${top}em`)
										}}>em</Button>
									</ButtonGroup>
								)}
							</Field>
						</div>
						
						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Field name={`left`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										output
										label="Left"
										min={0}
										max={100}
										step={1}
										value={left}
										fontSize={left}
										onChange={(val) => {
											setLeft(val)
											input.onChange(`${val}${leftType}`)
										}}
										suffix={<p style={suffixStyles}>{left}{leftType}</p>}
									/>
								)}
							</Field>
							
							<Field name={`left`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(leftType === 'px') ? true : false} onClick={() => {
											handleLeftTypeChange('px');
											input.onChange(`${left}px`)
										}}>px</Button>
										<Button size="slim" pressed={(leftType === 'vh') ? true : false} onClick={() => {
											handleLeftTypeChange('vh');
											input.onChange(`${left}vh`)
										}}>vh</Button>
										<Button size="slim" pressed={(leftType === 'em') ? true : false}  onClick={() => {
											handleLeftTypeChange('em');
											setTimeout(() => {
												input.onChange(`${left}em`)
											}, 500);
											
										}}>em</Button>
									</ButtonGroup>
								)}
							</Field>
						</div>
						
						<div style={{marginTop:10, marginBottom: 10}}>
							<Field name={`right`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										output
										label="Right"
										min={0}
										max={100}
										step={1}
										value={right}
										fontSize={right}
										onChange={(val) => {
											setRight(val)
											input.onChange(`${val}${rightType}`)
										}}
										suffix={<p style={suffixStyles}>{right}{rightType}</p>}
									/>
								)}
							</Field>

							<Field name={`right`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(rightType === 'px') ? true : false} onClick={() => {
											handleRightTypeChange('px');
											input.onChange(`${right}px`)
										}}>px</Button>
										<Button size="slim" pressed={(rightType === 'vh') ? true : false} onClick={() => {
											handleRightTypeChange('vh');
											input.onChange(`${right}vh`)
										}}>vh</Button>
										<Button size="slim" pressed={(rightType === 'em') ? true : false}  onClick={() => {
											handleRightTypeChange('em');
											input.onChange(`${right}em`)
										}}>em</Button>
									</ButtonGroup>
								)}
							</Field>
						</div>

						<div style={{marginTop:10, marginBottom: 10}}>
							<Field name={`bottom`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										output
										label="Bottom"
										min={0}
										max={100}
										step={1}
										value={bottom}
										fontSize={bottom}
										onChange={(val) => {
											setBottom(val)
											input.onChange(`${val}${bottomType}`)
										}}
										suffix={<p style={suffixStyles}>{bottom}{bottomType}</p>}
									/>
								)}
							</Field>
							<Field name={`bottom`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(bottomType === 'px') ? true : false} onClick={() => {
											handleBottomTypeChange('px');
											input.onChange(`${bottom}px`)
										}}>px</Button>
										<Button size="slim" pressed={(bottomType === 'vh') ? true : false} onClick={() => {
											handleBottomTypeChange('vh');
											input.onChange(`${bottom}vh`)
										}}>vh</Button>
										<Button size="slim" pressed={(bottomType === 'em') ? true : false}  onClick={() => {
											handleBottomTypeChange('em');
											input.onChange(`${bottom}em`)

										}}>em</Button>
									</ButtonGroup>
								)}
							</Field>
						</div>
					</div>

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Position;