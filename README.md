# TeresitaApp - Vercel

Este zip está listo para subirlo a Vercel como proyecto estático + Functions.

## Estructura

- `index.html` → tu app completa (frontend).
- `api/guardar-registro.js` → Function para guardar registros.
- `api/listar-registros.js` → Function para listar registros.
- `vercel.json` → redirige `/.netlify/functions/*` a `/api/*` para que no tengas que tocar el front.

## Qué tenés que hacer

1. Reemplazar el código de las funciones de `api/guardar-registro.js` y
   `api/listar-registros.js` por la lógica real que hoy usás en Netlify
   (Neon / DB, etc.).
2. Subir este proyecto a un repo (GitHub / GitLab) o a Vercel como "Upload".
3. En Vercel:
   - Crear el proyecto desde este código.
   - Configurar las variables de entorno (`DATABASE_URL`, etc.) que use tu backend.

Con eso deberías tener TeresitaApp corriendo en Vercel en modo similar a Netlify.
