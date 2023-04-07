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

export const deleteById = (items, itemId) => {
  for (let item of items) {
    if (item?.columns) {
      for (let column of item.columns) {
        for (let subItem of column.items) {
          for (let _subItem of subItem.items) {
            if (_subItem.ID === itemId) {
              // Remove the item from the array
              subItem.items = subItem.items.filter(item => item.ID !== itemId);
              // console.log('found', subItem.items)
              return items; // Return the updated items array after deletion
            }
          }
        }
      }
    }
  }

  return items; // Return the original items array if the item with the given ID was not found
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

export const findTopParentByID = (id, arr) => {
    for (const item of arr) {
        if (item.ID === id) {
            return item;
        } else if (item.columns) {
            const columnMatch = item.columns.flatMap(column => column.items).find(item => item.ID === id);
            if (columnMatch) {
                return item;
            }
        } else if (item.items.length > 0) {
            const itemMatch = findTopParentByID(id, item.items);
            if (itemMatch) {
                return item;
            }
        }
    }
}

export const findTopParent = (arr, id) => {
    let result = null;
  
    arr.forEach((item) => {
      if (item.ID === id) {
        result = item;
      } else if (item.columns) {
        item.columns.forEach((column) => {
          column.items.forEach((columnItem) => {
            if (columnItem.ID === id) {
              result = item;
            } else if (columnItem.items) {
              columnItem.items.forEach((nestedItem) => {
                if (nestedItem.ID === id) {
                  result = item;
                }
              });
            }
          });
        });
      } else if (item.items) {
        item.items.forEach((nestedItem) => {
          if (nestedItem.ID === id) {
            result = item;
          }
        });
      }
    });
  
    return result;
}