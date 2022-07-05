import { Select, Button, Collapsible } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
  
function Extra() {
	const [open, setOpen] = useState(false);
	const [clear, setClear] = useState('none');
	const [cursor, setCursor] = useState('default');
	const [float, setFloat] = useState('none');
	const [display, setDisplay] = useState('block');
	const [overflow, setOverflow] = useState('visible');

	const handleToggle = useCallback(() => setOpen((open) => !open), []);


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
						<div style={{marginTop:0, marginBottom: 10}}>
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
								onChange={setDisplay}
								value={display}
								fontFamily={display}
							/>
							
						</div>

						<div style={{ marginTop: 0, marginBottom: 10 }}>
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
								onChange={setCursor}
								value={cursor}
								fontFamily={cursor}
							/>
							
						</div>

						<div style={{marginTop:0, marginBottom: 10}}>
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
								onChange={setOverflow}
								value={overflow}
								fontFamily={overflow}
							/>
							
						</div>

						<div style={{marginTop:0, marginBottom: 10}}>
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
								onChange={setFloat}
								value={float}
								fontFamily={float}
							/>
							
						</div>

						<div style={{marginTop:0, marginBottom: 10}}>
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
								onChange={setClear}
								value={clear}
								fontFamily={clear}
							/>
							
						</div>
					</div>
				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Extra;