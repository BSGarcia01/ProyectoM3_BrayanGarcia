module.exports = {
  obtenerMensajes: (req, res) => {
    const db = require("../config/database.js");
    const messages = db.prepare("SELECT * FROM messages ORDER BY creado_en DESC").all();
    
    
    res.json({ mensajes: messages, exito: true });
  },

  enviarMensaje: (req, res) => {
    const { texto } = req.body;
    const autor = req.body.autor || "Usuario";

    if (!texto) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío", exito: false });
    }

    const db = require("../config/database.js");
    const stmt = db.prepare("INSERT INTO messages (texto, autor) VALUES (?, ?)");
    stmt.run(texto, autor);

    const mensaje = db.prepare("SELECT * FROM messages WHERE id = last_insert_row()").get();

    res.json({ mensaje, exito: true });
  },

  eliminarMensaje: (req, res) => {
    const { id } = req.body;
    const db = require("../config/database.js");
    db.prepare("DELETE FROM messages WHERE id = ?").run(id);
    res.json({ mensaje: "Mensaje eliminado", exito: true });
  }
};
