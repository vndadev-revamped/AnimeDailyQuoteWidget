# Anime Daily Quote Widget

Widget para perfil de Discord que muestra una cita de anime diferente cada día.

## Configuración en GitHub

### 1. Crear aplicación en Discord Developer Portal
- Ve a https://discord.com/developers/applications
- Crea una nueva aplicación
- Ve a la sección "Bot" y crea un bot
- Copia el token del bot

### 2. Configurar Secrets en GitHub
- Ve a Settings > Secrets and variables > Actions
- Añade estos secrets:
  - `DISCORD_TOKEN`: El token de tu bot de Discord
  - `DISCORD_USER_ID`: Tu ID de usuario de Discord

### 3. Subir imágenes
- Crea una carpeta `images/` en la raíz
- Sube todas las imágenes con los nombres exactos:
  - `miku_hero.png`, `miku_small.png`
  - `nino_hero.png`, `nino_small.png`
  - etc.

### 4. Actualizar URL base
- En `quote-widget.js`, cambia `TU_USUARIO` por tu nombre de usuario de GitHub

## Desarrollo local

```bash
node quote-widget.js
