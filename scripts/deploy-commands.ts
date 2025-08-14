
import { REST, Routes } from 'discord.js';
import { CONFIG } from '../src/config.js';
import { readdirSync } from 'node:fs';
import path from 'node:path';

async function collect() {
  const commands: any[] = [];
  const base = path.join(process.cwd(), 'src', 'commands');
  const cats = readdirSync(base);
  for (const cat of cats) {
    const files = readdirSync(path.join(base, cat)).filter(f => f.endsWith('.ts'));
    for (const f of files) {
      const mod = await import(path.join(base, cat, f));
      if (mod.default?.data) commands.push(mod.default.data.toJSON?.() ?? mod.default.data);
    }
  }
  return commands;
}

(async () => {
  const rest = new REST({ version: '10' }).setToken(CONFIG.token);
  const cmds = await collect();
  await rest.put(Routes.applicationCommands(CONFIG.clientId), { body: cmds });
  console.log(`Deployed ${cmds.length} commands.`);
})();
