import { Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback } from "react";
import {
	CirclePlusOutlineMinor
} from "@shopify/polaris-icons";

function AddBlock() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const activator = (
    <Button onClick={toggleActive} icon={CirclePlusOutlineMinor}>Add Block</Button>
  );

  return (
    <div className="add-block">
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleActive}
      >
        <ActionList
          actionRole="menuitem"
          
          sections={[
              {
                title: "Block",
                items: [
                {
                  content: "Blog posts",
                  helpText: "Lorem ipsum dolor ipsum",
                },
                {
                  content: "Blogs",
                  helpText: "Lorem ipsum dolor ipsum",
                },
              ],
            },
          ]}
        />
      </Popover>
    </div>
  );
}

export default AddBlock