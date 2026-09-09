import express from "express";
import {
  getLists,
  getListById,
  createList,
  deleteList,
  updateList,
  getListItems,
  createListItem,
  deleteListItem,
  updateListItem,
} from "./listRepository.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Hello from Listr backend!");
});

////////////////////  LISTS API ENDPOINTS  ////////////////////
// API endpoint to get all lists from the database
app.get("/lists", (_req, res) => {
  const lists = getLists();
  res.json(lists);
});

// API endpoint to get lists by ID from the database
app.get("/lists/:id", (req, res) => {
  const id = req.params.id;
  const list = getListById(id);
  if (!list) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  res.json(list);
});

// API endpoint to POST a new list to the database
app.post("/lists", (req, res) => {
  const { name } = req.body;
  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Invalid list name" });
    return;
  }
  const cleanName = name.trim();
  const result = createList(cleanName);
  res.status(201).json({ id: result.lastInsertRowid, name: cleanName });
  console.log(
    `Inserted new list with ID: ${result.lastInsertRowid} and name: ${cleanName}`,
  );
});

// API endpoint to DELETE a list by ID from the database
app.delete("/lists/:id", (req, res) => {
  const id = req.params.id;
  const result = deleteList(id);
  if (result.changes === 0) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  res.status(200).json({ message: "List deleted successfully" });
});

//API to update a list by ID in the database
app.patch("/lists/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Invalid list name" });
    return;
  }
  const cleanName = name.trim();
  const result = updateList(id, cleanName);
  if (result.changes === 0) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  res.status(200).json({ message: "List updated successfully" });
  console.log(`Updated list name with ID: ${id} and name: ${cleanName}`);
});

/////////////////////  LIST ITEMS API ENDPOINTS  ////////////////////
// API endpoint to get all list items for a specific list
app.get("/lists/:id/items", (req, res) => {
  const listId = req.params.id;
  const list = getListById(listId);
  if (!list) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  const listItems = getListItems(listId);
  res.json(listItems);
});

// API endpoint to add a new list item to a specific list
app.post("/lists/:id/items", (req, res) => {
  const listId = req.params.id;
  const { value } = req.body;

  const list = getListById(listId);
  if (!list) {
    res.status(404).json({ error: "List not found" });
    return;
  }

  if (typeof value !== "string" || value.trim() === "") {
    res.status(400).json({ error: "Invalid list item value" });
    return;
  }
  const cleanValue = value.trim();
  const result = createListItem(listId, cleanValue);
  res.status(201).json({ id: result.lastInsertRowid, value: cleanValue });
  console.log(
    `Inserted new list item with ID: ${result.lastInsertRowid} and value: ${cleanValue}`,
  );
});

// API endpoint to delete a list item by ID
app.delete("/lists/:listId/items/:itemId", (req, res) => {
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  const result = deleteListItem(listId, itemId);
  if (result.changes === 0) {
    res.status(404).json({ error: "List item not found" });
    return;
  }
  res.status(200).json({ message: "List item deleted successfully" });
});

// API endpoint to update a list item by ID
app.patch("/lists/:listId/items/:itemId", (req, res) => {
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  const { value } = req.body;
  if (typeof value !== "string" || value.trim() === "") {
    res.status(400).json({ error: "Invalid list item value" });
    return;
  }
  const cleanValue = value.trim();
  const result = updateListItem(listId, itemId, cleanValue);
  if (result.changes === 0) {
    res.status(404).json({ error: "List item not found" });
    return;
  }
  res.status(200).json({ message: "List item updated successfully" });
});

//Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
