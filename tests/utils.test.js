
import { describe, test, expect } from 'vitest';
import { formatearHora, validarMensaje, construirHistorialParaGemini, parseRespuestaGemini } from '../public/utils.js';

describe('validarMensaje', () => {
    test('rechaza mensaje vacío', () => {
        expect(validarMensaje('')).toContain('vacío');
    });

    test('acepta mensaje válido', () => {
        expect(validarMensaje('Hola Goku')).toBe(null);
    });
});

describe('construirHistorialParaGemini', () => {
    test('transforma tipo user y ai a roles correctos', () => {
        const historial = [
            { tipo: 'user', mensaje: 'Hola' },
            { tipo: 'ai', mensaje: 'Hola, soy Goku' }
        ];
        const resultado = construirHistorialParaGemini(historial);
        expect(resultado[0].role).toBe('user');
        expect(resultado[1].role).toBe('model');
        expect(resultado[0].parts[0].text).toBe('Hola');
    });
});

describe('parseRespuestaGemini', () => {
    test('extrae el último mensaje del historial de respuesta', () => {
        const data = { historial: [{ tipo: 'ai', mensaje: 'Kamehameha!' }] };
        expect(parseRespuestaGemini(data)).toBe('Kamehameha!');
    });
});