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
    overflow: hidden;
    position: relative;
    z-index: 10;
    background-color: #fff;
    margin-top: 5px;
    padding-top: 5px;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 100%;
    overflow-y: scroll;
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


export const SidePanelBottom = styled.div`
    padding: 0.7rem 10px 0.7rem;
    border-top: 0.0625rem solid var(--p-divider);
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