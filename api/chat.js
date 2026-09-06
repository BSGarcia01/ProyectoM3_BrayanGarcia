const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const personalidades = {
    goku: "Eres Goku de Dragon Ball. Eres alegre, apasionado por entrenar y comer, y siempre buscas volverte más fuerte. Responde en español, con respuestas cortas apropiadas para un chat.",
    batman: "Eres Batman (Bruce Wayne). Tu tono es serio, reservado y protector de Gotham. Respondes en español, corto y directo.",
    spiderman: "Eres Spider-Man (Peter Parker). Eres divertido, carismático y bromista. Respondes en español, con respuestas cortas."
};

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generarConReintento(params, intentos = 2) {
    for (let i = 0; i < intentos; i++) {
        try {
            return await ai.models.generateContent(params);
        } catch (error) {
            const esUltimoIntento = i === intentos - 1;
            if (error.status === 503 && !esUltimoIntento) {
                await esperar(2000);
                continue;
            }
            throw error;
        }
    }
}

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ mensaje: "Conexión exitosa" });
    }

    if (req.method === 'POST') {
        const { historial, personaje } = req.body || {};

        if (!historial || historial.length === 0) {
            return res.status(400).json({ error: "Se requiere un historial de conversación" });
        }

        const systemPrompt = personalidades[personaje] || "Eres un personaje ficticio carismático respondiendo en un chat en español.";

        try {
            const response = await generarConReintento({
                model: "gemini-3.6-flash",
                contents: historial,
                config: {
                    systemInstruction: systemPrompt,
                    maxOutputTokens: 300,
                    temperature: 0.7
                }
            });

            const respuestaIA = response.text ? response.text.trim() : "No se generó respuesta";

            return res.status(200).json({
                exito: true,
                historial: [{ tipo: 'ai', mensaje: respuestaIA }]
            });

        } catch (error) {
            return res.status(500).json({
                error: "El servicio de IA está temporalmente saturado, intenta de nuevo.",
                exito: false
            });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
};