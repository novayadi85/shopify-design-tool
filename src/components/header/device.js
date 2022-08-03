import { Button, Popover, ActionList, Icon } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { DesktopMajor, MobileMajor } from "@shopify/polaris-icons";
import { useSelector, useDispatch } from "react-redux";
import { setMode } from "@store/style/action";
function Device() {
  const { styles : { mode }} = useSelector(state => state);
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeMode, setActiveMode] = useState(mode);
  const dispatch = useDispatch();

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
          <Icon source={(activeMode === 'Desktop' || activeMode == null || activeMode === 'DESKTOP') ? DesktopMajor : MobileMajor}/>
    </Button>
  );

  useEffect(() => {
    if (document.querySelector('.device-preview')) {
      document.querySelector('.device-preview').classList.remove(activeMode === 'Desktop' || activeMode === 'DESKTOP' ? 'Mobile': 'Desktop');
      document.querySelector('.device-preview').classList.remove(activeMode === 'Desktop' || activeMode === 'DESKTOP' ? 'MOBILE': 'DESKTOP');
      document.querySelector('.device-preview').classList.add(activeMode);
    }

    dispatch(setMode(activeMode === 'Desktop'  || activeMode === 'DESKTOP' ? 'DESKTOP': 'MOBILE'));

  }, [activeMode])
    
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