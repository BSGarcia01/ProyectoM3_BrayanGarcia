const express = require('express')
const router = Router()

router.get('/',(req, res)=>{
    res.json({mensaje: 'Lista de mensajes', exito: true})
})

router.post('/', (req,res)=>{
    const {texto} = req.body
    res.json({
        mensaje: 'mensaje recibido: "${texto}"',
        exito: true,
        fecha: new Date()
    })
})

module.exports = router
