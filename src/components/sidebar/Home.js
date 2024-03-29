/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {sortableContainer,sortableElement, sortableHandle } from 'react-sortable-hoc';
import {Button, Icon, Spinner } from "@shopify/polaris";
import { arrayMoveImmutable } from 'array-move';
import { DropdownMinor, DragHandleMinor, SettingsMinor, SectionMajor, BlockMinor, ProductsMajor, TextAlignmentLeftMajor, ButtonMinor, MobileHamburgerMajor} from "@shopify/polaris-icons";
import { Flex, PrimaryBox, ListItemWrapperContainer, CollapseToggle, ListItemContent, ListItemWrapper, ListItem, ListItemHandler, SidePanelAreaWrapper } from "@styles/Sidebar";
import { updateSidebar } from "@store/template/action";
import AddSection from "@components/actions/AddSection";
import AddBlock from "@components/actions/AddBlock";
import AddColumn from "@components/actions/AddColumn";
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
    const [context, setContext] = useContext(ThemeContent);
    // console.log('useContext', context)
    const { items : _items } = useSelector(state => state.template);
    const { canAddBlock , canAddSection} = useSelector(state => state.products);
    const state = useSelector(state => state);
	const [loaded, setLoaded] = useState(false);	
	const [items, setItems] = useState(_items);	
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
	const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMoveImmutable(items, oldIndex, newIndex));
    };

    const findItemById = (items, id) => {
        for (const item of items) {
            if (item.ID === id) {
                return item;
            } else if (item?.columns) {
                const nestedItem = findItemById(item.columns, id);
                if (nestedItem) {
                    return nestedItem;
                }
            }
            else if (item.items) {
                const nestedItem = findItemById(item.items, id);
                if (nestedItem) {
                    return nestedItem;
                }
            }
        }

        return null;
    };
    
    const onSortChildEnd = (data) => {
        const { collection, newIndex, oldIndex } = data;
        const itemToUpdate = findItemById(items, collection);
      
        if (!itemToUpdate) return;
      
        if (itemToUpdate.columns) {
          itemToUpdate.columns = arrayMoveImmutable(itemToUpdate.columns, oldIndex, newIndex);
        } else {
          itemToUpdate.items = arrayMoveImmutable(itemToUpdate.items, oldIndex, newIndex);
        }
      
        setItems([...items]);
    };
    
    
    useEffect(() => {
        setLoading(!context.ready ? true : false);
        dispatch(updateSidebar(items))
        //setLoaded(true);
    }, [items])

    useEffect(() => {
        dispatch(getSidebar())
        // if(!loaded) setLoading(true);
       // console.log('context', context)
        if (!context.ready) {
            setLoading(true);
        }
        setItems(state.template.items);
    }, [_items])
	
    const renderChildren = ({ ID, items = [], open = true, columns = [] , column = false, type = false, side = false}) => {
        // console.log('type', [type, ID])
        return (
            <div className={`collapse ${(open) ? 'visible': 'hidden'}`} style={{marginLeft: '1.2rem'}}>
                <SortableContainer props={{ id: ID}}  onSortEnd={ onSortChildEnd } useDragHandle style={{marginLeft: '10px'}}>
                    {items.map((value, index) => (
                        <>
                            <SortableItem collection={ID} keyCodes={value} key={`sortableItem--item-${index}`} index={index} value={value} />
                            {(value?.side) ? <PrimaryBox><AddBlock section={ID} handle={value.ID} /></PrimaryBox> : null}
                        </>
                    ))}
                </SortableContainer>
                <PrimaryBox>
                    { /* {(canAddBlock) ? (<AddBlock handle={ID} />) : (null)} */}
                    {(canAddBlock && !column && type != 'block' && !side) ? (<AddColumn handle={ID} />) : (null)}
                </PrimaryBox>
            </div>
        )
    }

    const renderChildrenColumns = ({ ID, items = [], open = true, columns = [] , type = false}) => {
        return (
            <div className={`collapse ${(open) ? 'visible': 'hidden'}`} style={{marginLeft: '1.2rem'}}>
                <SortableContainer props={{ id: ID}}  onSortEnd={onSortChildEnd} useDragHandle style={{marginLeft: '10px'}}>
                    {columns.map((value, index) => (
                        <SortableItem collection={ID} keyCodes={value} key={`SortableItem---item-${index}`} index={index} value={value} />
                    ))}
                </SortableContainer>
                <PrimaryBox>
                    { /* {(canAddBlock) ? (<AddBlock handle={ID} />) : (null)} */}
                    {(canAddBlock && type != 'block') ? (<AddColumn handle={ID} />) : (null)}
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
            'column' : MobileHamburgerMajor
        }

        if (!Icons[value.handle] && value.type === 'block') {
            Icons[value.handle] = BlockMinor
        }

        return Icons[value.handle] ? Icons[value.handle] : SectionMajor
    }

    const SortableItem = sortableElement(({ value }) => (
        <li key={ `sortableElement---${value.ID}` }  className={`nav nav-sidebar has-subnav`} parent={value.ID}>
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
                                        {(value.label) ? <>{value.label}</> :  '...'}
                                    </ReactRouterLink>
                                ) : (
                                        (value?.side) ? (<>{value.label}</>) : (<ReactRouterLink title={value?.setting?.column} className="removeUnderline truncate-text" to={(value.type === 'section' ) ? `/section/${value.ID}`: `/${value.type}/${value?.ID ? value.ID : value?.handle}`}>{(value.label) ? <>{value.label}</> : (value.handle === 'offer-product') ? "Offer" : '...'}</ReactRouterLink>  )
                                    
                                )}
							</div>
							
						</ListItem>
					</ListItemWrapper>
					
                </ListItemContent>
                {(!value?.side) ? (
                    <ListItemHandler className='icon-sortable-wrapper'>
					<div className='icon-sortable'>
						<DragHandle />
					</div>
                </ListItemHandler>
                ) : null}
				
                
			</ListItemWrapperContainer>
            {value?.columns ? renderChildrenColumns(value) : renderChildren(value)}
		</li>
    ));

   // console.log('items', items)
    
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
                        { /* (canAddBlock && canAddSection) ? (<ParentSection/>) : (null) */}
                        <ParentSection/>
                        <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                                {Array.isArray(items) ? (
                                    items.map((value, index) => (
                                        <SortableItem child={value.child} key={`sortableItem-item-${index}`} index={index} value={value} />
                                    ))
                                ) : (
                                <div>Invalid items format: expected an array.</div>
                            )}
                            
                        </SortableContainer>   

                        
                    </>
                
            )}

            <PrimaryBox>	
                {(canAddSection) ? (<AddSection/>) : (null)}
            </PrimaryBox>
        </SidePanelAreaWrapper>
    );
}

export default Home;