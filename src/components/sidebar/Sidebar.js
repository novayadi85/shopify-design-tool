
import React, {useState} from 'react';
import {
	sortableContainer,
	sortableElement,
	sortableHandle
} from 'react-sortable-hoc';
import {
	Button,
    Icon
} from "@shopify/polaris";
import { arrayMoveImmutable } from 'array-move';
import styled from 'styled-components';

import {
	BlockMinor,
	NoteMajor,
	DropdownMinor,
	TextAlignmentLeftMajor,
	ProductsMajor,
	DragHandleMinor,
	CirclePlusOutlineMinor
} from "@shopify/polaris-icons";


const SidePanel = styled.div`
	border-right: 0.0625rem solid #e1e3e5;
	grid-area: primary-sidebar;
    overflow: hidden;
    position: relative;
    z-index: 10;
    background-color: #fff;
	margin-top: 5px;
    padding-top: 5px;
`

const SidePanelArea = styled.div`
	height: 100%;
	position: relative;
	width: 100%;
    min-width: 18.75rem;
	ul {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav {
		width: 100%;
		flex: 1 1 auto;
		padding-left: 0rem;
		padding-right: 0rem;
		position: relative;
		&.has-subnav{
			padding-left: 0rem;
		}

		.icon-sortable {
			position: relative;
			right: 10px;
			top: -7px;
			cursor: move;
		}

		.icon-sortable-wrapper{
			visibility: hidden;
			transition: visibility 150ms cubic-bezier(0.25,0.1,0.25,1);
    		transform: translate3d(0px, 10px, 0px);
		}
	}
`
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
			border-bottom: 1px solid #99999947;
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
		color: #2c6ecb;
		&:hover {
			appearance: none;
			background: none;
			border: none;
			box-shadow: none;
		}
		svg {
			fill: #2c6ecb;
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

function Sidebar() {
	const _items = [
		{
			handle: 'offer-content',
			url: '/#',
			label: 'Offer Content',
			separator: true,
			icon: NoteMajor
		}, {
			handle: 'offer-top',
			url: '/#',
			label: 'Offer top',
			icon: NoteMajor,
			items: [
				{
					handle: 'headline',
					url: '/#',
					label: 'headline',
					icon: TextAlignmentLeftMajor,
				},
				{
					handle: 'description',
					url: '/#',
					label: 'description',
					icon: TextAlignmentLeftMajor,
				}
			]
		},
		{
			handle: 'offer-product',
			url: '/#',
			label: 'Offer products',
			icon: ProductsMajor,
			items: [
				{
					handle: 'save',
					url: '/#',
					label: 'Save',
					icon: TextAlignmentLeftMajor,
				},
				{
					handle: 'product-content',
					url: '/#',
					label: 'Product content',
					icon: BlockMinor,
				}
			]
		}
	]
	const [items, setItems] = useState(_items);
  
	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems(arrayMoveImmutable(items, oldIndex, newIndex));
	};

	
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
								{value.label}
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
			<SidePanel>
				<SidePanelArea>
					<SortableContainer onSortEnd={onSortEnd} useDragHandle>
						{items.map((value, index) => (
							<SortableItem key={`item-${value.handle}`} index={index} value={value} />
						))}
					</SortableContainer>
					<PrimaryBox style={{
						marginLeft: 0
					}}>
						<Button icon={CirclePlusOutlineMinor}>Add Section</Button>		
					</PrimaryBox>
				</SidePanelArea>
			</SidePanel>
		);
}


export default Sidebar;