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
        
    }


    [class^=shopadjust-product-offer-add-cart-]{
        color: inherit;
        text-decoration: inherit;
  
        }
    
     .sa-rows-columns {
        position: relative;
        float: left !important;
      }
    
    .aside-block-item-offer:after {
        content: "";
        CLEAR: both;
    
    }

    .sa-rows-volume-rows{
        float: nonw !important;
        display: block !important;
    }

    .sa-rows-volume-columns {
        display: flex !important;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
    }

    .aside-display-bundle-columns {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }

    .aside-display-tier-columns {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`

export const SaButton = styled.button``;