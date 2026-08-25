#!/usr/bin/env node
// Envia el mail de inscripcion + pago usando la API de Resend.
// No necesita npm install: usa fetch nativo (Node 18+).
//
//   node email/enviar-resend.mjs --preview          -> genera HTML de prueba, no envia
//   node email/enviar-resend.mjs                    -> envia a todos los de inscriptos.json
//   node email/enviar-resend.mjs --solo juan@x.com  -> envia solo a esa direccion
//
// Antes de enviar: setear RESEND_API_KEY y REMITENTE (dominio verificado en Resend).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));

const REMITENTE = process.env.REMITENTE || 'La Prensa de Tales <inscripciones@tudominio.com>';
const RESPONDER_A = process.env.RESPONDER_A || 'fpetrel95@gmail.com';
const API_KEY = process.env.RESEND_API_KEY;

// Cada grupo tiene su dia. En inscriptos.json alcanza con poner
// "grupo": "jovenes" o "adultos": de ahi salen la etiqueta y el horario.
const GRUPOS = {
  jovenes: {
    grupo: 'Jóvenes (13 a 17 años)',
    dias_horario: 'Viernes de 18:00 a 20:00 h',
  },
  adultos: {
    grupo: 'Adultos (todas las edades)',
    dias_horario: 'Miércoles de 18:00 a 20:00 h',
  },
};

// Valores por defecto: cada inscripto puede pisar cualquiera de estos.
const DEFAULTS = {
  precio: '$25.000',
  precio_lista: '$40.000',
  precio_usd: '15',
  link_pago: 'https://mpago.la/1dTAwoG',
  link_whatsapp: 'https://wa.me/543416485693',
  link_baja: 'https://jpviola.github.io/cursos-programacion/',
  link_pago_usd: '',
};

const html = readFileSync(join(DIR, 'inscripcion-pago.html'), 'utf8');
const texto = readFileSync(join(DIR, 'inscripcion-pago.txt'), 'utf8');
const inscriptos = JSON.parse(readFileSync(join(DIR, 'inscriptos.json'), 'utf8'));

const args = process.argv.slice(2);
const preview = args.includes('--preview');
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1] : null;

function render(plantilla, datos) {
  return plantilla.replace(/\{\{(\w+)\}\}/g, (coincidencia, clave) => {
    const valor = datos[clave];
    if (valor === undefined) {
      console.warn(`  ! falta la variable {{${clave}}} para ${datos.email}`);
      return coincidencia;
    }
    return String(valor);
  });
}

async function enviar(datos) {
  const cuerpoHtml = render(html, datos);
  const cuerpoTexto = render(texto, datos);
  const asunto = `${datos.nombre}, confirma tu lugar en ${datos.curso}`;

  if (preview) {
    const salida = join(DIR, 'preview');
    mkdirSync(salida, { recursive: true });
    const archivo = join(salida, `${datos.email.replace(/[^a-z0-9]/gi, '_')}.html`);
    writeFileSync(archivo, cuerpoHtml);
    console.log(`  preview -> ${archivo}`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: REMITENTE,
      to: [datos.email],
      reply_to: RESPONDER_A,
      subject: asunto,
      html: cuerpoHtml,
      text: cuerpoTexto,
      tags: [{ name: 'tipo', value: 'inscripcion_pago' }],
    }),
  });

  const cuerpo = await res.json();
  if (!res.ok) {
    console.error(`  ERROR ${datos.email}: ${cuerpo.message || res.status}`);
    return;
  }
  console.log(`  enviado a ${datos.email} (id ${cuerpo.id})`);
}

if (!preview && !API_KEY) {
  console.error('Falta RESEND_API_KEY. Exportala o usa --preview para probar sin enviar.');
  process.exit(1);
}

const lista = solo ? inscriptos.filter((i) => i.email === solo) : inscriptos;
if (lista.length === 0) {
  console.error('No hay destinatarios que coincidan.');
  process.exit(1);
}

// Expande "grupo": "jovenes" a la etiqueta y el horario que le corresponden.
function expandirGrupo(inscripto) {
  const clave = String(inscripto.grupo || '').toLowerCase();
  const preset = GRUPOS[clave];
  if (!preset) {
    console.warn(`  ! grupo desconocido "${inscripto.grupo}" en ${inscripto.email}: usa "jovenes" o "adultos"`);
    return { ...DEFAULTS, ...inscripto };
  }
  // El JSON puede pisar el horario (ej: una clase reprogramada), pero no la etiqueta.
  return { ...DEFAULTS, ...preset, ...inscripto, grupo: preset.grupo };
}

console.log(`${preview ? 'Generando preview de' : 'Enviando'} ${lista.length} mail(s):`);
for (const inscripto of lista) {
  await enviar(expandirGrupo(inscripto));
}
