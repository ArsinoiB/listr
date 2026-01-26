export let listkeycounter:number = 3;
export let itemkeycounter:number = 3;

export interface ListEntry {
    id: number;
    name: string;
}

export interface ListItemEntry {
    id: number;
    value: string;
    listId: number;
}

export interface Database {
    lists: ListEntry[];
    items: ListItemEntry[];
}

export const database: Database = {
    lists: [
        {name: "Groceries", id: 1},
        {name: "Movies", id: 2},
        {name: "Books", id: 3}
    ],
    items: [
        {value: "apples", id: 1, listId: 1},
        {value: "salad", id: 2, listId: 1},
        {value: "Back to the Future", id: 3, listId: 2}
    ]
}

export const setCounters = (countlist: number, countitem: number) => {
    listkeycounter = countlist;
    itemkeycounter = countitem;
}


export const createList = (name: string) => {
    const newList: ListEntry = {name: name, id: ++listkeycounter};
    database.lists.push(newList);
    return newList;
}

export const deleteList = (id: number) => {
    const index:number = database.lists.findIndex(entry => entry.id === id );
    if (index !== -1){
        const deletedList = database.lists[index];
        database.lists.splice(index,1);
        return deletedList
    }
    return null;
}

export const updateListById = (id: number, newName: string) => {
    const index:number = database.lists.findIndex(entry => entry.id === id );
    if (index !== -1) {
        database.lists[index].name = newName;
        return database.lists[index];
    }
    return null;
}

export const createListItem = (value:string, listId:number) => {
    const newListItem: ListItemEntry = {value: value, id: ++itemkeycounter, listId: listId}
    database.items.push(newListItem)
    return newListItem;
}

export const deleteListItem = (id: number) => {
    const index:number = database.items.findIndex(entry => entry.id === id );
    if (index !== -1){
        const deletedItem = database.items[index]
        database.items.splice(index,1);
        return deletedItem;
    }
    return null;
}

export const updateItemById = (id: number, newValue: string) => {
    const index:number = database.items.findIndex(entry => entry.id === id );
    if (index !== -1) {
        database.items[index].value = newValue;
        return database.items[index];
    } 
    return null;
}

