/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import {
	sortableContainer,
	sortableElement,
	sortableHandle
} from 'react-sortable-hoc';
import {
	Button,
    Icon,
    Spinner
} from "@shopify/polaris";
import { arrayMoveImmutable } from 'array-move';
import styled from 'styled-components';


import {
	DropdownMinor,
	DragHandleMinor,
	CirclePlusOutlineMinor
} from "@shopify/polaris-icons";

import { Flex } from "@styles/Sidebar";


const SidePanelAreaWrapper = styled.div``

const ListItemWrapper = styled.div`
    margin-left: 2rem;
`
const ListItemWrapperContainer = styled.div`
    align-items: center;
    display: grid;
    height: var(--osui_height-nav-action);
    position: relative;

    .hidden {
        display: none;
    }

    &.separator {
        &:after{
            display: block;
            border-bottom: 1px solid var(--p-divider);
            height: 1px;
            width: 100%;
            content: "";
            padding: 5px 0 0px;
            margin-bottom: 10px;
        }
        
    }
`

const CollapseToggle = styled.div`
    grid-area: 1/1;
    justify-self: self-start;
    position: relative;
    z-index: 3;
    &.collapsed {
        .Polaris-Icon{
            transform: rotateZ(270deg);
        }
    }

    button {
        appearance: none;
        background: none;
        border: none;
        box-shadow: none;

        &:hover {
            appearance: none;
            background: none;
            border: none;
            box-shadow: none;
        }
    }
`
const ListItemContent = styled.div`
    grid-area: 1/1;
    max-width: 100%;
    min-width: 0;
`

const ListItemHandler = styled.div`
    align-items: center;
    display: flex;
    grid-area: 1/1;
    justify-self: self-end;
    position: relative;
    z-index: 2;
`


const ListItem = styled.button`
    padding-left: 0.25rem;
    align-items: center;
    appearance: none;
    background: none;
    border: none;;
    color: inherit;
    cursor: pointer;
    display: flex;
    font-size: .9375rem;
    gap: 0.5rem;
    height: 2rem;
    justify-content: left;
    letter-spacing: normal;
    line-height: 1;
    margin: 0;
    max-width: 100%;
    min-height: 2.25rem;
    min-width: 2.25rem;
    outline: none;
    padding: 0;
    position: relative;
    text-align: left;
    text-decoration: none;
    text-transform: none;
    transition: background-color 150ms cubic-bezier(0.25,0.1,0.25,1);
    width: 100%;
    z-index: 1;
    .icon-sortable{
        .Polaris-Icon {
            position: absolute;
            right: 0;
            top: 10px;
            cursor: move;
        }
    }

`

const PrimaryBox = styled.div`
    margin: 0 20px;
    button{
        appearance: none;
        background: none;
        border: none;
        box-shadow: none;
        color: var(--p-interactive);
        &:hover {
            appearance: none;
            background: none;
            border: none;
            box-shadow: none;
        }
        svg {
            fill: var(--p-interactive);
        }
    }
`


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
    let { handle } = useParams();
    const _items = useSelector(state => state.template);
	const [items, setItems] = useState(_items);	
    const [loading, setLoading] = useState(false);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems(arrayMoveImmutable(items, oldIndex, newIndex));
	};

    useEffect(() => {
        setLoading(false);
        /*
        setTimeout(() => {
            return setLoading(false);
        }, 1500)
        */

    }, [])
	
	const renderChildren = ({items, open = false}) => {
		return (
			<div className={`collapse ${(open) ? 'visible': 'hidden'}`}>
				<SortableContainer useDragHandle>
					{items.map((value, index) => (
					<SortableItem key={`item-${value.handle}`} index={index} value={value} />
				))}
				</SortableContainer>
				<PrimaryBox>
					<Button icon={CirclePlusOutlineMinor}>Add Block</Button>		
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
		<li className={`nav nav-sidebar ${(value?.items) ? 'has-subnav': ''}`}>
			<ListItemWrapperContainer className={`ListItemWrapperContainer ${(value?.separator) ? 'separator' : ''}`}>
				<CollapseToggle value={value} className={`${(value?.items) ? 'visible': 'hidden'} ${(value.open) ? '': 'collapsed'}`}>
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
			{value?.items ? renderChildren(value) : null }
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
                <Button icon={CirclePlusOutlineMinor}>Add Section</Button>		
            </PrimaryBox>
        </SidePanelAreaWrapper>
    );
}

export default Home;