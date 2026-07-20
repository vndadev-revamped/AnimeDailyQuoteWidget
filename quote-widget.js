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
// !!! CAMBIA ESTO POR TU USUARIO DE GITHUB !!!
const GITHUB_USERNAME = "TU_USUARIO";
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/AnimeQuotesDailyWidget/main/images`;

// ── URLs DE LAS IMÁGENES ──────────────────────────────────────────

const imageUrls = {
  "Miku_Nakano_hero": `${IMAGE_BASE_URL}/miku_hero.png`,
  "miku_small": `${IMAGE_BASE_URL}/miku_small.png`,
  "Nino_Nakano_hero": `${IMAGE_BASE_URL}/nino_hero.png`,
  "nino_small": `${IMAGE_BASE_URL}/nino_small.png`,
  "Itsuki_Nakano_hero": `${IMAGE_BASE_URL}/itsuki_hero.png`,
  "itsuki_small": `${IMAGE_BASE_URL}/itsuki_small.png`,
  "Yotsuba_Nakano_hero": `${IMAGE_BASE_URL}/yotsuba_hero.png`,
  "yotsuba_small": `${IMAGE_BASE_URL}/yotsuba_small.png`,
  "Ai_Hoshino_hero": `${IMAGE_BASE_URL}/ai_hero.png`,
  "ai_small": `${IMAGE_BASE_URL}/ai_small.png`,
  "Frieren_hero": `${IMAGE_BASE_URL}/frieren_hero.png`,
  "frieren_small": `${IMAGE_BASE_URL}/frieren_small.png`,
  "Kiyotaka_Ayanokoji_hero": `${IMAGE_BASE_URL}/ayanokoji_hero.png`,
  "ayanokoji_small": `${IMAGE_BASE_URL}/ayanokoji_small.png`,
  "Suzune_Horikita_hero": `${IMAGE_BASE_URL}/horikita_hero.png`,
  "horikita_small": `${IMAGE_BASE_URL}/horikita_small.png`,
  "Marin_Kitagawa_hero": `${IMAGE_BASE_URL}/marin_hero.png`,
  "marin_small": `${IMAGE_BASE_URL}/marin_small.png`,
  "Kaoruko_Waguri_hero": `${IMAGE_BASE_URL}/kaoruko_hero.png`,
  "kaoruko_small": `${IMAGE_BASE_URL}/kaoruko_small.png`,
  "Yukino_Yukinoshita_hero": `${IMAGE_BASE_URL}/yukino_hero.png`,
  "yukino_small": `${IMAGE_BASE_URL}/yukino_small.png`,
  "Mai_Sakurajima_hero": `${IMAGE_BASE_URL}/mai_hero.png`,
  "mai_small": `${IMAGE_BASE_URL}/mai_small.png`,
  "Hori_Kyouko_hero": `${IMAGE_BASE_URL}/hori_hero.png`,
  "hori_small": `${IMAGE_BASE_URL}/hori_small.png`,
  "Kana_Arima_hero": `${IMAGE_BASE_URL}/kana_hero.png`,
  "kana_small": `${IMAGE_BASE_URL}/kana_small.png`,
  "Akane_Kurokawa_hero": `${IMAGE_BASE_URL}/akane_hero.png`,
  "akane_small": `${IMAGE_BASE_URL}/akane_small.png`,
  "Aqua_Hoshino_hero": `${IMAGE_BASE_URL}/aqua_hero.png`,
  "aqua_small": `${IMAGE_BASE_URL}/aqua_small.png`,
  "Zero_Two_hero": `${IMAGE_BASE_URL}/zerotwo_hero.png`,
  "zerotwo_small": `${IMAGE_BASE_URL}/zerotwo_small.png`,
  "Lucy_hero": `${IMAGE_BASE_URL}/lucy_hero.png`,
  "lucy_small": `${IMAGE_BASE_URL}/lucy_small.png`,
  "David_Martinez_hero": `${IMAGE_BASE_URL}/david_hero.png`,
  "david_small": `${IMAGE_BASE_URL}/david_small.png`,
  "Rebecca_hero": `${IMAGE_BASE_URL}/rebecca_hero.png`,
  "rebecca_small": `${IMAGE_BASE_URL}/rebecca_small.png`
};

// ── MAPEO DE PERSONAJES A NOMBRES DE CAMPOS ───────────────────────

const characterMapping = {
  "Miku Nakano": { hero: "Miku_Nakano_hero", small: "miku_small" },
  "Nino Nakano": { hero: "Nino_Nakano_hero", small: "nino_small" },
  "Itsuki Nakano": { hero: "Itsuki_Nakano_hero", small: "itsuki_small" },
  "Yotsuba Nakano": { hero: "Yotsuba_Nakano_hero", small: "yotsuba_small" },
  "Ai Hoshino": { hero: "Ai_Hoshino_hero", small: "ai_small" },
  "Frieren": { hero: "Frieren_hero", small: "frieren_small" },
  "Kiyotaka Ayanokoji": { hero: "Kiyotaka_Ayanokoji_hero", small: "ayanokoji_small" },
  "Suzune Horikita": { hero: "Suzune_Horikita_hero", small: "horikita_small" },
  "Marin Kitagawa": { hero: "Marin_Kitagawa_hero", small: "marin_small" },
  "Kaoruko Waguri": { hero: "Kaoruko_Waguri_hero", small: "kaoruko_small" },
  "Yukino Yukinoshita": { hero: "Yukino_Yukinoshita_hero", small: "yukino_small" },
  "Mai Sakurajima": { hero: "Mai_Sakurajima_hero", small: "mai_small" },
  "Hori Kyouko": { hero: "Hori_Kyouko_hero", small: "hori_small" },
  "Kana Arima": { hero: "Kana_Arima_hero", small: "kana_small" },
  "Akane Kurokawa": { hero: "Akane_Kurokawa_hero", small: "akane_small" },
  "Aqua Hoshino": { hero: "Aqua_Hoshino_hero", small: "aqua_small" },
  "Zero Two": { hero: "Zero_Two_hero", small: "zerotwo_small" },
  "Lucy": { hero: "Lucy_hero", small: "lucy_small" },
  "David Martinez": { hero: "David_Martinez_hero", small: "david_small" },
  "Rebecca": { hero: "Rebecca_hero", small: "rebecca_small" }
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

  for (const [key, url] of Object.entries(imageUrls)) {
    if (key === heroField || key === smallField) {
      dynamic.push({ type: 3, name: key, value: { url: url } });
    } else {
      dynamic.push({ type: 3, name: key, value: { url: "" } });
    }
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
