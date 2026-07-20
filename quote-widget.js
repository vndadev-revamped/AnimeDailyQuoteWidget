// quote-widget.js
// Anime Quote → Discord Widget Updater
// Runs in GitHub Actions — one-shot script, no local persistence
//
// Prerequisites (one-time manual setup):
//   1. Get your Discord Application ID, Bot Token, and User ID
//   2. Add them to GitHub Secrets
//
// This script:
//   1. Reads quotes from quotes.json
//   2. Selects a random quote
//   3. Builds the Discord widget payload
//   4. PATCHes your Discord application profile widget

// ── Environment Variables ──────────────────────────────────────────

const {
  DISCORD_TOKEN,
  DISCORD_APPLICATION_ID,
  DISCORD_USER_ID,
} = process.env;

// ── Validation ─────────────────────────────────────────────────────

const requiredSecrets = [
  "DISCORD_TOKEN",
  "DISCORD_APPLICATION_ID",
  "DISCORD_USER_ID",
];

for (const secret of requiredSecrets) {
  if (!process.env[secret]) {
    throw new Error(`Missing secret: ${secret}`);
  }
}

// ── Logging ────────────────────────────────────────────────────────

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// ── Image Base URL ────────────────────────────────────────────────
// Usa GITHUB_REPOSITORY (ej: "usuario/repo") para obtener el username automáticamente
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "";
const GITHUB_USERNAME = GITHUB_REPOSITORY.split('/')[0];

if (!GITHUB_USERNAME) {
  throw new Error("GITHUB_REPOSITORY no está disponible. Asegúrate de correr esto en GitHub Actions.");
}

