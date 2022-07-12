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
        display: block;
        &:before{
            content: "";
            clear: both;
        }
        &:after{
            content: "";
            clear: both;
        }
    }

    .sa-row > div {
        margin: 0.5rem;
    }

    [class^=sa-columns-] {
        width: auto;
        display: inline-block;
        float: left;
    }
`

export const SaButton = styled.button``;