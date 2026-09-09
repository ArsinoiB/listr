import { database, setCounters } from "./database";


const initialListkeycounter: number = 3;
const initialItemkeycounter: number = 3;


export const resetDatabase = () =>{
    database.lists = [];
    database.items = [];
    database.lists.push(
        { id: 1, name: "Groceries" },
        { id: 2, name: "Movies" },
        { id: 3, name: "Books" }
      );
      database.items.push(
        { id: 1, value: "apples", listId: 1 },
        { id: 2, value: "salad", listId: 1 },
        { id: 3, value: "Back to the Future", listId: 2 }
      );
    setCounters(initialListkeycounter, initialItemkeycounter);
}