const REPO_NAME = GITHUB_REPOSITORY.split('/')[1] || "AnimeQuotesDailyWidget";
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images`;

// ── URLs DE LAS IMÁGENES ──────────────────────────────────────────

const imageUrls = {
  miku_hero: `${IMAGE_BASE_URL}/miku_hero.png`,
  miku_small: `${IMAGE_BASE_URL}/miku_small.png`,
  nino_hero: `${IMAGE_BASE_URL}/nino_hero.png`,
  nino_small: `${IMAGE_BASE_URL}/nino_small.png`,
  itsuki_hero: `${IMAGE_BASE_URL}/itsuki_hero.png`,
  itsuki_small: `${IMAGE_BASE_URL}/itsuki_small.png`,
  yotsuba_hero: `${IMAGE_BASE_URL}/yotsuba_hero.png`,
  yotsuba_small: `${IMAGE_BASE_URL}/yotsuba_small.png`,
  ai_hero: `${IMAGE_BASE_URL}/ai_hero.png`,
  ai_small: `${IMAGE_BASE_URL}/ai_small.png`,
  aqua_hero: `${IMAGE_BASE_URL}/aqua_hero.png`,
  aqua_small: `${IMAGE_BASE_URL}/aqua_small.png`,
  kana_hero: `${IMAGE_BASE_URL}/kana_hero.png`,
  kana_small: `${IMAGE_BASE_URL}/kana_small.png`,
  akane_hero: `${IMAGE_BASE_URL}/akane_hero.png`,
  akane_small: `${IMAGE_BASE_URL}/akane_small.png`,
  frieren_hero: `${IMAGE_BASE_URL}/frieren_hero.png`,
  frieren_small: `${IMAGE_BASE_URL}/frieren_small.png`,
  ayanokoji_hero: `${IMAGE_BASE_URL}/ayanokoji_hero.png`,
  ayanokoji_small: `${IMAGE_BASE_URL}/ayanokoji_small.png`,
  horikita_hero: `${IMAGE_BASE_URL}/horikita_hero.png`,
  horikita_small: `${IMAGE_BASE_URL}/horikita_small.png`,
  marin_hero: `${IMAGE_BASE_URL}/marin_hero.png`,
  marin_small: `${IMAGE_BASE_URL}/marin_small.png`,
  kaoruko_hero: `${IMAGE_BASE_URL}/kaoruko_hero.png`,
  kaoruko_small: `${IMAGE_BASE_URL}/kaoruko_small.png`,
  yukino_hero: `${IMAGE_BASE_URL}/yukino_hero.png`,
  yukino_small: `${IMAGE_BASE_URL}/yukino_small.png`,
  mai_hero: `${IMAGE_BASE_URL}/mai_hero.png`,
  mai_small: `${IMAGE_BASE_URL}/mai_small.png`,
  hori_hero: `${IMAGE_BASE_URL}/hori_hero.png`,
  hori_small: `${IMAGE_BASE_URL}/hori_small.png`,
  zerotwo_hero: `${IMAGE_BASE_URL}/zerotwo_hero.png`,
  zerotwo_small: `${IMAGE_BASE_URL}/zerotwo_small.png`,
  lucy_hero: `${IMAGE_BASE_URL}/lucy_hero.png`,
  lucy_small: `${IMAGE_BASE_URL}/lucy_small.png`,
  david_hero: `${IMAGE_BASE_URL}/david_hero.png`,
  david_small: `${IMAGE_BASE_URL}/david_small.png`,
  rebecca_hero: `${IMAGE_BASE_URL}/rebecca_hero.png`,
  rebecca_small: `${IMAGE_BASE_URL}/rebecca_small.png`
};

// ── MAPEO DE PERSONAJES A NOMBRES DE CAMPOS ───────────────────────

const characterMapping = {
  "Miku Nakano": { hero: "miku_hero", small: "miku_small" },
  "Nino Nakano": { hero: "nino_hero", small: "nino_small" },
  "Itsuki Nakano": { hero: "itsuki_hero", small: "itsuki_small" },
  "Yotsuba Nakano": { hero: "yotsuba_hero", small: "yotsuba_small" },
  "Ai Hoshino": { hero: "ai_hero", small: "ai_small" },
  "Frieren": { hero: "frieren_hero", small: "frieren_small" },
  "Kiyotaka Ayanokoji": { hero: "ayanokoji_hero", small: "ayanokoji_small" },
  "Suzune Horikita": { hero: "horikita_hero", small: "horikita_small" },
  "Marin Kitagawa": { hero: "marin_hero", small: "marin_small" },
  "Kaoruko Waguri": { hero: "kaoruko_hero", small: "kaoruko_small" },
  "Yukino Yukinoshita": { hero: "yukino_hero", small: "yukino_small" },
  "Mai Sakurajima": { hero: "mai_hero", small: "mai_small" },
  "Hori Kyouko": { hero: "hori_hero", small: "hori_small" },
  "Kana Arima": { hero: "kana_hero", small: "kana_small" },
  "Akane Kurokawa": { hero: "akane_hero", small: "akane_small" },
  "Aqua Hoshino": { hero: "aqua_hero", small: "aqua_small" },
  "Zero Two": { hero: "zerotwo_hero", small: "zerotwo_small" },
  "Lucy": { hero: "lucy_hero", small: "lucy_small" },
  "David Martinez": { hero: "david_hero", small: "david_small" },
  "Rebecca": { hero: "rebecca_hero", small: "rebecca_small" }
};

// ── GENERAR PAYLOAD ───────────────────────────────────────────────

function generatePayload(quote, character, anime) {
  const fields = characterMapping[character];
  const heroField = fields ? fields.hero : null;
  const smallField = fields ? fields.small : null;

  const dynamic = [
    { type: 1, name: "daily_quote", value: quote },
    { type: 1, name: "character_name", value: character },
    { type: 1, name: "anime_name", value: anime }
  ];

  // Solo agregar las imágenes del personaje seleccionado (max 2 imágenes)
  // Esto evita exceder el límite de 30 elementos de Discord
  if (heroField && imageUrls[heroField]) {
    dynamic.push({ type: 3, name: heroField, value: { url: imageUrls[heroField] } });
  } else if (heroField) {
    log(`WARNING: Image URL not found for ${heroField}`);
  }
  if (smallField && imageUrls[smallField]) {
    dynamic.push({ type: 3, name: smallField, value: { url: imageUrls[smallField] } });
  } else if (smallField) {
    log(`WARNING: Image URL not found for ${smallField}`);
  }

  return { 
    data: { 
      dynamic,
    },
  };
}

// ── Discord widget update ──────────────────────────────────────────

async function updateDiscordWidget(payload) {
  log("Updating Discord widget...");

  const res = await fetch(
    `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/users/${DISCORD_USER_ID}/identities/0/profile`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent":
          "DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord API ${res.status}: ${text}`);
  }

  log("Discord widget updated.");
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────

async function main() {
  log("Starting daily quote update...");

  // 1. Read quotes from file
  const fs = require('fs');
  const path = require('path');
  
  const quotesPath = path.join(__dirname, 'quotes.json');
  if (!fs.existsSync(quotesPath)) {
    throw new Error(`Quotes file not found: ${quotesPath}`);
  }
  
  const quotesData = fs.readFileSync(quotesPath, 'utf8');
  const quotes = JSON.parse(quotesData);
  
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new Error('quotes.json is empty or not an array');
  }

  // 2. Select random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];
  
  log(`Quote: "${selected.quote}"`);
  log(`Character: ${selected.character}`);
  log(`Anime: ${selected.anime}`);

  // 3. Check character mapping
  if (!characterMapping[selected.character]) {
    log(`WARNING: Character "${selected.character}" not found in mapping.`);
  }

  // 4. Generate payload
  const payload = generatePayload(
    selected.quote,
    selected.character,
    selected.anime
  );

  log("Widget payload:");
  console.log(JSON.stringify(payload, null, 2));

  // 5. Update Discord widget
  await updateDiscordWidget(payload);

  log("Daily quote update completed successfully.");
}

main()
  .then(() => log("Finished successfully."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
