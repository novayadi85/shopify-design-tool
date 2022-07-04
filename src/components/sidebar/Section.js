import { useEffect, useState,useCallback } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidePanel, SidePanelArea,  Header, BackAction, ButtonWrapper, TitleWrapper, ButtonRightWrapper, Section as SectionElement, SidePanelBottom} from "@styles/Sidebar";

import {
	DeleteMinor,
	ChevronLeftMinor
} from "@shopify/polaris-icons";

import { Button, Heading, FormLayout, TextField, Select  } from '@shopify/polaris';
import { useSelector } from 'react-redux';
import SectionColumn from './SectionColumn';

function Section(props) {
    let { handle } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(1);
    const [columns, setColumns] = useState([]);
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
        const options = async () => {
            const ops = [...Array(10 - 1 + 1).keys()].map(x => x + 1).map((n) => {
                return {
                    label: n, value: n
                }
            })

            setColumns(ops);
            
        };
      
        // call the function
        options().catch(console.error);

    }, [handle])

    const backHandle = () => {
        navigate('/')
    }

    const ColumnBlocks = () => {
        return [...Array(selected - 1 + 1).keys()].map(x => x + 1).map((n) => {
            return <SectionColumn key={n} type={ 'section'} handle={ handle } column={ n } />
        })
    }

    console.log(selected)

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
                            <div>catch all</div>
                        )
                    }
                })()}
                    
                </SectionElement>
            </SidePanelArea>
            <SidePanelBottom>
                <Button plain monochrome removeUnderline icon={DeleteMinor}>Delete Block</Button>
            </SidePanelBottom>
        </SidePanel>
    );
}

export default Section;