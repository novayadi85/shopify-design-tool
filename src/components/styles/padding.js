import { Button, Collapsible, ButtonGroup, RangeSlider, Label } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';
import { getNumber } from "../../helper/number";

function Padding({initialValues}) {
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

	useEffect(() => {

		if (initialValues['padding-top']) {
			if (getNumber(initialValues['padding-top'])) {
				let str = getNumber(initialValues['margin-top']);
				setTop(Number(str));
				setTopType('detail')
			}
		}

		if (initialValues['padding-left']) {
			if (getNumber(initialValues['padding-left'])) {
				let str = getNumber(initialValues['padding-left']);
				setLeft(Number(str));
				setLeftType('detail')
			}
		}

		if (initialValues['padding-right']) {
			if (getNumber(initialValues['padding-right'])) {
				let str = getNumber(initialValues['padding-right']);
				setRight(Number(str));
				setRightType('detail')
			}
		}

		if (initialValues['padding-bottom']) {
			if (getNumber(initialValues['padding-bottom'])) {
				let str = getNumber(initialValues['padding-bottom']);
				setBottom(Number(str));
				setBottomType('detail')
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
					removeUnderline>Padding</Button>
						
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
							<Label>Padding Top</Label>
							<Field name={`padding-top`}>
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
								<Field name={`padding-top`}>
									{({ input, meta, ...rest }) => (
										<RangeSlider
											output
											label=""
											min={0}
											max={100}
											step={1}
											value={top}
											fontSize={top}
											onChange={(val) => {
												setTop(val)
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{top} {std}</p>}
											name={input.name}
										/>
									)}
								</Field>
							): (
								<></>	
							)}
							
						</div>
						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Padding Left</Label>	
							<Field name={`padding-left`}>
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
								<Field name={`padding-left`}>
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
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{left} {std}</p>}
											name={input.name}
										/>
									)}
								</Field>
								): (
								<></>
							)}
						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Padding Bottom</Label>
							<Field name={`padding-bottom`}>
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
								<Field name={`padding-bottom`}>
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
												input.onChange(`${val}${std}`)
											}}
											suffix={<p style={suffixStyles}>{bottom} {std}</p>}
											name={input.name}
										/>
									)}
								</Field>

								): (
									<></>
								)}

						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Label>Padding Right</Label>
							<Field name={`padding-right`}>
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
								<Field name={`padding-right`}>
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
											input.onChange(`${val}${std}`)
										}}
										suffix={<p style={suffixStyles}>{right} {std}</p>}
										name={input.name}
									/>
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
  
  
export default Padding;