import { describe, test, expect, assert} from "vitest";
import { database, ListEntry, ListItemEntry, createList, createListItem, deleteList, updateListById, deleteListItem } from "./database";
import { resetDatabase } from "./resetdatabase";


describe("Test database", ()=>{

    test ("createList successfully creates a list", () => {
        resetDatabase();
        const expected: ListEntry = {
            name: "Games",
            id: 4
        }
        const res:ListEntry = createList("Games");
        assert(database.lists.length === 4);
        expect(res).toStrictEqual(expected);
        expect(database.lists).toContainEqual({ name: "Games", id: 4 });
    })

    test ("deleteList successfully deletes a list", () =>{
        resetDatabase();
        const expected : ListEntry = {
            name: "Groceries",
            id: 1
        }
        const res:ListEntry = deleteList(1);
        assert(database.lists.length === 2); //because we added 1 entry in the test above, the length will be 3
        expect(res).toStrictEqual(expected);
        expect(database.lists).not.toContainEqual(expected);
    })

    test ("updateListById successfully updates the name of an existing list", () => {
        resetDatabase()
        const expected : ListEntry = {
            name: "Series",
            id: 2
        }
        const res:ListEntry = updateListById(2, "Series");
        expect(res).toStrictEqual(expected);
    })

    test ("createListItem successfully creates one item", () => {
        resetDatabase()
        const listID = 1
        const expected: ListItemEntry = {
            id: 4,
            value: "foo",
            listId: listID
        }
        const res:ListItemEntry = createListItem("foo", listID);
        assert(database.items.length === 4);
        expect(res).toStrictEqual(expected); 
        expect(database.items).toContainEqual({ id:4, value: "foo", listId: 1 });
    })

    test("deleteListItem successfully deletes one item", () => {
        resetDatabase()
        const expected : ListItemEntry = {
            id: 1,
            value: "apples",
            listId: 1
        }
        const res: ListItemEntry = deleteListItem(1);
        assert(database.items.length === 2);
        expect(res).toStrictEqual(expected);
        expect(database.items).not.toContainEqual(expected);
    });

    test("updateListItemById successfully updates the value of an existing item", () => {
        
    });
})