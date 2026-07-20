# Anime Daily Quote Widget

Widget para perfil de Discord que muestra una cita de anime diferente cada día.

Basado en la estructura de [AnimeWatchlistWidget](https://github.com/vndadev-revamped/AnimeWatchlistWidget).

## Configuración en GitHub

### 1. Crear aplicación en Discord Developer Portal

> ⚠️ **Importante:** La app de Discord debe ser creada desde la extensión **Widget Creator** usando el botón "Create new widget". Si la app se crea manualmente en el Discord Developer Portal, el identity del widget no se inicializa correctamente.

1. Abre la extensión **Widget Creator** en Discord
2. Haz clic en **"Create new widget"**
3. Importa el `widget-layout.json` en esa app nueva
4. Copia el **Application ID** y **Bot Token**

### 2. Configurar Secrets en GitHub

Ve a `Settings > Secrets and variables > Actions` y añade estos secrets:

| Secret | Descripción |
|---|---|
| `DISCORD_TOKEN` | Bot token de la app del widget |
| `DISCORD_APPLICATION_ID` | ID de la app de Discord |
| `DISCORD_USER_ID` | Tu ID numérico de Discord (habilita modo desarrollador en Discord para copiarlo) |

### 3. Subir imágenes

- Crea una carpeta `images/` en la raíz
- Sube todas las imágenes con los nombres exactos:
  - `miku_hero.png`, `miku_small.png`
  - `nino_hero.png`, `nino_small.png`
  - etc.

### 4. Actualizar URL base

En `quote-widget.js`, cambia `TU_USUARIO` por tu nombre de usuario de GitHub:

```javascript
const GITHUB_USERNAME = "TU_USUARIO";
```

## Desarrollo local

```bash
node quote-widget.js
```

## Flujo de funcionamiento

1. **GitHub Actions** despierta el script cada día a las 00:00 UTC
2. El script lee una cita aleatoria de `quotes.json`
3. Construye el payload del widget con la cita y las imágenes del personaje
4. Hace un `PATCH` a la API de Discord para actualizar el widget

## Estructura del repositorio

```
├── .github/workflows/
│   └── update-widget.yml    # GitHub Actions workflow
├── images/                   # Imágenes de personajes
├── quote-widget.js          # Script principal
├── quotes.json              # Base de datos de citas
├── package.json             # Configuración del proyecto
└── README.md                # Este archivo
```

## Créditos

Patrón basado en [AnimeWatchlistWidget](https://github.com/vndadev-revamped/AnimeWatchlistWidget) de vndadev-revamped.
