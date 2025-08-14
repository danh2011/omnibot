
import { Client, Collection, GatewayIntentBits, Partials, REST, Routes, Events } from 'discord.js';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import { CONFIG } from '../config.js';
import { logger } from '../lib.logger.js';
import { prisma } from '../lib.prisma.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
}) as any;

client.commands = new Collection();

async function loadCommands() {
  const commandsPath = path.join(process.cwd(), 'src', 'commands');
  const catDirs = readdirSync(commandsPath);
  for (const cat of catDirs) {
    const full = path.join(commandsPath, cat);
    const files = readdirSync(full).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const mod = await import(path.join(full, file));
      if (mod.default?.data) {
        client.commands.set(mod.default.data.name, mod.default);
      }
    }
  }
  logger.info(`Loaded ${client.commands.size} commands.`);
}

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(CONFIG.token);
  const body = client.commands.map((c: any) => c.data.toJSON?.() ?? c.data);
  await rest.put(Routes.applicationCommands(CONFIG.clientId), { body });
  logger.info('Registered global slash commands.');
}


// dynamic event loader
async function loadEvents() {
  const eventsPath = path.join(process.cwd(), 'src', 'events');
  const files = readdirSync(eventsPath).filter(f => f.endsWith('.ts'));
  for (const file of files) {
    const mod = await import(path.join(eventsPath, file));
    if (mod.default?.name && mod.default?.execute) {
      client.on(mod.default.name, (...args) => mod.default.execute(...args));
    } else if (mod.default?.register) {
      mod.default.register(client);
    }
  }
  logger.info('Events loaded.');
}

client.once(Events.ClientReady, async () => {
  logger.info(`Logged in as ${client.user?.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    logger.error(err, 'Command error');
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'Something went wrong.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
    }
  }
});

// Simple health + placeholder API (for future dashboard)
const app = express();
app.get('/health', (_req, res) => res.json({ ok: true }));
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`API listening on :${port}`));

(async () => {
  await loadCommands();
  await loadEvents();
  // Only deploy on demand via script, but for dev you can uncomment:
  // await registerCommands();
  await client.login(CONFIG.token);
})();
