import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Flex, Section as SectionElement, SidePanelBottom} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, Spinner, Select, Modal, TextContainer  } from '@shopify/polaris';
import { useSelector } from 'react-redux';
import SectionColumn from './SectionColumn';

function Section() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(1);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
   

    const [active, setActive] = useState(false);
    const button = useRef();
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => button.current.querySelector("button").focus());
    }, []);

    const handleSelectChange = useCallback((value) => setSelected(Number(value)), []);

    const items = useSelector(state => state.template);
    let value = [];
    items.forEach(item => {
        if(item.type === 'section' && handle === item.handle){
            value = item
        }

        if (item.type === 'section' && item?.items) {
            item.items.forEach(t => {
                if (t.handle === handle && t.type === 'section') {
                    value = t;
                }

            })
        }
    });

    
    useEffect(() => {
        setLoading(true);
        const options = async () => {
            const ops = [...Array(10 - 1 + 1).keys()].map(x => x + 1).map((n) => {
                return {
                    label: n, value: n
                }
            })

            setColumns(ops);
            
        };

        setTimeout(() => {
            // call the function
            options().catch(console.error);
            return setLoading(false);
        }, 500)
        

    }, [handle])

    const backHandle = () => {
        navigate('/')
    }

    const ColumnBlocks = () => {
        return [...Array(selected - 1 + 1).keys()].map(x => x + 1).map((n) => {
            return <SectionColumn key={n} type={ 'section'} handle={ handle } column={ n } />
        })
    }

    return (
        <SidePanel>
            <SidePanelArea>
                <Header>
                    <BackAction>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading><span className='capitalize'>{value.label}</span></Heading>
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
                    <SectionElement>
                        {(() => {
                            if (columns.length > 0) {
                                return (
                                    <FormLayout>
                                        <Select
                                            label="Number of columns"
                                            options={columns}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />

                                        <ColumnBlocks/>
                                    </FormLayout>
                                )
                            }
                            else {
                                return (
                                    <Flex>
                                        <Spinner
                                            size="small" 
                                            accessibilityLabel="Loading"
                                            hasFocusableParent={false}
                                        />
                                    </Flex>
                                )
                            }
                        })()}
                            
                        </SectionElement>
                )}

                
            </SidePanelArea>
            <SidePanelBottom>
                <Button onClick={handleOpen} plain monochrome removeUnderline icon={DeleteMinor}>Delete Section</Button>
            </SidePanelBottom>
            <Modal
                small
                open={active}
                onClose={handleClose}
                title="Delete"
                primaryAction={{
                content: "Yes sure",
                onAction: handleClose,
                }}
                secondaryActions={[
                {
                    content: "Cancel",
                    onAction: handleClose,
                },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>Do you sure to remove this section? </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </SidePanel>
    );
}

export default Section;