# PCD — Plantilla correctora digital

Herramienta para recoger respuestas de exámenes tipo test en la web y corregirlas en una Hoja de Cálculo de Google.

- Documentación completa (CA/ES): https://jjdeharo.github.io/pcd/
- Código fuente: https://github.com/jjdeharo/pcd

## Características

- Formulario web para el alumnado (sin ver el examen).
- Panel del profesorado para crear exámenes, cargar claves y generar informes.
- Resultados en una nueva hoja de cálculo.
- Soporte CA/ES e integración con Google Apps Script + Sheets.

## Requisitos

- Cuenta de Google con acceso a Drive y Apps Script.
- Copia de la hoja de cálculo plantilla de este proyecto.

## Primeros pasos rápidos

1) Haz una copia de la hoja plantilla.  
2) Abre Extensiones → Apps Script.  
3) Implementa la aplicación web y guarda la URL del panel.  
4) Entra con el código de administración por defecto y cámbialo en Ajustes.  
5) Crea un examen, define la clave y comparte el enlace del alumnado.

Guías ilustradas y pasos detallados en la documentación: https://jjdeharo.github.io/pcd/

## Estructura del proyecto

- `gas/Code.gs`: lógica de servidor (doGet, validación, generación de informes, utilidades).  
- `gas/Admin.html`: panel del profesorado (UI e i18n).  
- `gas/Index.html`: formulario del alumnado.  
- `docs/`: sitio estático con la documentación pública.  

## Desarrollo local (clasp)

- Instala y autentica clasp: `npm i -g @google/clasp && clasp login`.
- Sincroniza antes de editar: `clasp pull`.
- Sube los cambios: `clasp push` o `clasp push --watch` durante sesiones largas.

## Despliegue

- Mantén estable la URL del Web App actualizando el despliegue existente:  
  - Lista despliegues: `clasp deployments`  
  - Redeploy sobre el actual: `clasp deploy --deploymentId <id> --description "<nota>"`
- Contexto actual: `deploymentId` activo `AKfycbwF_uXf1Md8xM79hHIBJtcg2RbPO6nOYyf8RcDzUlDfT-DxZK4z2y6j3M7ji60B5cvsZg`.

## Contribuir

- Abre issues o pull requests con cambios pequeños y bien descritos.  
- Sigue el estilo del proyecto (indentación de 2 espacios, `const` por defecto, keys en snake case mayúsculas para mapas compartidos).

## Licencia

- Código: AGPL v3 (ver `LICENSE.txt`).  
- Contenidos educativos: CC BY-SA 4.0.

© Juan José de Haro. Más proyectos en https://bilateria.es
