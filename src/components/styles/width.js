import { Select, Button, Collapsible, ButtonGroup, RangeSlider } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';

function Wide() {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState('screen');
	const [typeElement, setTypeElement] = useState('px');
	const [width, setWidth] = useState(100);
	const [widthFormat, setWidthFormat] = useState(`${width}${typeElement}`);

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
						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Field name={`width`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Type"
										options={
											[
												{ value: "auto", label: "Auto" },
												{ value: "screen", label: "% of page width" },
												{ value: "fixed", label: "Fixed" },
											]
										}
										onChange={(val) => {
											setType(val)
											if (val === 'auto') {
												input.onChange(`auto`)
												setWidthFormat(`auto`)
											}
											else if (val === 'screen') {
												input.onChange(`${width}%`)
												setWidthFormat(`${width}%`)
											}
											else if (val === 'fixed') {
												input.onChange(`${width}${typeElement}`)
												setWidthFormat(`${width}${typeElement}`)
											}
											
										}}
										value={type}
										fontFamily={type}
									/>
								)}
							</Field>
						</div>

						<div style={{ marginTop: 10, marginBottom: 10 }}>
							<Field name={`width`}>
								{({ input, meta, ...rest }) => (
									<RangeSlider
										output
										label="Width"
										min={0}
										max={100}
										step={1}
										value={width}
										width={width}
										onChange={(val) => {
											setWidth(val);
											if (type === 'auto') {
												input.onChange(`auto`)
											}
											else if (type === 'screen') {
												input.onChange(`${width}%`)
												setWidthFormat(`${width}%`)
											}
											else if (type === 'fixed') {
												input.onChange(`${width}${typeElement}`)
												setWidthFormat(`${width}${typeElement}`)
											}
										}}
										suffix={<p style={suffixStyles}>{widthFormat}</p>}
									/>
								)}
							</Field>
							
							<Field name={`width`}>
								{({ input, meta, ...rest }) => (
									<ButtonGroup segmented>
										<Button size="slim" pressed={(typeElement === 'px') ? true : false} onClick={() => {
											handleTypeChange('px')
											if (type === 'auto') {
												input.onChange(`auto`)
											}
											else if (type === 'screen') {
												input.onChange(`${width}%`)
												setWidthFormat(`${width}%`)
											}
											else if (type === 'fixed') {
												input.onChange(`${width}px`)
												setWidthFormat(`${width}px`)
											}
										}}>px</Button>
										<Button size="slim" pressed={(typeElement === 'vh') ? true : false} onClick={() => {
											handleTypeChange('vh')
											if (type === 'auto') {
												input.onChange(`auto`)
											}
											else if (type === 'screen') {
												input.onChange(`${width}%`)
												setWidthFormat(`${width}%`)
											}
											else if (type === 'fixed') {
												input.onChange(`${width}vh`)
												setWidthFormat(`${width}vh`)
											}
										}}>vh</Button>
										<Button size="slim" pressed={(typeElement === 'em') ? true : false} onClick={() => {
											handleTypeChange('em')
											if (type === 'auto') {
												input.onChange(`auto`)
											}
											else if (type === 'screen') {
												input.onChange(`${width}%`)
												setWidthFormat(`${width}%`)
											}
											else if (type === 'fixed') {
												input.onChange(`${width}em`)
												setWidthFormat(`${width}em`)
											}
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
  
  
export default Wide;