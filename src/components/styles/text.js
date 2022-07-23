import { Button, Collapsible, ButtonGroup, RangeSlider, Label} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { RemovePadding } from "../../styles/Sidebar";
import { Field } from 'react-final-form';
import { getNumber } from "../../helper/number";

function Text({initialValues}) {
	const [open, setOpen] = useState(false);
	const [lineHeight, setLineHeight] = useState('16');
	const [lineHeightType, setLineHeightType] = useState('px');
	const [align, setAlign] = useState('left');
	const [decoration, setDecoration] = useState('none');
	const [transform, setTransform] = useState('none');



	const handleAlignChange = useCallback((selectedTabIndex) => setAlign(selectedTabIndex),[]);
	const handleDecorationChange = useCallback((selectedTabIndex) => setDecoration(selectedTabIndex),[]);
	const handleTransformChange = useCallback((selectedTabIndex) => setTransform(selectedTabIndex), []);
	const handleLineHeightTypeChange = useCallback((selectedTabIndex) => setLineHeightType(selectedTabIndex), []);
  
	const handleToggle = useCallback(() => setOpen((open) => !open), []);

	const suffixStyles = {
		minWidth: "24px",
		textAlign: "right",
	};

	useEffect(() => {
		if (initialValues['line-height']) {
			if (getNumber(initialValues['line-height'])) {
				let str = getNumber(initialValues['line-height']);
				setLineHeight(Number(str));
			}
		}

		if (initialValues['text-decoration']) {
			setDecoration(initialValues['text-decoration']);
		}

		if (initialValues['text-transform']) {
			setTransform(initialValues['text-transform']);
		}

	}, [])


	console.log(lineHeight)

	return (
		<li className="has-toggle">
			<div className="flex link border-bottom" onClick={handleToggle}>
				<Button
					ariaExpanded={open}
					ariaControls="basic-collapsible"
					plain 
					monochrome
					removeUnderline>Text</Button>
						
				<Button plain icon={ (open) ? ChevronDownMinor : ChevronRightMinor}></Button>
			</div>
			
			<Collapsible
				open={open}
				id="basic-collapsible"
				transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
				expandOnPrint
			>
				<Wrapper className="container-fields" BorderBottom={true}>
					<div style={{marginTop:10, marginBottom: 10}}>
						<RemovePadding><Label>Text align</Label></RemovePadding>
						<Field name={`text-align`}>
							{({ input, meta, ...rest }) => (
								<ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Text align'}>
									<Button size="slim"  pressed={(align === 'left')? true: false} onClick={() => {
										handleAlignChange('left')
										input.onChange('left')
									}}>Normal</Button>
									<Button size="slim" pressed={(align === 'center')? true: false} onClick={() => {
										handleAlignChange('center')
										input.onChange('center')
									}}>Center</Button>
									<Button size="slim" pressed={(align === 'right')? true: false} onClick={() => {
										handleAlignChange('right')
										input.onChange('right')
									}}>Right</Button>
								</ButtonGroup>
							)}
						</Field>
					</div>

					<div style={{marginTop:10, marginBottom: 10}}>
						<RemovePadding><Label>Decoration</Label></RemovePadding>
						<Field name={`text-decoration`}>
							{({ input, meta, ...rest }) => (
								<ButtonGroup className={'test'} style={{ marginTop: 10, marginBottom: 10 }} segmented label={'Decoration'}>
									<Button onClick={() => {
										handleDecorationChange('none')
										input.onChange('none')
									}} size="slim" pressed={(decoration === 'none') ? true : false}>None</Button>
									<Button onClick={() => {
										handleDecorationChange('overline')
										input.onChange('overline')
									}} size="slim" pressed={(decoration === 'overline') ? true : false}>Overline</Button>
									<Button onClick={() => {
										handleDecorationChange('line-through')
										input.onChange('line-through')
									}} size="slim" pressed={(decoration === 'line-through') ? true : false}>Through</Button>
									<Button onClick={() => {
										handleDecorationChange('underline')
										input.onChange('underline')
									}} size="slim" pressed={(decoration === 'underline') ? true : false}>Underline</Button>
								</ButtonGroup>
							)}
						</Field>
					</div>

					<div style={{marginTop:10, marginBottom: 10}}>
						<RemovePadding><Label>Text transform</Label></RemovePadding>
						<Field name={`text-transform`}>
							{({ input, meta, ...rest }) => (
								<ButtonGroup className={'test'} style={{ marginTop: 10, marginBottom: 10 }} segmented label={'text transform'}>
									<Button onClick={() => {
										handleTransformChange('uppercase')
										input.onChange('uppercase')
									}} size="slim" pressed={(transform === 'uppercase') ? true : false}>UPERCASE</Button>
									<Button onClick={() => {
										handleTransformChange('lowercase')
										input.onChange('lowercase')
									}} size="slim" pressed={(transform === 'lowercase') ? true : false}>lowercase</Button>
									<Button onClick={() => {
										handleTransformChange('capitalize')
										input.onChange('capitalize')
									}} size="slim" pressed={(transform === 'capitalize') ? true : false}>Capitalize</Button>
									<Button onClick={() => {
										handleTransformChange('none')
										input.onChange('none')
									}} size="slim" pressed={(transform === 'none') ? true : false}>None</Button>
								</ButtonGroup>
							)}
						</Field>
					</div>

					<Field name={`line-height`}>
						{({ input, meta, ...rest }) => (
							<RangeSlider
								output
								label="Line height"
								min={0}
								max={100}
								step={1}
								value={lineHeight}
								lineHeight={lineHeight}
								onChange={(val) => {
									input.onChange(`${val}${lineHeightType}`)
									setLineHeight(val)
								}}
								name={input.name}
								suffix={<p style={suffixStyles}>{lineHeightType}</p>}
							/>
						)}
					</Field>
					
					<ButtonGroup segmented>
						<Button size="slim" pressed={(lineHeightType === 'px')? true: false} onClick={() => handleLineHeightTypeChange('px')}>px</Button>
						<Button size="slim" pressed={(lineHeightType === 'vh')? true: false} onClick={() => handleLineHeightTypeChange('vh')}>vh</Button>
						<Button size="slim" pressed={(lineHeightType === 'em')? true: false} onClick={() => handleLineHeightTypeChange('em')}>em</Button>
					</ButtonGroup>

				</Wrapper>
			</Collapsible>
		</li>
	);
}
  
  
export default Text;