module.exports = {
  obtenerMensajes: (req, res) => {
  
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

 
  llamarIA: (mensaje) => {
    
    return "Procesando IA..."; 
  }
};
