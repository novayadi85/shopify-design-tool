export const getBlockbyId = (items, itemId) => {
    for (let item of items) {
        if (item?.columns) {
            for (let column of item.columns) {
                for (let subItem of column.items) {
                    for (let _subItem of subItem.items) {
                        if (_subItem.ID === itemId) {
                            return _subItem
                        }
                    }

                    
                }
            }
        }
    }

    return null;
}


export const findItemById = (items, id) => {
    for (const item of items) {
        if (item.ID === id) {
            return item;
        } else if (item?.columns) {
            const nestedItem = findItemById(item.columns, id);
            if (nestedItem) {
                return nestedItem;
            }
        }
        else if (item.items) {
            const nestedItem = findItemById(item.items, id);
            if (nestedItem) {
                return nestedItem;
            }
        }
    }

    return null;
};