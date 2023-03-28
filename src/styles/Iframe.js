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

    .aside-display-banner-columns {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }

    .aside-display-columns {
        display: flex;
        flex-direction: row;
        gap: 5px;
        flex-wrap: wrap;
    }

    [data-click^="/block"]:hover {
        border: .1px dashed #0d85d1;
    }

    .aside-display-columns > * {
        flex: 1 1 180px;
        max-width: calc( 50% - 10px);
    }

    .aside-display-rows {
        display: block;
    }
    

    .items-separator .shopadjust---item:last-child:after {
        display: none;
    }

    .items-separator .shopadjust---item:after {
        content: "+";
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        margin: 30% 20px;
        border-radius: 50%;
        background: #fbfbfb;
        border: 1px solid #000;
        color: #0e0e0e;
    }

    .aside-display-columns .loop-separator:last-child {
        display: none !important;
    }

    .aside-block-item-offer > .shopadjust---item.item-separator:after {
        content: "+";
        position: absolute;
        right: 0px;
        top: 25%;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fbfbfb;
        border: 1px solid #000;
        color: #000;
        text-align: center;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
    }

    .aside-block-item-offer > .shopadjust---item.item-separator:last-child:after{
        content: "";
        display: none !important;
    }

    .aside-display-columns .loop-separator:before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        margin: 30% 20px;
        border-radius: 50%;
        background: #fbfbfb;
        border: 1px solid #000;
        color: #0e0e0e;
        position: relative;
    }

    .aside-display-columns .loop-separator:after {
        content: "+";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        margin: 30% 25px;
    }

    .aside-display-columns .loop-separator {
        position: relative;
        margin: 10% 0;
    }

    .aside-display-rows .loop-separator {
        position: relative;
        margin: 10px auto;
        text-align: center;
        width: 25px;
        height: 25px;
        border: 1px solid;
        border-radius: 50%;
    }

    .aside-display-rows .loop-separator:last-child {
        display: none !important;
    }
    
    .aside-display-rows .loop-separator:after {
        content: "+";
        display: inline-block;
        position: relative;
        top: 0;
        width: 25px;
        height: 25px;
        margin: 0%;
        left: -1px;

    }

    hr {
        margin: 0;
        background-color: #999;
    }

    .grid-display{
        overflow: hidden;
        height: auto;
    }

    .grid-row {
        clear: both;
        height: auto;
        overflow: hidden;
        display: grid;
        grid-template-columns: 50% 50%;
        grid-gap: 5px;
        align-items: center;
    }

    .grid-column{
        width: 100%;
    }

    .grid-column.column-root-columnLeft {
        
    }

    .grid-column.column-root-columnRight {
        width: calc( 100% - 5px);
    }
 
    .column-root-columnFullWidth {
        width: 100%;
        float: none;
    }

    .grid-column-rows{

        
    }

    .fullWidth{
        width: 100%;
    }

    .grid-column-rows.fullWidth{
        
    }

    .grid-row.root-columnFullWidth {
        display: block;
        width: 100%;
    }

    .shopadjust---item{
        width: 100%;
        position: relative;
    }

    .shopadjust---item img{
        width: 100%;
    }

`

export const SaButton = styled.button``;