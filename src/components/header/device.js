import { Button, Popover, ActionList, Icon } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { DesktopMajor, MobileMajor } from "@shopify/polaris-icons";

function Device() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeMode, setActiveMode] = useState(null);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
          <Icon source={(activeMode === 'Desktop' || activeMode == null) ? DesktopMajor : MobileMajor}/>
    </Button>
  );
    
  return (
    <div className="flex">
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
            actionRole="menuitem"
            items={
            [
                {
                    content: 'Desktop',
                    icon: DesktopMajor,
                    onAction: (props) => {
                        setActiveMode('Desktop');
                    }
                },
                {
                    content: 'Mobile',
                    icon: MobileMajor,
                    onAction: (props) => {
                        setActiveMode('Mobile');
                    }
                }

                
            ]}
        />
      </Popover>
    </div>
  );
}

export default Device