import { Icon, Page, Layout, TextContainer, Text} from '@shopify/polaris';
import { Column1Major, Columns2Major } from '@shopify/polaris-icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import column1 from '../assets/column1.png'
import column2 from '../assets/column2.png'
import { uuid } from '../helper/number';
import { updateSidebar } from '../store/template/action';

const Swicth = styled.div`
    border-right: 0.0625rem solid var(--p-divider);
    overflow: hidden;
    position: relative;
    z-index: 10;
    background-color: var(--p-surface);
    max-width: 440px;
    margin: 0 auto;
    padding: 25px;
`

const Headline = styled.div`
    font-weight: bold;
    font-size: 22px;
`

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
`

const FlexBox = styled.div`
    display: block;
    width: 100%;

    img:hover {
        border: 1px solid #000000;
        box-shadow: 0px 0px 4px 0px #404040d1;
    }
    
`

function Column() {
    let params = useParams();
    let location = useLocation();
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.template);
    const updateColumn = ({column}) => {
        const match = location.pathname.match(/\/column\/(.+)/);
        if (match) {
            const result = match[1]; 
            //console.log(result);
            let _items = items.map(({ ...item }) => {
                // item.items = item?.items ? item.items.filter(t => t.ID !== result) : [];
                if (item.ID === result) {
                    if (!item?.columns) {
                        item.columns = []
                    }

                    let item_holders = [];
                    if (column === 1) {
                        item_holders.push({
                            ID: uuid(),
                            label: 'Content',
                            handle: 'full-side',
                            side: true,
                            items: []
                        })
                    }

                    if (column === 2) {
                        item_holders.push({
                            label: 'Left Side',
                            handle: 'left-side',
                            side: true,
                            ID: uuid(),
                            items: []
                        })

                        item_holders.push({
                            label: 'Right Side',
                            handle: 'right-side',
                            side: true,
                            ID: uuid(),
                            items: []
                        })
                    }
                    item.columns.push({
                        column: column,
                        label: (column === 2) ? `Double Column` : `Single Column`,
                        handle: 'column',
                        items: item_holders,
                        open: true,
                        ID: uuid()
                    })
                }
                return item;
            })
    
           // console.log(_items);
            dispatch(updateSidebar(_items));

        } else {
            console.log("No match found");
        }

       
    }
    return (
        <Swicth>
            <TextContainer><Headline>Which Type column do you want?</Headline></TextContainer>
            <Flex>
                <FlexBox>
                    <TextContainer>Single Column</TextContainer>
                    <img className='hasHover' column={1} onClick={() => updateColumn({
                        column: 1
                    })} style={{
                        marginTop: '5px'
                    }} src={column1} alt="" />
                </FlexBox>
                <FlexBox>
                    <TextContainer>Double Column</TextContainer>
                    <img class="hasHover" column={2} onClick={() => updateColumn({
                        column: 2
                    })} style={{
                        marginTop: '5px'
                    }} src={column2} alt=""/>
                </FlexBox>
            </Flex>
            
        </Swicth>
    )

}

export default Column;