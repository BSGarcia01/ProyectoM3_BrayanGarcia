const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});


app.get("/about", (req, res) => {
  res.send("<h1>About - M3 POC</h1><p>Prueba de concepto del Modulo 3.</p><a href='/'>Volver a Home</a>");
});


app.use("/api", chatRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
