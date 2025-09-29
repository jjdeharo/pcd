# Exámenes digitales para profes (Google Sheets + Web)

Este proyecto permite pasar exámenes tipo test a tu alumnado desde una página web sencilla y guardar automáticamente las respuestas en tu Hoja de Cálculo de Google. Incluye:

- Enlace de alumnado para responder (web app).
- Panel del profesorado para configurar el examen, cargar la clave y corregir.
- Informes de corrección en la pestaña "Correcció" de la hoja.

No necesitas programar. Solo harás una copia de la hoja y publicarás la web desde el editor de Apps Script.

## Lo que necesitas

- Cuenta de Google (acceso a Google Drive y Apps Script).
- Una plantilla de Hoja de Cálculo de este proyecto (te la facilitarán o compártela desde el centro). Las pestañas usadas son: `Config`, `Keys`, `Settings`, `Submissions` y `Correcció`.

## Pasos rápidos (10–15 minutos)

1) Haz tu copia de la Hoja de Cálculo
- Abre la plantilla y pulsa Archivo → Hacer una copia. Ponle un nombre (por ejemplo, "Examen 1ºB – Tema 2").

2) Abre el editor de Apps Script
- En la copia, ve a Extensiones → Apps Script. Se abrirá el editor con el proyecto asociado. No tienes que tocar el código.

3) Publica la web (despliegue)
- En el editor, pulsa Implementar → Administrar implementaciones → Nueva implementación.
- Tipo: "Aplicación web".
- Descripción: por ejemplo, "Examen Tema 2".
- Quién tiene acceso: elige "Cualquiera con el enlace" (o solo tu dominio del centro si lo preferís).
- Pulsa Implementar y acepta los permisos. Copia la URL que aparece; es el ENLACE DEL ALUMNADO.

4) Entra en el panel del profesorado y cambia el código
- Abre la URL y añade `?view=admin` al final. Ejemplo: `https://.../exec?view=admin`.
- La primera vez, el código de profesor es `CANVIA_AIXO` (cámbialo por uno propio y guárdalo). Guárdalo en lugar seguro; lo necesitarás para entrar al panel.

5) Crea y configura el examen
- En el panel del profesorado pulsa "Crear examen" o elige uno existente.
- Define: nombre, número de preguntas, cuántas opciones (A–D, A–E, etc.), horario (apertura/cierre) o apertura manual.
- Guarda la configuración.

6) Carga la clave de respuestas
- En el panel, usa "Cargar clave" (pega la secuencia de letras, por ejemplo: `ABDCB...`) o el método que el panel indica. La clave se guarda en la pestaña `Keys`.

7) Comparte el enlace con el alumnado
- Comparte la URL sin parámetros (la misma que copiaste en el paso 3). Puedes ponerla en Classroom, Moodle o por QR.
- Si programas horario, el examen se abre y cierra automáticamente. También puedes abrir/cerrar manualmente desde el panel.

8) Corrige y revisa resultados
- En el panel, lanza la corrección cuando quieras. Verás el resumen y el listado de envíos.
- Los resultados detallados se escriben en la pestaña `Correcció` de tu hoja (aciertos, errores, en blanco y nota).

## Consejos de uso

- Mantén el mismo despliegue: si cambias algo en la configuración desde el panel, no hace falta volver a publicar la web; la URL no cambia.
- Si el alumnado no puede acceder, revisa en el editor: Implementar → Administrar implementaciones → tu despliegue → "Quién tiene acceso".
- Guarda tu código de profesor en lugar seguro. Si lo olvidas, alguien con acceso de edición a la Hoja puede poner uno nuevo desde el panel.

## Para el siguiente examen

- Puedes crear un examen nuevo desde el panel (recomendado) y conservar la misma URL.
- Si prefieres separar por grupos, duplica la Hoja de Cálculo (Archivo → Hacer una copia) y repite los pasos de publicación. Obtendrás una URL distinta para cada copia.

## Referencia rápida de pestañas (en tu hoja)

- `Config`: datos del examen (nombre, número de preguntas, horario, barajado, etc.).
- `Keys`: clave oficial de respuestas por examen.
- `Submissions`: envíos brutos del alumnado.
- `Correcció`: resultados calculados (aciertos/errores/nota).
- `Settings`: ajustes internos (incluye el código del profesor).

## Preguntas frecuentes

— ¿La URL cambia si vuelvo a publicar?
No: si editas la implementación existente (Administrar implementaciones → editar), la URL se mantiene. Crear una implementación nueva sí cambia la URL.

— ¿Puedo restringir el acceso al dominio del centro?
Sí: al publicar, elige "Usuarios de tu dominio" en "Quién tiene acceso". Todos deberán iniciar sesión con la cuenta del centro.

— ¿Cómo cambio el código de profesor?
Entra en `...?view=admin`, abre Ajustes del panel y establece uno nuevo. Se guarda en `Settings`.

---

Si necesitas ayuda, comparte la URL del panel (sin tu código) y una captura de la pestaña `Config` para que podamos orientarte.

