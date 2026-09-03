const Database = require("better-sqlite3");


const db = new Database("chat_m3.db");


db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    autor TEXT NOT NULL DEFAULT 'Usuario',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


module.exports = db;
