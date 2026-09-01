module.exports = {
  obtenerMensajes: (req, res) => {
    res.json({ mensaje: "obteniendo todos los mensajes", exito: true });
  },

  enviarMensaje: (req, res) => {
    const { texto } = req.body;
    res.json({
      mensaje: `Mensaje recibido: "${texto}"`,
      exito: true,
      fecha: new Date()
    });
  },

  eliminarMensaje: (req, res) => {
    const { texto } = req.body;
    res.json({
      mensaje: `Mensaje eliminado: "${texto}"`,
      exito: true,
      fecha: new Date()
    });
  }

};

