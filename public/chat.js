
import { construirHistorialParaGemini } from './utils.js';

export async function enviarMensajeIA(historial, personaje) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            historial: construirHistorialParaGemini(historial),
            personaje
        })
    });
    return response.json();
}