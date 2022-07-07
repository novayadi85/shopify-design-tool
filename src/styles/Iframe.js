import styled from "styled-components"

export const iframeStyle = `
    .sa-columns {
        float: left;
        width: 25%;
        padding: 10px;
        height: 300px; 
    }
    
    .sa-row:after {
        content: "";
        display: table;
        clear: both;
    }

    .sa-row {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-between;
        align-items: flex-start;
    }

    .sa-row > div {
        margin: 0.5rem;
    }
`

export const SaButton = styled.button``;