🌸 Anime Daily Quote Widget
Un widget dinámico para perfiles de Discord que muestra una cita aleatoria de anime, junto con el personaje, la serie y arte personalizado, actualizado automáticamente mediante GitHub Actions.
Este proyecto no depende de librerías externas complejas; utiliza un script ligero en Vanilla JavaScript que se ejecuta en los servidores de GitHub para actualizar directamente la API de Discord.
✨ Características Principales
🎲 Aleatoriedad Real: Cada vez que se ejecuta el workflow (ya sea manualmente o por el cronómetro), se selecciona un personaje al azar.
🔗 Coherencia de Datos: Al seleccionar un personaje, se aseguran automáticamente:
La cita correcta.
El nombre del personaje.
El nombre del anime.
Las URLs de las imágenes (hero y small) correspondientes a ese personaje específico.
🚀 Zero Dependencies: Sin npm install, sin node_modules. Solo un archivo .js nativo.
🖼️ Soporte de Imágenes Personalizadas: Utiliza imágenes alojadas en tu propio repositorio para garantizar que el widget sea único.
⏱️ Actualización Flexible: Se puede ejecutar automáticamente cada X horas o manualmente bajo demanda.
📋 Requisitos Previos
Antes de comenzar, necesitas tener acceso a lo siguiente:
Una cuenta de GitHub.
Una Aplicación de Discord Registrada:
Ve al Discord Developer Portal.
Crea una nueva aplicación.
Obtén el Application ID.
Genera un Bot Token (ve a la sección "Bot", añade un bot y copia el token).
Importante: En la sección "Widget" o "Application Widget", asegúrate de habilitar la funcionalidad si es requerida por tu tipo de widget.
Tu User ID de Discord: Para vincular el widget a tu perfil (opcional dependiendo de la configuración del widget).
🛠️ Instalación y Configuración
Paso 1: Fork y Clonación
Haz un Fork de este repositorio a tu cuenta de GitHub.
Clona tu nuevo repositorio en tu máquina local:
bash
12
Paso 2: Configurar Secrets de GitHub
Para que el script pueda comunicarse con Discord, debes guardar las credenciales de forma segura en GitHub.
Ve a tu repositorio en GitHub > Settings > Secrets and variables > Actions.
Crea los siguientes secretos (New repository secret):
Nombre del Secreto
Valor
Descripción
DISCORD_TOKEN
Tu_Bot_Token_Aquí
El token del bot generado en el Developer Portal.
DISCORD_APPLICATION_ID
Tu_Application_ID
El ID numérico de tu aplicación de Discord.
DISCORD_USER_ID
Tu_User_ID
Tu ID de usuario de Discord (para asociaciones específicas).
Paso 3: Preparación de Imágenes (CRUCIAL)
El widget requiere dos imágenes por personaje: una para el banner (hero) y una para el avatar (small).
Crea una carpeta llamada images en la raíz del repositorio (si no existe).
Debes subir 40 imágenes en total (2 por cada uno de los 20 personajes soportados).
Nomenclatura Estricta: Los nombres de los archivos deben ser exactamente como se listan abajo, todo en minúsculas y formato .png (recomendado) o .jpg.
Lista de Archivos Requeridos
Personaje
Archivo Banner (Hero)
Archivo Avatar (Small)
Nino Nakano
nino_hero.png
nino_small.png
Miku Nakano
miku_hero.png
miku_small.png
Itsuki Nakano
itsuki_hero.png
itsuki_small.png
Yotsuba Nakano
yotsuba_hero.png
yotsuba_small.png
Ai Hoshino
ai_hero.png
ai_small.png
Aqua Hoshino
aqua_hero.png
aqua_small.png
Kana Arima
kana_hero.png
kana_small.png
Akane Kurokawa
akane_hero.png
akane_small.png
Frieren
frieren_hero.png
frieren_small.png
Kiyotaka Ayanokoji
ayanokoji_hero.png
ayanokoji_small.png
Suzune Horikita
horikita_hero.png
horikita_small.png
Marin Kitagawa
marin_hero.png
marin_small.png
Kaoruko Waguri
kaoruko_hero.png
kaoruko_small.png
Yukino Yukinoshita
yukino_hero.png
yukino_small.png
Mai Sakurajima
mai_hero.png
mai_small.png
Kyouko Hori
hori_hero.png
hori_small.png
Zero Two
zerotwo_hero.png
zerotwo_small.png
Lucy
lucy_hero.png
lucy_small.png
David Martinez
david_hero.png
david_small.png
Rebecca
rebecca_hero.png
rebecca_small.png
Nota: Si subes una imagen con un nombre incorrecto (ej: Miku_Hero.png en mayúsculas), el widget no podrá mostrarla y aparecerá vacío ese campo.
Sube las imágenes y haz commit:
bash
123
Paso 4: Configuración del Layout (widget-layout.json)
Este repositorio incluye un archivo widget-layout.json. Este archivo define la posición visual de los elementos (texto, imágenes) en el widget de Discord.
No modifiques este archivo a menos que sepas exactamente cómo funciona el sistema de widgets de Discord y tengas herramientas de renderizado compatibles.
El script quote-widget.js está diseñado para enviar los datos (hero_image, small_image, daily_quote, etc.) que coinciden exactamente con lo que este layout espera.
⚙️ Cómo Funciona (Detalles Técnicos)
1. Lógica de Selección Aleatoria
A diferencia de otros widgets que usan la fecha como semilla (lo que hace que la cita sea la misma para todos durante 24 horas), este script utiliza Math.random() en tiempo de ejecución.
Ejecución Manual: Cada vez que haces clic en "Run workflow", obtienes un resultado diferente.
Ejecución Automática: El cronograma definido en .github/workflows/update.yml disparará el script, y este elegirá un personaje al azar en ese instante.
2. Construcción del Payload
El script (quote-widget.js) contiene un objeto QUOTES_DATA hardcodeado. Cuando se selecciona un índice aleatorio:
Extrae la cita, personaje y anime.
Usa la clave del personaje (ej: miku) para buscar en el IMAGE_MAP.
Construye las URLs crudas de GitHub automáticamente usando tu nombre de usuario y repositorio:
https://raw.githubusercontent.com/TU_USUARIO/AnimeDailyQuoteWidget/main/images/miku_hero.png
Envía un paquete JSON limpio a la API de Discord con solo los 5 campos necesarios:
daily_quote (Texto)
character_name (Texto)
anime_name (Texto)
hero_image (Imagen URL)
small_image (Imagen URL)
3. Automatización (Cron)
El archivo .github/workflows/update.yml está configurado para ejecutarse periódicamente.
Para cambiar la frecuencia, edita la línea cron en ese archivo.
Ejemplo (cada 6 horas): cron: '0 */6 * * *'
🚀 Uso
Ejecución Automática
Una vez configurado, el workflow se ejecutará solo según el horario definido. No necesitas hacer nada más.
Ejecución Manual (Forzar Actualización)
Si quieres cambiar la cita inmediatamente sin esperar al cronómetro:
Ve a la pestaña Actions en tu repositorio de GitHub.
Selecciona el workflow llamado "Update Discord Widget" (o similar).
Haz clic en el botón "Run workflow".
Selecciona la rama main y confirma.
Espera a que el check verde aparezca. ¡Tu widget de Discord debería estar actualizado en segundos!
🐛 Solución de Problemas
Problema
Posible Causa
Solución
Error 401/403
Token inválido o permisos insuficientes.
Verifica que DISCORD_TOKEN sea correcto y que el Bot tenga permisos de administrador o gestión de webhook en la app.
Error 404
Application ID incorrecto o Widget no habilitado.
Revisa DISCORD_APPLICATION_ID. Asegúrate de haber habilitado el widget en el Developer Portal.
Imágenes rotas
Nombres de archivo incorrectos.
Revisa que las imágenes en la carpeta /images coincidan exactamente (minúsculas, guiones bajos) con la lista de arriba.
Datos desalineados
Edición manual errónea del JSON.
No edites la lógica interna de quote-widget.js a menos que sepas JavaScript. Asegura que el array QUOTES_DATA esté bien formado.
El widget no cambia
Caché de Discord.
A veces Discord tarda unos minutos en reflejar los cambios. Intenta recargar la aplicación de Discord (Ctrl+R).
📂 Estructura del Repositorio
text
123456789101112
📝 Licencia y Créditos
Este proyecto es de código abierto y está diseñado para la comunidad de fans de anime.
Inspiración: Basado en la estructura de proyectos como AnimeWatchlistWidget.
Imágenes: Las imágenes utilizadas pertenecen a sus respectivos estudios y creadores. Este proyecto es solo un agregador sin fines de lucro.
¡Disfruta mostrando tu amor por el anime en tu perfil de Discord! 🌸
