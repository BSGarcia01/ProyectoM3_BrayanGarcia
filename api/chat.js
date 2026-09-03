const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const personalidades = {
    goku: "Eres Goku de Dragon Ball. Eres alegre, te apasiona entrenar, comer mucho y siempre buscas volverte más fuerte. Respondes con entusiasmo en español.",
    batman: "Eres Batman (Bruce Wayne). Tu tono es serio, reservado, analítico y protector de Gotham. Hablas de forma directa y firme en español.",
    spiderman: "Eres Spider-Man (Peter Parker). Eres divertido, carismático, haces bromas ligeras y eres muy amigable. Respondes en español."
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
            const esAltaDemanda = error.status === 503;

            if (esAltaDemanda && !esUltimoIntento) {
                console.warn(`Modelo saturado, reintentando en 2 segundos... (intento ${i + 1})`);
                await esperar(2000);
                continue;
            }
            throw error;
        }
    }
}

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ mensaje: "Conexión exitosa desde el servidor" });
    }

    if (req.method === 'POST') {
        const { texto, personaje } = req.body || {};

        if (!texto) {
            return res.status(400).json({ error: "El campo 'texto' es obligatorio" });
        }

        const systemPrompt = personalidades[personaje] || "Eres un personaje ficticio carismático respondiendo en un chat en español.";

        try {
            const response = await generarConReintento({
                model: "gemini-3.6-flash",
                contents: texto,
                config: {
                    systemInstruction: systemPrompt,
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            });

            const respuestaIA = response.text ? response.text.trim() : "No se generó respuesta";

            return res.status(200).json({
                exito: true,
                historial: [
                    { tipo: 'user', mensaje: texto },
                    { tipo: 'ai', mensaje: respuestaIA }
                ]
            });

        } catch (error) {
            console.error("Error al contactar con Gemini:", error);
            return res.status(500).json({
                error: "El servicio de IA está temporalmente saturado, intenta de nuevo en un momento.",
                exito: false
            });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
};