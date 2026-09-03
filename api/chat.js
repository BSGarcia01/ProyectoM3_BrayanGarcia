module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ mensaje: "Conexión exitosa desde el servidor" });
  }

  if (req.method === 'POST') {
    const { texto } = req.body || {};

    if (!texto) {
      return res.status(400).json({ error: "El campo 'texto' es obligatorio" });
    }

    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "meta-llama/Llama-3.2-1B-Instruct",
            messages: [
              {
                role: "system",
                content: "Eres un asistente útil y respondes en español."
              },
              {
                role: "user",
                content: texto
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          }),
        }
      );

      const result = await response.json();

      let respuestaIA = "⚠️ Error de modelo IA - no disponible momentáneamente";

      if (result.choices && result.choices[0]?.message?.content) {
        respuestaIA = result.choices[0].message.content.trim();
      } else if (result.error) {
        console.error("Data completa de error:", result.error);
      }

      return res.status(200).json({
        respuesta: respuestaIA,
        historial: [
          { tipo: 'user', mensaje: texto },
          { tipo: 'ai', mensaje: respuestaIA }
        ]
      });

    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ error: "Error interno al conectar con la IA" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
};