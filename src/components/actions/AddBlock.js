import React, { useCallback, useState, useEffect } from "react";
import { ActionList, Button, Icon, Popover } from "@shopify/polaris";
import { TextAlignmentLeftMajor, CirclePlusOutlineMinor, BlockMinor } from "@shopify/polaris-icons";
import { useSelector, useDispatch } from 'react-redux';
import { getSidebar, addNewBlock } from "../../store/template/action";

export default function AddBlock({ handle }) {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(true);      
    const [lists, setLists] = useState([]);      
    const dispatch = useDispatch();    
    const { blocks: { items: actions } } = useSelector(state => state);
    const state = useSelector(state => state);

    const [isClicked, setIsClicked] = useState(Array(actions.length).fill(false));
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const activator = (
        <Button onClick={toggleActive} icon={CirclePlusOutlineMinor}>Add Block</Button>
    );

    const handleClick = (index) => {
        setIsClicked(Array(actions.length).fill(false));
        setIsClicked((prev) => [
        ...prev.slice(0, index),
        !prev[index],
        ...prev.slice(index + 1)
        ]);

        dispatch(addNewBlock(handle, actions[index]))
        toggleActive();
    };

    useEffect(() => {
        setLoading(false);
        const _lists = actions.map((a, i) => ({
            onAction: () => handleClick(i),
            active: isClicked[i],
            content: a.label,
            helpText: a.helpText,
            prefix: ('block-content' === a.handle) ? <Icon source={BlockMinor} /> : <Icon source={a.icon} />
        }))

        setLists(_lists);
        dispatch(getSidebar())
    }, [])

    return (
        <div className="add-block">
        <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={toggleActive}
        >
            <ActionList
            actionRole ="menuitem"
            items = {lists}
            />
        </Popover>
        </div>
    );
}
