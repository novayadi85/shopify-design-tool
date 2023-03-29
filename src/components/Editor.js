import React, { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { useTranslation } from 'react-i18next';
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import { useSelector, useDispatch } from 'react-redux';
import { SaveMinor} from "@shopify/polaris-icons";
import { Button } from '@shopify/polaris';
import { SidePanelBottom } from "@styles/Sidebar";
import { updateStyles } from '@store/style/action';

const Editor = ({values, handle, type}) => {
    const dispatch = useDispatch();
    const { styles } = useSelector(state => state);
    const { products: { page, templateId },} = useSelector(state => state);
    const [cssValues, setCssValues] = useState(values);
    const [formData, setFormData] = useState({});
    const { t } = useTranslation();
    // console.log('values', values)
    const refName = useRef();
    

    useEffect(() => {
        let css = ``
        if (cssValues != null && Object.keys(cssValues).length) {
            css = (
                Object.entries(values).map(([k, v]) => `${k}:${v}`).join(';\n')
            );
        }

        setCssValues(css)

    }, [])


    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async () => {
        //console.log('saving.....')
        if (handle === 'sa-product-block-offer') {
            dispatch(updateStyles(`sa-${type}-${templateId}`, formData));
        }
        else if(handle === 'global') {
            dispatch(updateStyles(`sa-global-${templateId}`, formData));
        }
        else if(handle === 'offer-setting') {
            dispatch(updateStyles(`sa-global-${templateId}`, formData));
        }
        else {
            dispatch(updateStyles(`sa-${type}-${handle}`, formData));
        }
        await sleep(2000)
    }

    const handleChanged = async (vals) => {
        setCssValues(vals);
        let replaced = vals.replaceAll('\\', '');
        replaced = replaced.replace(/\n|\r/g, "");
        const __vals = replaced.split(';');
        var ruleSet = {};
        for (var k = 0; k < __vals.length; ++k) {
            var keyValue = __vals[k].split(':');
            if (keyValue.length == 2) {
                var key = keyValue[0].trim();
                var value = keyValue[1].trim();
                ruleSet[key] = value;
            }
        }
        setFormData(ruleSet)
    }

    return (
        <>
            <AceEditor
                ref={refName}
                mode="css"
                width="100%"
            // height="300px"
                theme="tomorrow"
                onLoad={(editorInstance) => {
                    editorInstance.container.style.resize = "both";
                    document.addEventListener("mouseup", () => editorInstance.resize());
                }}
                onChange={handleChanged}
                value={`${cssValues}`}
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            <SidePanelBottom>
                <div style={{ margin: '10px'}}>
                    <Button onClick={async () => {
                       // console.log('saving...')
                        await save();
                    }} primary monochrome removeUnderline icon={SaveMinor}>{t('Apply')} CSS</Button>
                </div>
            </SidePanelBottom>
            
            
        </>
        
    )
}

export default Editor; 