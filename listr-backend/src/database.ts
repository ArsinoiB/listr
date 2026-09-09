import Database from "better-sqlite3";
import fs from "fs";

// Create a new SQLite database connection
const db = new Database("listr.db");

// Enable foreign key constraints in SQLite
db.pragma("foreign_keys = ON");

// Read the schema.sql file and execute its contents to create the database schema
const schema = fs.readFileSync("database/schema.sql", "utf-8");

// Read the seed.sql file and execute its contents to populate the database with initial data
const seed = fs.readFileSync("database/seed.sql", "utf-8");

// Execute the schema to create tables and other database structures
db.exec(schema);

// Check if the seed has already been applied by looking for a record in the seed_history table
const seedExists = db
  .prepare("SELECT 1 FROM seed_history WHERE name = ?")
  .get("initial_seed");
if (!seedExists) {
  db.exec(seed);
  db.prepare("INSERT INTO seed_history (name) VALUES (?)").run("initial_seed");
}

//Validate the database connection by running a simple query
const lists = db.prepare("SELECT * FROM lists").all();
const listItems = db.prepare("SELECT * FROM list_items").all();
const seedHistory = db.prepare("SELECT * FROM seed_history").all();

console.log(lists);
console.log(listItems);
console.log(seedHistory);

export default db;
