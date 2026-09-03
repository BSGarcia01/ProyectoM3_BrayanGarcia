const express = require('express')
const router = express.Router()

const hfToken = process.env.HF_TOKEN;

let historial = [];

router.get('/', (req, res) => {
    res.json(historial)
})

router.post('/', async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "Se requiere un mensaje", exito: false });
    }

    historial.push({ mensaje: texto, tipo: 'user' });

    try {
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${hfToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-7B-Instruct",
                messages: [
                    { role: "system", content: "Eres un personaje ficticio carismático respondiendo en un chat." },
                    { role: "user", content: texto }
                ]
            })
        });

        const data = await response.json();

        let respuestaIA = "No se generó respuesta";
        if (data.choices && data.choices[0] && data.choices[0].message) {
            respuestaIA = data.choices[0].message.content;
        }

        historial.push({ mensaje: respuestaIA, tipo: 'ai' });

        res.json({ exito: true, historial });

    } catch (error) {
        console.error("Error al contactar con la IA:", error);
        historial.push({ mensaje: "Lo siento, no pude responder en este momento.", tipo: 'ai' });
        res.status(500).json({ error: "Error al comunicarse con la IA", exito: false });
    }
})

module.exports = router