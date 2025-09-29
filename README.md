# PLACODI: Plantilla correctora digital (Google Sheets + Web)

Este proyecto permite pasar exámenes tipo test a tu alumnado desde una página web sencilla y guardar automáticamente las respuestas en tu Hoja de Cálculo de Google. Incluye:

- Enlace de alumnado para responder (web app).
- Panel del profesorado para configurar el examen, cargar la clave y corregir.
- Informes de corrección en la pestaña "Correcció" de la hoja.

**Importante:** esta aplicación está pensada como **plantilla correctora**.  
El examen se entrega en **papel** al alumnado y en la web únicamente introducen sus respuestas.  
De este modo, se evita que el examen quede visible en la aplicación y se garantiza mayor seguridad.

No necesitas programar. Solo harás una copia de la hoja y publicarás la web desde el editor de Apps Script.

## Lo que necesitas

- Cuenta de Google (acceso a Google Drive y Apps Script).  
- Una plantilla de Hoja de Cálculo de este proyecto (te la facilitarán o compártela desde el centro).  
  Las pestañas usadas son: `Config`, `Keys`, `Settings`, `Submissions` y `Correcció`.  

## Pasos rápidos

### Preparación de la aplicación PLACODI
Este proceso solo hay que hacerlo una vez

1. Haz tu copia de la Hoja de Cálculo: [https://docs.google.com/spreadsheets/d/129xDHV5AcSL8GMu2kmGS2f4Gvs6m0BHn1tkQT-JNfEA/copy](https://docs.google.com/spreadsheets/d/129xDHV5AcSL8GMu2kmGS2f4Gvs6m0BHn1tkQT-JNfEA/copy)  
   Abre la plantilla y pulsa Archivo → Hacer una copia. Ponle un nombre.

2. Abre el editor de Apps Script  
   En tu copia, ve a Extensiones → Apps Script. Se abrirá el editor con el proyecto asociado. No tienes que tocar el código.

3. Publica la web (despliegue)  
   - En el editor, pulsa **Implementar → Nueva implementación**.  
   - Tipo: "Aplicación web".  
   - Descripción: por ejemplo, "Examenes".  
   - Ejecutar como: Yo (tucorreo@gmail.com)  
   - Quién tiene acceso: elige "Cualquiera con el enlace".  
   - Pulsa Implementar y acepta los permisos. **Copia la URL que aparece**; es el PANEL DEL PROFESORADO.

4. Entra en el panel del profesorado usando la contraseña (código): 0000 y cámbiala desde la pestaña **Ajustes**.

### Creación y configuración de pruebas

**Recuerda:** el examen en papel lo prepara el profesorado.  
El alumnado solo verá un formulario para introducir sus respuestas.

1. Crea y configura el examen  
   - En el panel del profesorado pulsa "Crear examen" o elige uno existente.  
   - Define: nombre, número de preguntas, cuántas opciones (ABC, ABCDE, etc.), horario (apertura/cierre) o déjalo en blanco para apertura manual.  
   - Guarda la configuración.

2. Carga la clave de respuestas  
   - En el panel, usa "Cargar clave" (pega la secuencia de letras, por ejemplo: `ABDCB...`) o el método que el panel indica.  
   - La clave se guarda en la pestaña `Keys`.

3. Comparte el enlace con el alumnado  
   - Comparte la URL que te da el programa para el alumnado.  
   - Puedes ponerla en Classroom, Moodle o por QR.  
   - Si programas horario, el examen se abre y cierra automáticamente. También puedes abrir/cerrar manualmente desde el panel.

4. Corrige y revisa resultados  
   - En el panel, lanza la corrección cuando quieras.  
   - Verás el resumen y el listado de envíos.  
   - Los resultados detallados se escriben en la pestaña `Correcció` de tu hoja (aciertos, errores, en blanco y nota).

## Para el siguiente examen

- Puedes crear un examen nuevo desde el panel (recomendado) y conservar la misma URL.  
- Si prefieres separar por grupos, duplica la Hoja de Cálculo (Archivo → Hacer una copia) y repite los pasos de publicación. Obtendrás una URL distinta para cada copia.  

## Referencia rápida de pestañas (en tu hoja)

- `Config`: datos del examen (nombre, número de preguntas, horario, barajado, etc.).  
- `Keys`: clave oficial de respuestas por examen.  
- `Submissions`: envíos brutos del alumnado.  
- `Correcció`: resultados calculados (aciertos/errores/nota).  
- `Settings`: ajustes internos (incluye el código del profesor).  

## Pestañas del panel del profesorado

El panel incluye varias pestañas que organizan todas las funciones disponibles:

### Resumen
- Selector de examen y creación de nuevos exámenes.  
- Tarjeta con nombre, ID, estado (abierto/cerrado), número de envíos y último envío.  
- Botones para ver envíos y borrar examen.  

### Configuración
- Nombre, número de preguntas y opciones (ABC, ABCDE, etc.).  
- Fechas de inicio y fin opcionales.  
- Medidas de seguridad: barajar preguntas, barajar opciones, forzar pantalla completa.  
- Guardar configuración y abrir/cerrar examen manualmente.  
- Enlace del alumnado (copiar).  
- Indicadores de estado y acceso rápido a envíos.  

### Respuestas
- Clave de corrección: introducir secuencia de letras correctas.  
- Criterios de calificación: nota máxima y umbral de aprobado.  
- Penalización por azar: definir fracción a restar por cada incorrecta.  
- Generar corrección y análisis: crea informe en la pestaña `Correcció`.  

### Ajustes
- Cambiar el código de administración.  
- Borrar envíos de un examen concreto.  
- Reiniciar todos los datos (uso extremo).  

## Preguntas frecuentes

— ¿Puedo restringir el acceso al dominio del centro?  
Sí: al publicar, elige "Usuarios de tu dominio" en "Quién tiene acceso". Todos deberán iniciar sesión con la cuenta del centro.

— ¿Cómo cambio el código de profesor?  
Entra en la pestaña **Ajustes** del panel del profesorado y usa la opción correspondiente.

## Licencias

- Código: AGPL v3. Consulta el texto completo en `LICENSE.txt`.
  - Atribución recomendada: «Plantilla correctora digital», Juan José de Haro, 2025, https://github.com/jjdeharo/examen-digital-gas
- Contenidos educativos (textos, ejercicios, vídeos, imágenes): CC BY-SA 4.0.
  - Más información: https://creativecommons.org/licenses/by-sa/4.0/

Pie de página incorporado en la aplicación (centrado):
- Línea 1: © Juan José de Haro (enlace a https://bilateria.es)
- Línea 2: Licencia del código: AGPL v3 (enlace a `LICENSE.txt`) · Contenido: CC BY-SA 4.0 (enlace a la licencia), con el icono oficial cuando es posible.
