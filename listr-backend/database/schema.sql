CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS seed_history (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS list_items (  
       id INTEGER PRIMARY KEY,    
       value TEXT NOT NULL,
       list_id INTEGER NOT NULL,
       FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
       );

