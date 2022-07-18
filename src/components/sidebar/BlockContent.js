import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { FormLayout, TextField} from '@shopify/polaris';
import { editBlock } from "@store/template/action";

function BlockContent(props) {
    const  { value: prop } = props
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(prop);
    const [content, setContent] = useState(prop?.label);
    const [focused, setFocused] = useState(prop?.label);

    const handleContentChange = (val) => {
        setContent(val);
        dispatch(editBlock(value, {
            content: val,
            headline: val
        }))   
        setFocused(true);
    }
 
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            return setLoading(false);
        }, 500)

    }, []);

    return (
        <>
            {(!prop?.handle) ? (
                <FormLayout>
                    <TextField multiline={4} disabled label="Text" focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                </FormLayout>
            ) : (
                <FormLayout>
                    <TextField  multiline={4} label="Text" focused={focused} onChange={handleContentChange} value={content} autoComplete="off" />
                </FormLayout>
            )}
                 
        </>
    )
}

export default BlockContent;