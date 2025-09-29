# examen-digital-gas

Proyecto de Google Apps Script para gestionar exámenes tipo test (opción múltiple) usando Google Sheets como backend. Incluye:

- Formulario de alumno (web app) para enviar respuestas.
- Consola de profesor (panel admin) para configurar exámenes, cargar claves y lanzar correcciones.
- Lógica centralizada en `Code.gs` para validar envíos, escribir en hojas y generar correcciones.

## Estructura

- `Code.gs`: lógica del servidor (doGet, validaciones, arranque de hojas, constantes compartidas).
- `Admin.html`: consola del profesor (configuración y corrección).
- `Index.html`: formulario del alumno (renderizado con plantillas, p. ej. `examId`).
- `appsscript.json`: manifiesto de Apps Script.
- `.clasp.json`: configuración de `clasp` (ID del script, etc.).

Mantén nombres de hojas y cabeceras centralizados en `Code.gs` (p. ej. `SHEET_NAMES`, `SHEET_HEADERS`, `SETTINGS_KEYS`).

## Requisitos

- Cuenta Google con acceso a Apps Script y Google Drive.
- Node.js y `clasp` instalados: `npm install -g @google/clasp`.
- Autenticación en `clasp`: `clasp login`.

## Configuración inicial

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Inicia sesión en `clasp`: `clasp login` (si no lo has hecho).
3. Asegúrate de que `.clasp.json` apunta al script deseado. Si partes de cero, crea uno y vincula:
   - Crear script vacío: `clasp create --type webapp --title "Examen Digital"`.
   - O vincular a uno existente: `clasp clone <scriptId>` y mueve los archivos del proyecto.
4. En la hoja de cálculo asociada, crea las pestañas que espera el proyecto según `SHEET_NAMES` y revisa `SHEET_HEADERS` en `Code.gs`.
5. Sustituye cualquier token/valor por defecto sensible (por ejemplo, `DEFAULT_ADMIN_TOKEN`) y refleja el valor en la pestaña `Settings`.

## Flujo de desarrollo

- Descargar cambios del script (si editaste en el editor online): `clasp pull`.
- Subir cambios locales a Apps Script: `clasp push`.
- Modo vigilancia durante sesiones largas: `clasp push --watch`.
- Previsualizar la web app: desde el editor de Apps Script, "Deploy" → "Test deployments" o usa `clasp open`.

## Despliegue (manteniendo la URL estable)

1. Lista despliegues: `clasp deployments`.
2. Actualiza el despliegue existente (recomendado) en lugar de crear uno nuevo:
   `clasp deploy --deploymentId <id_actual> --description "<nota>"`.
3. Abre el despliegue para compartir/pruebas: `clasp open --deploymentId <id_actual>`.

Consejo: reutilizar el mismo `deploymentId` evita cambios de URL en la web app.

## Pruebas manuales sugeridas

- Ejecuta `submitResponse` desde el editor con cargas de ejemplo y confirma filas en `Submissions` y `Correcció`.
- Prueba el panel admin en previsualización: apertura/cierre manual del examen, carga de claves, corrección.
- Verifica que las columnas coinciden con `SHEET_HEADERS` para que los `append` queden alineados.

## Buenas prácticas

- Usa indentación de dos espacios y comas finales como en `Code.gs`.
- Prefiere `const`; usa `let` solo si hay reasignación.
- Identificadores en lowerCamelCase; constantes compartidas en MAYÚSCULAS_CON_GUIONES.
- Agrupa cambios de Apps Script y HTML en el mismo commit.

## Seguridad y configuración

- No publiques tokens o IDs sensibles en commits públicos.
- Si clonas el proyecto para otro grupo/clase, duplica la hoja, limpia `Settings` y despliega de nuevo para generar identificadores nuevos.

---

¿Dudas o mejoras? Abre un issue o comenta en el PR.

