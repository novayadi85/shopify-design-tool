import React, { useCallback, useState, useEffect } from "react";
import { ActionList, Button, Icon, Popover } from "@shopify/polaris";
import { TextAlignmentLeftMajor, CirclePlusOutlineMinor, BlockMinor } from "@shopify/polaris-icons";
import { useSelector, useDispatch } from 'react-redux';
import { getSidebar, addNewBlock, updateSidebar } from "../../store/template/action";
import { useNavigate } from "react-router-dom";

export default function AddBlock({ handle = null, section = null}) {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(true);      
    const [lists, setLists] = useState([]);      
    const dispatch = useDispatch();    
    const navigate = useNavigate();
    const { blocks: { items: actions } } = useSelector(state => state);
    const state = useSelector(state => state);
    const { items : _items } = useSelector(state => state.template);
    const [isClicked, setIsClicked] = useState(Array(actions.length).fill(false));
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const activator = (
        <Button dataID={handle} onClick={toggleActive} icon={CirclePlusOutlineMinor}>Add Content</Button>
    );

    const handleClick = (index) => {
        setIsClicked(Array(actions.length).fill(false));
        setIsClicked((prev) => [
        ...prev.slice(0, index),
        !prev[index],
        ...prev.slice(index + 1)
        ]);

        // console.log([section, actions[index]], handle)
        // console.log('actions[index]]', actions[index])
        dispatch(addNewBlock(section, actions[index], handle))
        toggleActive();

        dispatch(updateSidebar(_items))
       // navigate(`/block/${actions[index].ID}`);
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

   // console.log('state', state)

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
