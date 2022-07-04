
import React from 'react';
import MainRoutes from "@routes/index";
import styled from 'styled-components';

const SidePanel = styled.div`
border-right: 0.0625rem solid var(--p-divider);
grid-area: primary-sidebar;
overflow: hidden;
position: relative;
z-index: 10;
background-color: var(--p-surface);
margin-top: 5px;
padding-top: 5px;
`

const SidePanelArea = styled.div`
height: 100%;
position: relative;
width: 100%;
min-width: 18.75rem;
ul {
    background-color: var(--p-surface);
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

function Sidebar() {
	return (
			<SidePanel>
				<SidePanelArea>
					<MainRoutes/>
				</SidePanelArea>
			</SidePanel>
		);
}


export default Sidebar;