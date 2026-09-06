import { formatearHora, validarMensaje, parseRespuestaGemini } from './utils.js';
import { enviarMensajeIA } from './chat.js';

const PERSONAJES_INFO = {
    goku: { nombre: "Goku", emoji: "💥" },
    batman: { nombre: "Batman", emoji: "🦇" },
    spiderman: { nombre: "Spider-Man", emoji: "🕷️" }
};

let historial = [];

function renderRuta(ruta) {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('chat-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (ruta === '/chat') {
        const personajeActual = localStorage.getItem('personajeSeleccionado') || 'goku';
        actualizarInterfazPersonaje(personajeActual);
        document.getElementById('chat-view').style.display = 'block';
        document.getElementById('btn-nav-chat').classList.add('active');
    } else if (ruta === '/about') {
        document.getElementById('about-view').style.display = 'block';
        document.getElementById('btn-nav-about').classList.add('active');
    } else {
        document.getElementById('home-view').style.display = 'block';
        document.getElementById('btn-nav-home').classList.add('active');
    }
}

function navegarA(ruta) {
    history.pushState({}, '', ruta);
    renderRuta(ruta);
}

window.addEventListener('popstate', () => {
    renderRuta(window.location.pathname);
});

function seleccionarPersonaje(idPersonaje) {
    localStorage.setItem('personajeSeleccionado', idPersonaje);
    historial = [];
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = `<div class="system-badge">Iniciando chat con ${PERSONAJES_INFO[idPersonaje].nombre}</div>`;
    navegarA('/chat');
}

function actualizarInterfazPersonaje(idPersonaje) {
    const info = PERSONAJES_INFO[idPersonaje] || PERSONAJES_INFO.goku;
    document.getElementById('nombre-personaje').innerText = info.nombre;
    document.getElementById('chat-avatar').innerText = info.emoji;
}

function agregarBurbuja(chatBox, clase, texto) {
    const div = document.createElement('div');
    div.className = `bubble ${clase}`;
    div.innerHTML = `${texto} <span class="time-stamp">${formatearHora()}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function enviarMensaje() {
    const inputTexto = document.getElementById('mensaje-input');
    const chatBox = document.getElementById('chat-box');
    const texto = inputTexto.value.trim();

    const errorValidacion = validarMensaje(texto);
    if (errorValidacion) return;

    const personajeActual = localStorage.getItem('personajeSeleccionado') || 'goku';

    historial.push({ tipo: 'user', mensaje: texto });
    agregarBurbuja(chatBox, 'user', texto);
    inputTexto.value = '';

    const typingBadge = document.createElement('div');
    typingBadge.className = 'bubble ia';
    typingBadge.id = 'typing-indicator';
    typingBadge.innerText = 'Escribiendo...';
    chatBox.appendChild(typingBadge);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const data = await enviarMensajeIA(historial, personajeActual);
        document.getElementById('typing-indicator')?.remove();

        const respuestaTexto = parseRespuestaGemini(data);
        historial.push({ tipo: 'ai', mensaje: respuestaTexto });
        agregarBurbuja(chatBox, 'ia', respuestaTexto);

    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        agregarBurbuja(chatBox, 'ia', '⚠️ No se pudo conectar con el servidor. Intenta de nuevo.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-nav-home').addEventListener('click', () => navegarA('/home'));
    document.getElementById('btn-nav-chat').addEventListener('click', () => navegarA('/chat'));
    document.getElementById('btn-nav-about').addEventListener('click', () => navegarA('/about'));

    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => seleccionarPersonaje(card.dataset.personaje));
    });

    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        enviarMensaje();
    });

    renderRuta(window.location.pathname === '/' ? '/home' : window.location.pathname);
});