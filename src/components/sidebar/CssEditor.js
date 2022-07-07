
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Section, SidePanelBottom, Flex} from "@styles/Sidebar";
import { DeleteMinor,ChevronLeftMinor } from "@shopify/polaris-icons";
import { Form, Field } from 'react-final-form';
import { Button, Heading, Spinner } from '@shopify/polaris';
import * as Block from '../styles';
import { updateStyles } from '../../store/style/action';
import { useDispatch } from 'react-redux';
import AutoSave from '../actions/AutoSaveStyle';

const style = {
    height: "195px",
    color: "#666",
    tabSize: 4,
    overflow: "auto",
    padding: "10px",
    border: "1px solid #e5e5e5",
    borderRadius: "3px",
    background: "#eee"
};


function CssEditor() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [selector, setSelector] = useState(handle);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (handle === 'offer-setting') {
                setSelector('offer-container');
            }
            else {
                setSelector(handle);
            }
            
            return setLoading(false);
        }, 1000)
    }, [handle]);
 
    const backHandle = () => {
        if (location.pathname.includes('block')) {
            navigate(`/block/${handle}`)
        }
        else if (location.pathname.includes('offer-css')) {
            navigate(`/`)
        }  else {
            navigate(`/section/${handle}`)
        }
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    const save = async lines => {
        console.log('Saving', lines)
        dispatch(updateStyles(lines))
        await sleep(2000)
    }

    return (
        <SidePanel>
            <SidePanelArea style={{padding: 0}}>
                <Header>
                    <BackAction style={{paddingLeft: '10px'}}>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading>Go Back</Heading>
                        </TitleWrapper>
                    </BackAction>
                </Header>
                {(loading) ? (
                    <Flex>
                        <Spinner
                            size="small"
                            accessibilityLabel="Loading"
                            hasFocusableParent={false}
                        />
                    </Flex>
                    
                ) : (
                        <Section style={{ marginTop: '0' }}> 
                        <ul>
                            <Form onSubmit={save}
                                initialValues={{
                                    "background-image": "",
                                    "background-repeat": "repeat-y",
                                    "background-position": "center center",
                                    "background-color": "#000000"
                                }}
                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <AutoSave debounce={1000} save={save} />
                                        <Block.Background />
                                        <Block.Font />
                                        <Block.Text />
                                        <Block.Shadow />
                                        <Block.Border />
                                        <Block.Margin />
                                        <Block.Padding />
                                        <Block.Position />
                                        <Block.Width />
                                        <Block.Height />
                                        <Block.Extra />
                                        <pre style={style}>
                                            <code>{JSON.stringify(values, null, 2)}</code>
                                        </pre>
                                    </form>
                                        
                                )}
                            />
                               
                        </ul>
                        
                    </Section>   
                )};
                
            </SidePanelArea>
            <SidePanelBottom>
                <></>
            </SidePanelBottom>
        </SidePanel>
    )

}

export default CssEditor;