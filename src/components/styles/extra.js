import { Select, Button, Collapsible } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { Field } from 'react-final-form';

function Extra({initialValues}) {
	const [open, setOpen] = useState(false);
	const [clear, setClear] = useState('none');
	const [cursor, setCursor] = useState('default');
	const [float, setFloat] = useState('none');
	const [display, setDisplay] = useState('block');
	const [overflow, setOverflow] = useState('visible');

	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	useEffect(() => {
		if (initialValues['display']) {
			setDisplay(initialValues['display']);
		}

		if (initialValues['cursor']) {
			setCursor(initialValues['cursor']);
		}

		if (initialValues['clear']) {
			setClear(initialValues['clear']);
		}

		if (initialValues['float']) {
			setFloat(initialValues['float']);
		}

		if (initialValues['overflow']) {
			setOverflow(initialValues['overflow']);
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
					removeUnderline>Other</Button>
						
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
						<Field name={`display`}>
							{({ input, meta, ...rest }) => (
								<Select
									label="Display"
									options={
										[
											{ value: "block", label: "Block" },
											{ value: "grid", label: "Grid" },
											{ value: "flex", label: "Flex" },
											{ value: "inline-block", label: "Inline Block" },
											{ value: "table", label: "Table" },
										]
									}
									onChange={(val) => {
										setDisplay(val);
										input.onChange(val)
									}}
									value={display}
									fontFamily={display}
								/>
							)}
						</Field>
						</div>

						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Field name={`cursor`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Cursor"
										options={
											[
												{ value: "auto", label: "Auto" },
												{ value: "crosshair", label: "crosshair" },
												{ value: "default", label: "default" },
												{ value: "pointer", label: "pointer" },
												{ value: "move", label: "move" },
												{ value: "wait", label: "wait" },
												{ value: "help", label: "help" },
											]
										}
										onChange={(val) => {
											setCursor(val);
											input.onChange(val)
										}}
										value={cursor}
										fontFamily={cursor}
									/>
								)}
							</Field>
							
						</div>

						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Field name={`cursor`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Overflow"
										options={
											[
												{ value: "auto", label: "Auto" },
												{ value: "hidden", label: "hidden" },
												{ value: "scroll", label: "scroll" },
												{ value: "scroll-y", label: "scroll-y" },
												{ value: "scroll-x", label: "scroll-x" },
												{ value: "visible", label: "visible" },
											]
										}
										onChange={(val) => {
											setOverflow(val)
											input.onChange(val)
										}}
										value={overflow}
										fontFamily={overflow}
									/>
								)}
								</Field>
						</div>

						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Field name={`float`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Float"
										options={
											[
												{ value: "auto", label: "Auto" },
												{ value: "left", label: "left" },
												{ value: "right", label: "right" },
												{ value: "none", label: "none" },
											]
										}
										onChange={(val) => {
											setFloat(val)
											input.onChange(val);
										}}
										value={float}
										fontFamily={float}
									/>
								)}
							</Field>
						</div>

						<div style={{ marginTop: 0, marginBottom: 10 }}>
							<Field name={`clear`}>
								{({ input, meta, ...rest }) => (
									<Select
										label="Clear"
										options={
											[
												{ value: "none", label: "none" },
												{ value: "left", label: "left" },
												{ value: "right", label: "right" },
												{ value: "both", label: "both" },
											]
										}
										onChange={(val) => {
											setClear(val);
											input.onChange(val);
										}}
										value={clear}
										fontFamily={clear}
									/>
								)}
								</Field>
						</div>
					</div>
				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Extra;