import { Button, Collapsible, ButtonGroup, RangeSlider, Label} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { Wrapper } from "@styles/Sidebar";
import { RemovePadding } from "../../styles/Sidebar";
  
function Text() {
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
							<ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Text align'}>
								<Button size="slim"  pressed={(align === 'left')? true: false} onClick={() => handleAlignChange('left')}>Normal</Button>
								<Button size="slim" pressed={(align === 'center')? true: false} onClick={() => handleAlignChange('center')}>Center</Button>
								<Button size="slim" pressed={(align === 'right')? true: false} onClick={() => handleAlignChange('right')}>Right</Button>
							</ButtonGroup>
          </div>

          <div style={{marginTop:10, marginBottom: 10}}>
							<RemovePadding><Label>Decoration</Label></RemovePadding>
							<ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Decoration'}>
								<Button size="slim" pressed={(decoration === 'none')? true: false} onClick={() => handleDecorationChange('none')}>None</Button>
								<Button size="slim" pressed={(decoration === 'overline')? true: false} onClick={() => handleDecorationChange('overline')}>Overline</Button>
								<Button size="slim" pressed={(decoration === 'through')? true: false} onClick={() => handleDecorationChange('through')}>Through</Button>
								<Button size="slim" pressed={(decoration === 'underline')? true: false} onClick={() => handleDecorationChange('underline')}>Underline</Button>
							</ButtonGroup>
          </div>

          <div style={{marginTop:10, marginBottom: 10}}>
							<RemovePadding><Label>Text transform</Label></RemovePadding>
							<ButtonGroup className={ 'test' } style={{marginTop:10, marginBottom: 10}} segmented label={'Font style'}>
								<Button size="slim" pressed={(transform === 'uppercase')? true: false} onClick={() => handleTransformChange('uppercase')}>UPERCASE</Button>
								<Button size="slim" pressed={(transform === 'lowercase')? true: false} onClick={() => handleTransformChange('lowercase')}>lowercase</Button>
								<Button size="slim" pressed={(transform === 'capitalize')? true: false} onClick={() => handleTransformChange('capitalize')}>Capitalize</Button>
								<Button size="slim" pressed={(transform === 'none')? true: false} onClick={() => handleTransformChange('none')}>None</Button>
							</ButtonGroup>
          </div>

          <RangeSlider
							output
							label="Line height"
							min={0}
							max={100}
							step={1}
							value={lineHeight}
							fontSize={lineHeight}
							onChange={setLineHeight}
							suffix={<p style={suffixStyles}>{lineHeight}</p>}
						/>

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