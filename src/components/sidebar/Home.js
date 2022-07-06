/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {sortableContainer,sortableElement, sortableHandle } from 'react-sortable-hoc';
import {Button, Icon, Spinner } from "@shopify/polaris";
import { arrayMoveImmutable } from 'array-move';
import { DropdownMinor, DragHandleMinor } from "@shopify/polaris-icons";
import { Flex, PrimaryBox, ListItemWrapperContainer, CollapseToggle, ListItemContent, ListItemWrapper, ListItem, ListItemHandler, SidePanelAreaWrapper } from "@styles/Sidebar";
import { updateSidebar } from "@store/template/action";
import AddSection from "@components/actions/AddSection";
import AddBlock from "@components/actions/AddBlock";
import { getSidebar } from "../../store/template/action";

const DragHandle = sortableHandle(() =>
	<Icon
		source={DragHandleMinor}
		color="base"
	/>
);


const SortableContainer = sortableContainer(({children}) => {
  return <ul>{children}</ul>;
});

function Home() {
    const { items : _items} = useSelector(state => state.template);
    const state = useSelector(state => state);
	const [items, setItems] = useState(_items);	
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
	const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMoveImmutable(items, oldIndex, newIndex));
	};
    
    useEffect(() => {
        setLoading(false);
        dispatch(updateSidebar(items))

    }, [items])

    useEffect(() => {
        dispatch(getSidebar())
        setItems(state.template.items);

        // console.log('state', state.template.items)
    }, [_items])
	
    const renderChildren = ({ items = [], open = false }) => {
        return (
            <div className={`collapse ${(open) ? 'visible': 'hidden'}`}>
                <SortableContainer useDragHandle>
                    {items.map((value, index) => (
                    <SortableItem key={`item-${value.handle}`} index={index} value={value} />
                ))}
                </SortableContainer>
                <PrimaryBox>
                    <AddBlock/>		
                </PrimaryBox>
            </div>
        )
		
	}

	const collapseHandler = (value) => {
		setItems(items.map(item => {
			if (item.handle === value.handle) {
				item.open = item.open ? false : true
			}
			return item;
		}));
	}

	const SortableItem = sortableElement(({value}) => (
		<li className={`nav nav-sidebar has-subnav`}>
			<ListItemWrapperContainer className={`ListItemWrapperContainer ${(value?.separator) ? 'separator' : ''}`}>
				<CollapseToggle value={value} className={`visible ${(value.open) ? '': 'collapsed'}`}>
					<Button onClick={() => collapseHandler(value)} icon={DropdownMinor}/>
				</CollapseToggle>
				<ListItemContent>
					<ListItemWrapper>
						<ListItem>
							<div className='prefixIcon'>
								<Icon
									source={value.icon}
									color="base"
								/>
							</div>
							<div className='title'>
                                <ReactRouterLink className="removeUnderline" to={(value.type === 'section' ) ? `/section/${value.handle}`: `/block/${value.handle}`}>{value.label}</ReactRouterLink>
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
                <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${value.handle}`} index={index} value={value} />
                    ))}
                </SortableContainer>   
            )}

            <PrimaryBox style={{
                marginLeft: 0
            }}>	
                <AddSection/>
            </PrimaryBox>
        </SidePanelAreaWrapper>
    );
}

export default Home;