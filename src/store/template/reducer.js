import {
	BlockMinor,
	NoteMajor,
	TextAlignmentLeftMajor,
	ProductsMajor,
} from "@shopify/polaris-icons";


const _items = [
    {
        handle: 'offer-top',
        ID: uuid(),
        url: '/#',
        label: 'Offer top',
        icon: NoteMajor,
        type: 'section',
        items: []
    },
    {
        ID: uuid(),
        handle: 'offer-bottom',
        url: '/#',
        label: 'Offer Bottom',
        separator: true,
        icon: NoteMajor,
        type: 'section',
    }, 
    {
        ID: 'sa-product-block-offer',
        handle: 'offer-product',
        url: '/#',
        label: 'Offer Products',
        icon: ProductsMajor,
        type: 'section',
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
    }
];


const initialState = {
    section: null,
    items: _items,
    loading: false,
    error: null
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
            let handle = action.payload?.section;
            state.items.forEach((item, index) => {
                if (item.ID === handle) {
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

            return {
                ...state,
                loading: false,
                error: null,
                section: action.payload?.section,
                items: state.items
            };
        case 'UPDATE_BLOCK':
            const { block, setting } = action.payload
            const { headline } = setting;

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

            return {
                ...state,
                loading: false,
                error: null,
                items: state.items
            };

        default:
        return state
    }
}

export default templateReducer