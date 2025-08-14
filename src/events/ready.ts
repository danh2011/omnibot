
import { Events, EmbedBuilder } from 'discord.js';
import { prisma } from '../lib.prisma.js';

export default {
  name: Events.ClientReady,
  async execute(client) {
    console.log(`Ready as ${client.user.tag}`);
    // simple reminder loop
    setInterval(async () => {
      const due = await prisma.reminder.findMany({ where: { done: false, when: { lte: new Date() } } });
      for (const r of due) {
        try {
          if (r.channelId) {
            const ch = await client.channels.fetch(r.channelId);
            if (ch && 'send' in ch) await ch.send(`<@${r.userId}> ⏰ Reminder: ${r.message}`);
          } else {
            const u = await client.users.fetch(r.userId);
            await u.send(`⏰ Reminder: ${r.message}`);
          }
        } catch {}
        await prisma.reminder.update({ where: { id: r.id }, data: { done: true } });
      }
    }, 15000);
  }
};
