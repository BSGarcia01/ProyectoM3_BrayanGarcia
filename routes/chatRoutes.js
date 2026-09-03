const express = require('express')
const router = express.Router()

router.get('/',(req, res)=>{
    res.json({mensaje: 'Lista de mensajes', exito: true})
})

router.post('/', (req,res)=>{
    const {texto} = req.body
    res.json({
        mensaje: `mensaje recibido: "${texto}"`,
        exito: true,
        fecha: new Date()
    })
})





router.post('/ia', (req, res) => {
    const { mensaje } = req.body;

    if (!mensaje) {
        return res.status(400).json({ error: "Se requiere un mensaje", exito: false });
    }

   
    const modelId = "facebook/opt-iml-30b";
    const apiEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;

    fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: mensaje })
    })
    .then(response => response.json())
    .then(data => {
        // Formateamos la respuesta del modelo
        let resultadoIA = "No se generó respuesta";
        if (data.generated_text) resultadoIA = data.generated_text;
        else if (data[0] && data[0].generated_text) resultadoIA = data[0].generated_text;
        
        res.json({ autor: "IA (HuggingFace)", texto: resultadoIA, exito: true });
    })
    .catch(error => {
        console.error("Error al contactar con la IA:", error);
        res.status(500).json({ error: "Error al comunicarse con la IA", exito: false });
    });
});

module.exports = router
