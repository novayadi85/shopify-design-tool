import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, Flex, Section as SectionElement, SidePanelBottom} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, Spinner, Select, Modal, TextContainer  } from '@shopify/polaris';
import { useSelector, useDispatch } from 'react-redux';
import SectionColumn from './SectionColumn';
import { updateSidebar } from '@store/template/action';

function Section() {
    let { handle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {items} = useSelector(state => state.template);
    let value = [];

    const [selected, setSelected] = useState(1);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);

    const [active, setActive] = useState(false);
    const buttonRef = useRef(null);
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
        requestAnimationFrame(() => buttonRef.current.querySelector("button").focus());
    }, []);

    const handleDelete = useCallback(() => {
        let _items = items.filter(t => t.ID !== value.ID);
        dispatch(updateSidebar(_items));
        setActive(false);
        navigate('/');
    }, []);

    const handleSelectChange = useCallback((value) => setSelected(Number(value)), []);


    items.forEach(item => {
        if(item.type === 'section' && handle === item.ID){
            value = item
        }

        if (item.type === 'section' && item?.items) {
            item.items.forEach(t => {
                if (t.ID === handle && t.type === 'section') {
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

    /*
    const ColumnBlocks = () => {
        return [...Array(selected - 1 + 1).keys()].map(x => x + 1).map((n) => {
            return <SectionColumn key={n} type={'section'} value={value} setting={(value?.setting?.content[n - 1]) ? value.setting.content[n - 1]: []} column={n} handle={handle}/>
        })
    }
    */
    const ColumnBlock = () => {
        return <SectionColumn type={'section'} value={value} setting={(value?.setting) ? value.setting: []} column={selected} handle={handle}/>
    }

    const activator = (
        <div ref={buttonRef}>
            <Button props={value} onClick={handleOpen} plain monochrome removeUnderline icon={DeleteMinor}>Delete Section</Button>
        </div>
      );

    return (
        <SidePanel>
            <SidePanelArea>
                <Header>
                    <BackAction>
                        <ButtonWrapper>
                            <Button onClick={backHandle} plain icon={ ChevronLeftMinor}></Button>
                        </ButtonWrapper>
                        <TitleWrapper>
                            <Heading><span className='capitalize'>{(value?.setting?.heading) ? value.setting.heading : value.label}</span></Heading>
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
                                        {(handle === 'sa-product-block-offer') ? (
                                            <>
                                                <ColumnBlock/>  
                                            </>
                                        ): (
                                                <>
                                                    <Select
                                                        label="Number of columns"
                                                        options={columns}
                                                        onChange={handleSelectChange}
                                                        value={selected}
                                                    />
                                                    <ColumnBlock/>  
                                                </>
                                                  
                                        )}
                                          
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
                {activator}
            </SidePanelBottom>
            <Modal
                small
                activator={buttonRef}
                open={active}
                onClose={handleClose}
                title="Delete"
                primaryAction={{
                    content: "Yes sure",
                    onAction: handleDelete,
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