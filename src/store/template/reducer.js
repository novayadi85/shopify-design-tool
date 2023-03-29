import {
	BlockMinor,
	SectionMajor,
	TextAlignmentLeftMajor,
	ProductsMajor,
} from "@shopify/polaris-icons";


const _items = [
    {
        handle: 'offer-top',
        ID: uuid(),
        url: '/#',
        label: 'List top',
        icon: SectionMajor,
        type: 'section',
        items: []
    },
    {
        ID: uuid(),
        handle: 'offer-bottom',
        url: '/#',
        label: 'List Bottom',
        separator: true,
        icon: SectionMajor,
        type: 'section',
    }, 
    {
        ID: 'sa-product-block-offer',
        handle: 'offer-product',
        url: '/#',
        label: 'Products in list',
        icon: ProductsMajor,
        type: 'section',
        /*
        items: [
            {
                ID: 'sa-product-block-offer',
                handle: 'block-product',
                label: 'Products',
                icon: ProductsMajor,
                type: 'block',
                setting: {
                    values : []
                }
            }
        ]
        */
    }
];


const initialState = {
    section: null,
    items: _items,
    loading: false,
    error: null,
    liquid: ''
};


function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
      return v.toString(16);
    });
}

/*
const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
*/
/*
const updateItemToArray = (obj, itemId, payload) => {
    const { block, setting } = payload
    const { headline } = setting;

    for (let item of obj.items) {
        if (block.ID === item.ID) {
            item.setting = setting;
            item.label = headline;
        }

        if (item?.columns) {
            for (let column of item.columns) {
                for (let subItem of column.items) {
                    for (let _item of subItem.items) {
                        if (_item.ID === itemId) {

                        }
                    }
                }
            }
        }
    }

    return obj;
};
*/

const updateItemById = (obj, itemId, payload) => {
    const { block, setting } = payload
    const { headline } = setting;

    for (let item of obj.items) {
        if (item?.columns) {
            for (let column of item.columns) {
                for (let subItem of column.items) {
                    for (let _subItem of subItem.items) {
                        if (_subItem.ID === itemId) {
                            _subItem.setting = setting;
                            _subItem.label = headline;
                            return obj;
                        }
                    }

                    
                }
            }
        }
    }

    return obj;
};

const addItemToArray = (obj, itemId, subItemId, newItemsArray) => {
    for (let item of obj.items) {
        if (item?.columns) {
            for (let column of item.columns) {
                if (column.ID === itemId) {
                    
                    for (let subItem of column.items) {
                        if (subItem.ID === subItemId) {
                            newItemsArray.ID  = newItemsArray?.ID ?? uuid();
                            subItem.items.push(newItemsArray);
                            return obj;
                        }
                    }
                }
            }
        }
    }

    return obj;
};

const templateReducer = (state = initialState, action) => {
    const { type } = action

    switch (type) {
        case 'UPDATE_TEMPLATE':
            return {
                ...state,
                loading: false,
                error: null,
                items: action.payload.items
            };

        case 'ADD_TEMPLATE':
            let items = [
                ...state.items,
                action.payload.items
            ]

            const temp = [];
            items = items.map(({ ...item }) => {
                // item.ID = uuid();
                item.ID = item?.ID ?? uuid()
                if (!temp.includes(item.ID)) {
                    temp.push(item.ID);
                }
                else {
                    //regenerate 
                    item.ID = uuid();
                }

                return item;
            })

            return {
                ...state,
                loading: false,
                error: null,
                items: items
            };
        
        case 'ADD_BLOCK':
            let section = action.payload?.section;
            let handle = action.payload?.handle;
            const newItems = addItemToArray(state, section, handle, action.payload.items);
            /*
            state.items.forEach((item, index) => {
                if (item.ID === section) {
                    if (state.items[index]?.items) {
                        let items = [
                            ...state.items[index].items,
                            action.payload.items
                        ]
            
                        const temp = [];
                        items = items.map(({ ...item }) => {
                            item.ID  = item?.ID ?? uuid();
                            if (!temp.includes(item.ID)) {
                                temp.push(item.ID);
                            }
                            else {
                                //regenerate 
                                item.ID = uuid();
                            }
            
                            return item;
                        })

                        state.items[index]['items'] = items;
                    }
                    else {
                        action.payload.items.ID = uuid();
                        state.items[index]['items'] = [action.payload.items];
                    }
                }
                
            })
            */
            
            return {
                ...state,
                loading: false,
                error: null,
                section: action.payload?.section,
                items: newItems.items
            };
        case 'UPDATE_BLOCK':
            const { block, setting } = action.payload
            //const { headline } = setting;
            const _newItems = updateItemById(state, block.ID, action.payload);

            /*
            state.items = state.items.map(({...item}) => {
                if (block.ID === item.ID) {
                    item.setting = setting;
                    item.label = headline;
                }

                if (item?.items) {
                    item.items = item.items.map(({...t}) => {
                        if (block.ID === t.ID) {
                            t.setting = setting;
                            t.label = headline;
                        }

                        return t;
                    })
                }

                return item;
            });
            */

            return {
                ...state,
                loading: false,
                error: null,
                items: _newItems.items
            };
        

        default:
        return state
    }
}

export default templateReducer