import db from "./database.js";

export function getLists() {
  return db
    .prepare(
      `SELECT lists.id, lists.name, COUNT(list_items.id) AS itemCount
    FROM lists
    LEFT JOIN list_items
      ON lists.id = list_items.list_id
    GROUP BY lists.id`,
    )
    .all();
}
export function getListById(id: string) {
  return db.prepare("SELECT * FROM lists WHERE id = ?").get(id);
}

export function createList(name: string) {
  return db.prepare("INSERT INTO lists (name) VALUES (?)").run(name);
}

export function deleteList(id: string) {
  return db.prepare("DELETE FROM lists WHERE id = ?").run(id);
}

export function updateList(id: string, name: string) {
  return db.prepare("UPDATE lists SET name = ? WHERE id = ?").run(name, id);
}

export function getListItems(listId: string) {
  return db.prepare("SELECT * FROM list_items WHERE list_id = ?").all(listId);
}

export function createListItem(listId: string, value: string) {
  return db
    .prepare("INSERT INTO list_items (list_id, value) VALUES (?, ?)")
    .run(listId, value);
}

export function deleteListItem(listId: string, itemId: string) {
  return db
    .prepare("DELETE FROM list_items WHERE list_id = ? AND id = ?")
    .run(listId, itemId);
}

export function updateListItem(listId: string, itemId: string, value: string) {
  return db
    .prepare("UPDATE list_items SET value = ? WHERE list_id = ? AND id = ?")
    .run(value, listId, itemId);
}
