import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    margin: 2rem auto;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;

    @media (min-width: 468px) {
        margin-left: 1rem;
    }

`

export const Section = styled.div`
    margin-top: 0.5em;
    padding: 0px;
    display: block;
    border: 1px dotted #bfbfff;
    position: unset !important;

    @media (max-width: 468px) {
        width: 100% !important;
    }

`
export const Block = styled.aside`
    padding: 0px;
    display: block;
`

