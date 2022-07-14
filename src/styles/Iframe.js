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
    }
    .sa-row:before, .sa-row:after {
        content: "";
        clear: both;
    }

    .sa-row > div {
        margin: 0.5rem;
    }

    .sa-columns-2,.sa-columns-3,.sa-columns-4,.sa-columns-5,.sa-columns-6,.sa-columns-7,.sa-columns-8,.sa-columns-9,.sa-columns-10 {
        float: left !important;
        width: auto;
        display: inline-block !important;
    }

    .sa-columns-1{
        float: none;
    }

    .sa-display-columns {
        float: left;
    }

    .sa-rows-columns {
        CLEAR: both;
        position: relative;
    }
`

export const SaButton = styled.button``;