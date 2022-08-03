import styled from 'styled-components';

export const SidePanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1 1 auto;
    flex-wrap: nowrap;
    justify-content: space-between;
    &.hidden {
        display: none;
    }
`

export const SidePanelArea = styled.div`
    grid-area: primary-sidebar;
    position: relative;
    z-index: 10;
    background-color: #fff;
    margin-top: 5px;
    padding-top: 5px;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 100%;
`

export const Header = styled.div`
    padding-bottom: 0.5rem;
    padding-top: 0;
    border-bottom: 0.0625rem solid var(--p-divider);
`
export const BackAction = styled.div`
    margin-right: 0.25rem;
    display: flex;
    flex: 0 0 auto;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
`
export const ButtonWrapper = styled.div`

`

export const ButtonRightWrapper = styled.div`
    width: 100%;
    text-align: right;
`

export const TitleWrapper = styled.div`
    padding: 0 10px 5px;
`

export const Section = styled.div`
    margin-top: 2rem;
    padding: 0;
`
export const FieldGroup = styled.div`
    margin-top: .8rem;
    margin-bottom: .8rem;
`

export const SidePanelBottom = styled.div`
    padding: 0.7rem 10px 0.7rem;
    border: 0.0625rem solid var(--p-divider);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 19999;
    background: var(--p-surface);
    .Polaris-Button__Content{
        font-weight: var(--p-font-weight-semibold);
    }
`

export const RadioGroup = styled.div`
    padding: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
`

export const RemovePadding = styled.div`
    * {
        padding: 0px 0 0 0;
    }
`

export const Flex = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    margin: 2rem 0 0 0;
`


export const Wrapper = styled.div(props => ({
    borderTop: props?.BorderTop ? '0.0625rem solid var(--p-divider)': 'none',
    BorderBottom: props?.BorderBottom ? '0.0625rem solid var(--p-divider)': 'none',
    margin: props?.rem ? '1rem 0': '10px 10px',
}));



export const SidePanelAreaWrapper = styled.div``

export const ListItemWrapper = styled.div`
    margin-left: 2rem;
`
export const ListItemWrapperContainer = styled.div`
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

export const CollapseToggle = styled.div`
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
export const ListItemContent = styled.div`
    grid-area: 1/1;
    max-width: 100%;
    min-width: 0;
`

export const ListItemHandler = styled.div`
    align-items: center;
    display: flex;
    grid-area: 1/1;
    justify-self: self-end;
    position: relative;
    z-index: 2;
`


export const ListItem = styled.button`
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

export const PrimaryBox = styled.div`
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
