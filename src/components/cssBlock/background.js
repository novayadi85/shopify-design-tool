import {Button, Collapsible } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronRightMinor } from "@shopify/polaris-icons";
  
function Background() {
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);
  
      return (
        <li>
          <div className="flex link border-bottom" onClick={handleToggle}>
          <Button
              ariaExpanded={open}
                  ariaControls="basic-collapsible"
                  plain 
                  monochrome
                  removeUnderline
            >
              Background
            </Button>
            <Button plain icon={ ChevronRightMinor}></Button>
            </div>
            
            
            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              
            </Collapsible>
        </li>
    );
}
  
  
export default Background;