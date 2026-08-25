# Mail de inscripción + pago

Template del correo que se manda a quien se inscribe, con botón de pago de Mercado Pago.

| Archivo | Para qué |
|---|---|
| `inscripcion-pago.html` | El mail (tablas + CSS inline, compatible con Gmail / Outlook / Apple Mail) |
| `inscripcion-pago.txt` | Versión texto plano (mejora la entregabilidad, evita spam) |
| `enviar-resend.mjs` | Script de envío con Resend, sin dependencias (Node 18+) |
| `inscriptos.ejemplo.json` | Formato de los datos de cada destinatario |

## Variables

Se reemplazan con `{{nombre_de_variable}}`:

| Variable | Ejemplo |
|---|---|
| `nombre` | `Sofía` |
| `curso` | `Nivel 1 · Introducción a la IA y programación web` |
| `grupo` | `jovenes` o `adultos` (de ahí salen la etiqueta y el día de cursada) |
| `dias_horario` | sale solo del `grupo`: jóvenes viernes, adultos miércoles, ambos de 18:00 a 20:00 h |
| `fecha_inicio` / `fecha_fin` | `5/9` / `10/10` |
| `precio` / `precio_lista` | `$25.000` / `$40.000` (dejá `precio_lista` vacío si no hay descuento) |
| `precio_usd` | `15` |
| `link_pago` | link de Mercado Pago en pesos |
| `link_pago_usd` | link de Mercado Pago en dólares (opcional) |
| `link_whatsapp` | `https://wa.me/543416485693` |
| `link_baja` | link de baja de la lista |

`enviar-resend.mjs` ya trae valores por defecto para precio, link de pago, WhatsApp y baja, y deduce el horario del `grupo`; en el JSON solo van los que cambian por persona.

Si alguna clase se reprograma, podés pisar el horario de una persona agregando `dias_horario` en su entrada del JSON.

## Cómo sacar el link de pago (Mercado Pago)

1. Entrá a [mercadopago.com.ar/herramientas/link-de-pago](https://www.mercadopago.com.ar/herramientas/link-de-pago).
2. Creá un link por curso y nivel de precio (ej: "Nivel 1 Jóvenes – $25.000" y "Nivel 1 Jóvenes – $40.000").
3. Copiá la URL corta (`https://mpago.la/...`) y pegala en `link_pago`.

Conviene un link por curso/precio en vez de uno genérico: así el comprobante ya dice a qué curso corresponde y no hay que cruzar pagos a mano.

Para el exterior hay que tener una cuenta que cobre en USD; si todavía no la tenés, borrá el bloque "¿Pagás desde el exterior?" del HTML y del TXT.

## Envío con Resend

```bash
# 1. Preparar destinatarios
cp email/inscriptos.ejemplo.json email/inscriptos.json   # (está en .gitignore)

# 2. Ver cómo queda, sin enviar nada
node email/enviar-resend.mjs --preview
# abre email/preview/*.html en el navegador

# 3. Enviar de verdad
export RESEND_API_KEY=re_xxxxxxxx
export REMITENTE="La Prensa de Tales <inscripciones@tudominio.com>"
node email/enviar-resend.mjs --solo alumno@ejemplo.com   # prueba con uno
node email/enviar-resend.mjs                             # todos
```

En PowerShell las variables se setean con `$env:RESEND_API_KEY = "re_xxxx"`.

### Requisitos de Resend

- Cuenta gratis: 3.000 mails/mes, 100 por día — de sobra para esto.
- **Hay que verificar un dominio propio** (SPF + DKIM en el DNS). No se puede mandar desde `@gmail.com`; para probar sirve `onboarding@resend.dev`, pero solo llega a tu propia casilla.

## Usarlo sin Resend

El HTML es autónomo. Si preferís mandar de a uno desde Gmail: abrí `inscripcion-pago.html` en el navegador, reemplazá las variables a mano, copiá todo (Ctrl+A / Ctrl+C) y pegalo en el cuerpo del mail. También se puede pegar como plantilla en Gmail (Configuración → Avanzada → Plantillas).
