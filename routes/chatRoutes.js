const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let historial = [];

router.get('/', (req, res) => {
    res.json(historial);
});

router.post('/', async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "Se requiere un mensaje", exito: false });
    }

    historial.push({ mensaje: texto, tipo: 'user' });

    // Lista de modelos ordenados por preferencia
    const modelos = ['gemini-3.6-flash', 'gemini-1.5-flash'];
    let respuestaExitosa = null;

    for (const modelo of modelos) {
        try {
            console.log(`Intentando generar respuesta con: ${modelo}...`);
            const response = await ai.models.generateContent({
                model: modelo,
                contents: texto,
                config: {
                    systemInstruction: "Eres un personaje ficticio carismático respondiendo en un chat en español.",
                    maxOutputTokens: 150,
                    temperature: 0.7
                }
            });

            if (response.text) {
                respuestaExitosa = response.text.trim();
                break; // Si responde bien, sale del ciclo inmediatamente
            }
        } catch (error) {
            console.warn(`[Aviso] El modelo ${modelo} no respondió (${error.message}). Probando siguiente...`);
        }
    }

    if (respuestaExitosa) {
        historial.push({ mensaje: respuestaExitosa, tipo: 'ai' });
        return res.json({ exito: true, historial });
    } else {
        const mensajeError = "⚠️ Alta demanda en los servidores de IA en este momento. Intenta de nuevo en unos segundos.";
        historial.push({ mensaje: mensajeError, tipo: 'ai' });
        return res.status(200).json({ exito: false, historial });
    }
});

module.exports = router;