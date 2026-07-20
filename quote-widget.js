const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuración desde Variables de Entorno
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const DISCORD_USER_ID = process.env.DISCORD_USER_ID;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'TU_USUARIO/TU_REPO';

// Extraer usuario y repo para las URLs de las imágenes
const [githubUser, repoName] = GITHUB_REPOSITORY.split('/');
const branch = 'main'; 

// --- CARGAR DATOS DESDE quotes.json ---
// La única fuente de verdad es quotes.json
const quotesFilePath = path.join(__dirname, 'quotes.json');
const QUOTES_DATA_RAW = JSON.parse(fs.readFileSync(quotesFilePath, 'utf8'));

// Mapeo de nombres de personajes a keys de imagen
const CHARACTER_TO_IMAGE_KEY = {
  "Miku Nakano": "miku",
  "Nino Nakano": "nino",
  "Itsuki Nakano": "itsuki",
  "Yotsuba Nakano": "yotsuba",
  "Ai Hoshino": "ai",
  "Aqua Hoshino": "aqua",
  "Kana Arima": "kana",
  "Akane Kurokawa": "akane",
  "Frieren": "frieren",
  "Kiyotaka Ayanokoji": "ayanokoji",
  "Suzune Horikita": "horikita",
  "Marin Kitagawa": "marin",
  "Kaoruko Waguri": "kaoruko",
  "Yukino Yukinoshita": "yukino",
  "Mai Sakurajima": "mai",
  "Hori Kyouko": "hori",
  "Zero Two": "zerotwo",
  "Lucy": "lucy",
  "David Martinez": "david",
  "Rebecca": "rebecca"
};

// Mapeo de keys a nombres de archivo de imagen (deben coincidir con los archivos en /images/)
const IMAGE_MAP = {
  nino: { hero: 'nino_hero', small: 'nino_small' },
  miku: { hero: 'miku_hero', small: 'miku_small' },
  itsuki: { hero: 'itsuki_hero', small: 'itsuki_small' },
  yotsuba: { hero: 'yotsuba_hero', small: 'yotsuba_small' },
  ai: { hero: 'ai_hero', small: 'ai_small' },
  aqua: { hero: 'aqua_hero', small: 'aqua_small' },
  kana: { hero: 'kana_hero', small: 'kana_small' },
  akane: { hero: 'akane_hero', small: 'akane_small' },
  frieren: { hero: 'frieren_hero', small: 'frieren_small' },
  ayanokoji: { hero: 'ayanokoji_hero', small: 'ayanokoji_small' },
  horikita: { hero: 'horikita_hero', small: 'horikita_small' },
  marin: { hero: 'marin_hero', small: 'marin_small' },
  kaoruko: { hero: 'kaoruko_hero', small: 'kaoruko_small' },
  yukino: { hero: 'yukino_hero', small: 'yukino_small' },
  mai: { hero: 'mai_hero', small: 'mai_small' },
  hori: { hero: 'hori_hero', small: 'hori_small' },
  zerotwo: { hero: 'zerotwo_hero', small: 'zerotwo_small' },
  lucy: { hero: 'lucy_hero', small: 'lucy_small' },
  david: { hero: 'david_hero', small: 'david_small' },
  rebecca: { hero: 'rebecca_hero', small: 'rebecca_small' }
};

function log(...args) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, ...args);
}

/**
 * Selecciona un elemento ALEATORIO del array QUOTES_DATA_RAW.
 * Esto garantiza que Cita, Personaje y Anime vengan del MISMO objeto en quotes.json.
 */
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES_DATA_RAW.length);
  const quoteEntry = QUOTES_DATA_RAW[randomIndex];
  
  // Obtener la imageKey desde el mapeo de personajes
  const imageKey = CHARACTER_TO_IMAGE_KEY[quoteEntry.character];
  
  if (!imageKey) {
    log(`⚠️ WARNING: No image mapping found for character "${quoteEntry.character}".`);
  }
  
  // Retornar un objeto con la estructura esperada por buildPayload
  return {
    quote: quoteEntry.quote,
    character: quoteEntry.character,
    anime: quoteEntry.anime,
    imageKey: imageKey
  };
}

function buildPayload(quoteData) {
  const { quote, character, anime, imageKey } = quoteData;
  const images = IMAGE_MAP[imageKey];

  if (!images) {
    log(`⚠️ CRITICAL: No image mapping found for key "${imageKey}". Images will be empty.`);
  }

  // Construcción de URLs usando GITHUB_REPOSITORY dinámico
  const heroUrl = images 
    ? `https://raw.githubusercontent.com/${githubUser}/${repoName}/${branch}/images/${images.hero}.png` 
    : "";
    
  const smallUrl = images 
    ? `https://raw.githubusercontent.com/${githubUser}/${repoName}/${branch}/images/${images.small}.png` 
    : "";

  log(`✅ Selected Character: ${character}`);
  log(`🖼️ Hero URL: ${heroUrl}`);
  log(`🖼️ Small URL: ${smallUrl}`);

  // Payload que coincide EXACTAMENTE con las claves de widget-layout.json
  // Claves esperadas: daily_quote, character_name, anime_name, hero_image, small_image
  return {
    data: {
      dynamic: [
        {
          type: 1, // Texto
          name: "daily_quote",
          value: quote
        },
        {
          type: 1, // Texto
          name: "character_name",
          value: character
        },
        {
          type: 1, // Texto
          name: "anime_name",
          value: anime
        },
        {
          type: 3, // Imagen
          name: "hero_image",
          value: {
            url: heroUrl
          }
        },
        {
          type: 3, // Imagen
          name: "small_image",
          value: {
            url: smallUrl
          }
        }
      ]
    }
  };
}

async function updateDiscordWidget(payload) {
  return new Promise((resolve, reject) => {
    // Endpoint corregido para actualizar el perfil del usuario con widget
    const path = `/api/v10/applications/${DISCORD_APPLICATION_ID}/users/${DISCORD_USER_ID}/identities/0/profile`;
    
    const options = {
      hostname: 'discord.com',
      port: 443,
      path: path,
      method: 'PATCH', // Usamos PATCH para actualizar parcialmente sin borrar otras configs
      headers: {
        'Authorization': `Bot ${DISCORD_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'User-Agent': 'DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)'
      }
    };

    log(`📡 Sending request to: ${path}`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: data });
        } else {
          reject(new Error(`Discord API ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function main() {
  if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID || !DISCORD_USER_ID) {
    log('❌ Error: Missing required environment variables (DISCORD_TOKEN, DISCORD_APPLICATION_ID, DISCORD_USER_ID).');
    process.exit(1);
  }

  try {
    log('🚀 Starting random quote update...');
    
    // 1. Obtener datos coherentes (Cita + Personaje + Imagen)
    const quoteData = getRandomQuote();
    
    log(`💬 Quote: "${quoteData.quote}"`);
    log(`👤 Character: ${quoteData.character}`);
    log(`📺 Anime: ${quoteData.anime}`);

    // 2. Construir payload con las claves correctas para el layout
    const payload = buildPayload(quoteData);
    
    log('⏳ Updating Discord widget...');
    const result = await updateDiscordWidget(payload);
    
    log('✅ Widget updated successfully!');
    // log('Response:', result.body); // Opcional: descomentar para ver respuesta completa
    
  } catch (error) {
    log('❌ Error updating widget:', error.message);
    if (error.message.includes('404')) {
      log('💡 Tip: Asegúrate de que "Enable Widget" esté activado en Discord Developer Portal > Tu App > Widget.');
    }
    process.exit(1);
  }
}

main();
