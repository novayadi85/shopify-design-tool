import { Select, Button, Collapsible, ButtonGroup, RangeSlider, Label } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';
import { getNumber } from "../../helper/number";

function Position({initialValues}) {
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

	const std = 'px';

	useEffect(() => {
		if (initialValues['position']) {
			setPosition(initialValues['position']);
		}

		if (initialValues['top']) {
			if (getNumber(initialValues['top'])) {
				let str = getNumber(initialValues['top']);
				setTop(Number(str));
			}
		}

		if (initialValues['left']) {
			if (getNumber(initialValues['left'])) {
				let str = getNumber(initialValues['left']);
				setLeft(Number(str));
			}
		}

		if (initialValues['right']) {
			if (getNumber(initialValues['right'])) {
				let str = getNumber(initialValues['right']);
				setRight(Number(str));
			}
		}

		if (initialValues['bottom']) {
			if (getNumber(initialValues['bottom'])) {
				let str = getNumber(initialValues['bottom']);
				setBottom(Number(str));
			}
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

						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Label>Top</Label>
							<Field name={`top`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(topType === 'auto')? true: false} onClick={() => {
										handleTopTypeChange('auto')
										input.onChange('auto')
									}}>Auto</Button>
										<Button size="slim" pressed={(topType === 'detail')? true: false} onClick={() => {
										handleTopTypeChange('detail')
										input.onChange('detail')
									}}>Detail</Button>
									</ButtonGroup>	
								)}
							</Field>
							
							{(topType === 'detail') ? (
								<Field name={`top`}>
									{({ input, meta, ...rest }) => (
										<div style={{ marginTop: 10 }}>
											<RangeSlider
												output
												labelHidden
												label="Top"
												min={-100}
												max={100}
												step={1}
												value={top}
												fontSize={top}
												onChange={(val) => {
													setTop(val);
													input.onChange(`${val}${std}`);
												}}
												suffix={<p style={suffixStyles}>{top}{ std }</p>}
												/>
										</div>
									)}
								</Field>
							): (
								<></>	
							)}
							
						</div>
						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Left</Label>	
							<Field name={`margin-left`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(leftType === 'auto')? true: false} onClick={() => {
										handleLeftTypeChange('auto')
										input.onChange('auto')
									}}>Auto</Button>
										<Button size="slim" pressed={(leftType === 'detail')? true: false} onClick={() => {
										handleLeftTypeChange('detail')
										input.onChange('detail')
									}}>Detail</Button>
									</ButtonGroup>	
								)}
							</Field>
							{(leftType === 'detail') ? (
								<Field name={`left`}>
									{({ input, meta, ...rest }) => (
										<div style={{ marginTop: 10 }}>
										<RangeSlider
											output
											labelHidden
											label="Left"
											min={-100}
											max={100}
											step={1}
											value={left}
											fontSize={left}
											onChange={(val) => {
												setLeft(val)
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{left}{std}</p>}
										/>
											</div>
									)}
								</Field>
								) : (
								<></>
							)}
						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Bottom</Label>	
							<Field name={`bottom`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(bottomType === 'auto')? true: false} onClick={() => {
										handleBottomTypeChange('auto')
										input.onChange('auto')
									}}>Auto</Button>
										<Button size="slim" pressed={(bottomType === 'detail')? true: false} onClick={() => {
										handleBottomTypeChange('detail')
										input.onChange('detail')
									}}>Detail</Button>
									</ButtonGroup>	
								)}
							</Field>
							{(bottomType === 'detail') ? (	
								<Field name={`bottom`}>
									{({ input, meta, ...rest }) => (
										<div style={{ marginTop: 10 }}>
										<RangeSlider
											output
											labelHidden
											label="Right"
											min={-100}
											max={100}
											step={1}
											value={right}
											fontSize={right}
											onChange={(val) => {
												setRight(val)
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{right}{std}</p>}
										/>
											</div>
									)}
								</Field>
								) : (
									<></>
								)}

						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Right</Label>
							<Field name={`right`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(rightType === 'auto')? true: false} onClick={() => {
										handleRightTypeChange('auto')
										input.onChange('auto')
									}}>Auto</Button>
										<Button size="slim" pressed={(rightType === 'detail')? true: false} onClick={() => {
										handleRightTypeChange('detail')
										input.onChange('detail')
									}}>Detail</Button>
									</ButtonGroup>	
								)}
							</Field>
							{(rightType === 'detail') ? (
								<Field name={`right`}>
									{({ input, meta, ...rest }) => (
										<div style={{ marginTop: 10 }}>
										<RangeSlider
											output
											labelHidden
											label="Right"
											min={-100}
											max={100}
											step={1}
											value={right}
											fontSize={right}
											onChange={(val) => {
												setRight(val)
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{right}{std}</p>}
											/>
											</div>
									)}
								</Field>

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
  
  
export default Position;

/*
<div style={{ marginTop: 10, marginBottom: 10 }}>
	<Field name={`top`}>
		{({ input, meta, ...rest }) => (
			<RangeSlider
				output
				label="Top"
				min={-100}
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
	<div className="flex">
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
		<Field name={`top`}>
			{({ input, meta, ...rest }) => (
				<Checkbox
					label="Auto"
					checked={input.value}
					onChange={(val) => {
						if (input.value === true) {
							setTop('auto');
							
						}
						
						input.onChange(val);
					}}
				/>		
		)}
		</Field>	
	</div>
	
</div>

<div style={{ marginTop: 10, marginBottom: 10 }}>
	<Field name={`left`}>
		{({ input, meta, ...rest }) => (
			<RangeSlider
				output
				label="Left"
				min={-100}
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
				min={-100}
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
				min={-100}
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

*/