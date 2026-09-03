const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let historial = [];


const personalidades = {
    goku: "Eres Goku de Dragon Ball. Eres alegre, te apasiona entrenar, comer mucho y siempre buscas volverte más fuerte. Respondes con entusiasmo en español.",
    batman: "Eres Batman (Bruce Wayne). Tu tono es serio, reservado, analítico y protector de Gotham. Hablas de forma directa y firme en español.",
    spiderman: "Eres Spider-Man (Peter Parker). Eres divertido, carismático, haces bromas ligeras y eres muy amigable. Respondes en español."
};

router.get('/', (req, res) => {
    res.json(historial);
});

router.post('/', async (req, res) => {
    const { texto, personaje } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "Se requiere un mensaje", exito: false });
    }

    historial.push({ mensaje: texto, tipo: 'user' });

    
    const systemPrompt = personalidades[personaje] || "Eres un personaje ficticio carismático respondiendo en un chat en español.";

    const modelos = ['gemini-3.6-flash', 'gemini-1.5-flash'];
    let respuestaExitosa = null;

    for (const modelo of modelos) {
        try {
            const response = await ai.models.generateContent({
                model: modelo,
                contents: texto,
                config: {
                    systemInstruction: systemPrompt,
                    maxOutputTokens: 150,
                    temperature: 0.7
                }
            });

            if (response.text) {
                respuestaExitosa = response.text.trim();
                break;
            }
        } catch (error) {
            console.warn(`[Aviso] Modelo ${modelo} no disponible. Probando siguiente...`);
        }
    }

    if (respuestaExitosa) {
        historial.push({ mensaje: respuestaExitosa, tipo: 'ai' });
        return res.json({ exito: true, historial });
    } else {
        const mensajeError = "⚠️ Alta demanda en el servidor. Intenta de nuevo en unos segundos.";
        historial.push({ mensaje: mensajeError, tipo: 'ai' });
        return res.status(200).json({ exito: false, historial });
    }
});

module.exports = router;