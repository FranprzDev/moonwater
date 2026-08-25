# MoonWater — Notas para agentes

## Prácticas de edición

- Para editar archivos, usar siempre las herramientas dedicadas (`Edit`, `Write`).
- No usar scripts de shell (`python3`, `sed`, `awk`) para reemplazos de texto:
  las herramientas dedicadas validan coincidencias exactas y fallan de forma
  segura; los scripts modifican silenciosamente y ensucian el historial.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (verificar tras cada cambio)
- No hay linter configurado más allá de `.oxlintrc.json`

## Estructura

- `src/Landing.jsx` — landing pública (la vidriera del proyecto)
- `src/App.jsx` — simulador (vista interna)
- `src/Scene.jsx` + `src/Infrastructure.jsx` — escena 3D
- `src/sim/store.js` — motor de simulación paramétrica
- `docs/` — material confidencial (paper); ignorado por git a propósito,
  no subirlo ni referenciarlo en commits
