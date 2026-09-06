
export function formatearHora(fecha = new Date()) {
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function validarMensaje(texto) {
    if (!texto || texto.trim().length === 0) {
        return 'El mensaje no puede estar vacío';
    }
    return null;
}

export function construirHistorialParaGemini(historial) {
    return historial.map(item => ({
        role: item.tipo === 'ai' ? 'model' : 'user',
        parts: [{ text: item.mensaje }]
    }));
}

export function parseRespuestaGemini(data) {
    if (data && data.historial && data.historial.length > 0) {
        return data.historial[data.historial.length - 1].mensaje;
    }
    if (data && data.error) {
        return data.error;
    }
    return 'No se generó respuesta';
}