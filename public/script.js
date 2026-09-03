

const PERSONAJES_INFO = {
    goku: { nombre: "Goku", emoji: "💥" },
    batman: { nombre: "Batman", emoji: "🦇" },
    spiderman: { nombre: "Spider-Man", emoji: "🕷️" }
};

function navegarA(vistaId) {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('chat-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';

    document.getElementById('btn-nav-home').classList.remove('active');
    document.getElementById('btn-nav-chat').classList.remove('active');
    document.getElementById('btn-nav-about').classList.remove('active');

    if (vistaId === 'home') {
        document.getElementById('home-view').style.display = 'block';
        document.getElementById('btn-nav-home').classList.add('active');
    } else if (vistaId === 'chat') {
        const personajeActual = localStorage.getItem('personajeSeleccionado') || 'goku';
        actualizarInterfazPersonaje(personajeActual);
        document.getElementById('chat-view').style.display = 'block';
        document.getElementById('btn-nav-chat').classList.add('active');
    } else if (vistaId === 'about') {
        document.getElementById('about-view').style.display = 'block';
        document.getElementById('btn-nav-about').classList.add('active');
    }
}

function seleccionarPersonaje(idPersonaje) {
    localStorage.setItem('personajeSeleccionado', idPersonaje);
    
    
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '<div class="system-badge">Iniciando chat con ' + PERSONAJES_INFO[idPersonaje].nombre + '</div>';
    
    navegarA('chat');
}

function actualizarInterfazPersonaje(idPersonaje) {
    const info = PERSONAJES_INFO[idPersonaje] || PERSONAJES_INFO.goku;
    document.getElementById('nombre-personaje').innerText = info.nombre;
    document.getElementById('chat-avatar').innerText = info.emoji;
}

function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function enviarMensaje() {
    const inputTexto = document.getElementById('mensaje-input');
    const chatBox = document.getElementById('chat-box');
    const texto = inputTexto ? inputTexto.value.trim() : '';

    if (!texto) return;

    const personajeActual = localStorage.getItem('personajeSeleccionado') || 'goku';

   
    const userBubble = document.createElement('div');
    userBubble.className = 'bubble user';
    userBubble.innerHTML = `${texto} <span class="time-stamp">${obtenerHoraActual()}</span>`;
    chatBox.appendChild(userBubble);
    
    inputTexto.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    
    const typingBadge = document.createElement('div');
    typingBadge.className = 'bubble ia';
    typingBadge.id = 'typing-indicator';
    typingBadge.innerText = 'Escribiendo...';
    chatBox.appendChild(typingBadge);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                texto: texto, 
                personaje: personajeActual 
            })
        });

        const data = await response.json();
        
        // Quitar indicador de escribiendo
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        if (data.historial && data.historial.length > 0) {
            const ultimoMensaje = data.historial[data.historial.length - 1];
            const aiBubble = document.createElement('div');
            aiBubble.className = 'bubble ia';
            aiBubble.innerHTML = `${ultimoMensaje.mensaje} <span class="time-stamp">${obtenerHoraActual()}</span>`;
            chatBox.appendChild(aiBubble);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

    } catch (error) {
        console.error("Error enviando mensaje:", error);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navegarA('home');
});