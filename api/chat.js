
module.exports = function handler(req, res) 
{
  res.status(200).json({ mensaje: "Conexión exitosa desde el servidor" });
};