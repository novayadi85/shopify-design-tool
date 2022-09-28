/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {sortableContainer,sortableElement, sortableHandle } from 'react-sortable-hoc';
import {Button, Icon, Spinner } from "@shopify/polaris";
import { arrayMoveImmutable } from 'array-move';
import { DropdownMinor, DragHandleMinor, SettingsMinor, SectionMajor, BlockMinor, ProductsMajor, TextAlignmentLeftMajor, ButtonMinor} from "@shopify/polaris-icons";
import { Flex, PrimaryBox, ListItemWrapperContainer, CollapseToggle, ListItemContent, ListItemWrapper, ListItem, ListItemHandler, SidePanelAreaWrapper } from "@styles/Sidebar";
import { updateSidebar } from "@store/template/action";
import AddSection from "@components/actions/AddSection";
import AddBlock from "@components/actions/AddBlock";
import { getSidebar } from "../../store/template/action";
import { ThemeContent } from "../../Context";

const DragHandle = sortableHandle(() =>
	<Icon
		source={DragHandleMinor}
		color="base"
	/>
);


const SortableContainer = sortableContainer(({children}) => {
  return <ul style={{margin:' 0 0px', padding: '0 4px'}}>{children}</ul>;
});

function Home() {
    const theme = useContext(ThemeContent) 
    console.log('theme', theme)
    const { items : _items} = useSelector(state => state.template);
    const { canAddBlock } = useSelector(state => state.products);
    const state = useSelector(state => state);
	const [items, setItems] = useState(_items);	
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
	const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMoveImmutable(items, oldIndex, newIndex));
    };
    
    const onSortChildEnd = (data) => {
        const { collection, newIndex, oldIndex } = data 
        const updates = items.map(({...item}) => {
            if (item.ID === collection) {
                item.items = arrayMoveImmutable(item.items, oldIndex, newIndex)
            }

            return item;
        })

        setItems(updates);

	};
    
    useEffect(() => {
        setLoading(false);
        dispatch(updateSidebar(items))

    }, [items])

    useEffect(() => {
        dispatch(getSidebar())
        setItems(state.template.items);
    }, [_items])
	
    const renderChildren = ({ ID, items = [], open = false }) => {
        return (
            <div className={`collapse ${(open) ? 'visible': 'hidden'}`} style={{marginLeft: '1.2rem'}}>
                <SortableContainer props={{ id: ID}}  onSortEnd={onSortChildEnd} useDragHandle style={{marginLeft: '10px'}}>
                    {items.map((value, index) => (
                    <SortableItem collection={ID} keyCodes={value} key={`item-${index}`} index={index} value={value} />
                ))}
                </SortableContainer>
                <PrimaryBox>
                    {(canAddBlock) ? (<AddBlock handle={ID} />) : (null)}
                </PrimaryBox>
            </div>
        )
    }
    
    const ParentSection = () => {
        return (
            <div className={`visible`}>
                <SortableContainer style={{marginLeft: '10px'}}>
                <li className={`nav nav-sidebar has-subnav`}>
                    <ListItemWrapperContainer className={`ListItemWrapperContainer separator`}>
                        <ListItemContent>
                            <ListItemWrapper style={{paddingTop: '4px', paddingBottom: '2px'}}>
                                <ListItem>
                                    <div className='prefixIcon'>
                                        <Icon
                                            source={SettingsMinor}
                                            color="base"
                                        />
                                    </div>
                                    <div className='title'>
                                        <ReactRouterLink className="removeUnderline" to={`/setting/offer-setting`}>Offer Setting</ReactRouterLink>  
                                    </div>
                                </ListItem>
                            </ListItemWrapper>
                            
                        </ListItemContent>
                    </ListItemWrapperContainer>
                </li>
                </SortableContainer>
            </div>
        )
    }

	const collapseHandler = (value) => {
		setItems(items.map(({...item}) => {
            if (item.ID === value.ID) {
				item.open = item.open ? false : true
			}
			return item;
		}));
    }
    
    const IconBlock = (value) => {
        const Icons = {
            'offer-top': SectionMajor,
            'offer-bottom': SectionMajor,
            'offer-product': ProductsMajor,
            'block-editor': TextAlignmentLeftMajor,
            'block-button': ButtonMinor,
        }

        if (!Icons[value.handle] && value.type === 'block') {
            Icons[value.handle] = BlockMinor
        }

        return Icons[value.handle] ? Icons[value.handle] : SectionMajor
    }

    const SortableItem = sortableElement(({ value }) => (
		<li className={`nav nav-sidebar has-subnav`} parent={value.ID}>
			<ListItemWrapperContainer className={`ListItemWrapperContainer ${(value?.separator) ? '' : ''}`}>
                {(!value?.child || value.child === false) ? (
                <CollapseToggle value={value} className={`visible ${(value.type === 'section' && (value.child !== false)) ? 'visible' : 'hidden'} ${(value.open) ? '' : 'collapsed'}`}>
                    <Button onClick={() => collapseHandler(value)} icon={DropdownMinor}/>
                </CollapseToggle>
                ) : (<></>)}
                
                
				<ListItemContent>
					<ListItemWrapper>
						<ListItem>
                            <div className='prefixIcon nodemayor'>
                                <Icon
                                    source={IconBlock(value)}
                                    color="base"
                                />
                            </div>
                            <div className='title'>
                                {(value.handle === 'block-product') ? (
                                    <ReactRouterLink className="removeUnderline truncate-text" to={{
                                        pathname: `/product/${value.ID}`,
                                        state: value
                                    }}>
                                        {(value.label) ? <>{value.label} { (value?.setting?.column) ? `, ${value?.setting?.column}` : ''}</> :  '...'}
                                    </ReactRouterLink>
                                ): (
                                    <ReactRouterLink title={value?.setting?.column} className="removeUnderline truncate-text" to={(value.type === 'section' ) ? `/section/${value.ID}`: `/block/${value.ID}`}>{(value.label) ? <>{value.label} { (value?.setting?.column) ? `, ${value?.setting?.column}` : ''}</> : (value.handle === 'offer-product') ? "Products in List" : '...'}</ReactRouterLink>  
                                )}
							</div>
							
						</ListItem>
					</ListItemWrapper>
					
				</ListItemContent>
				<ListItemHandler className='icon-sortable-wrapper'>
					<div className='icon-sortable'>
						<DragHandle />
					</div>
				</ListItemHandler>
			</ListItemWrapperContainer>
			{renderChildren(value)}
		</li>
    ));
    
    return (
        <SidePanelAreaWrapper>
            
            {(loading) ? (
                <Flex>
                    <Spinner
                        size="small"
                        accessibilityLabel="Loading"
                        hasFocusableParent={false}
                    />
                </Flex>
                    
            ) : (
                    <>
                        {(canAddBlock) ? (<ParentSection/>) : (null)}
                        <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                            {items.map((value, index) => (
                                <SortableItem child={ value.child} key={`item-${index}`} index={index} value={value} />
                            ))}
                        </SortableContainer>   
                    </>
                
            )}

            <PrimaryBox>	
                {(canAddBlock) ? (<AddSection/>) : (null)}
            </PrimaryBox>
        </SidePanelAreaWrapper>
    );
}

export default Home;