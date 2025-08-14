
import { Events, AuditLogEvent } from 'discord.js';
import { prisma } from '../lib.prisma.js';

const XP_COOLDOWN = 60_000;

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    // Leveling
    const key = { guildId_userId: { guildId: message.guild.id, userId: message.author.id } } as const;
    const rec = await prisma.level.upsert({
      where: key,
      update: {},
      create: { guildId: message.guild.id, userId: message.author.id, xp: 0, level: 0 }
    });
    const now = Date.now();
    if (!rec.lastMsgAt || now - rec.lastMsgAt.getTime() > XP_COOLDOWN) {
      const newXp = rec.xp + 15 + Math.floor(Math.random()*10);
      let newLevel = rec.level;
      const needed = (lvl:number)=> 5*lvl*lvl + 50*lvl + 100;
      if (newXp >= needed(rec.level)) newLevel++;
      const updated = await prisma.level.update({ where: key, data: { xp: newXp, level: newLevel, lastMsgAt: new Date() } });
      if (updated.level > rec.level) {
        const cfg = await prisma.guildConfig.findUnique({ where: { guildId: message.guild.id } });
        const chId = cfg?.levelUpChannelId ?? message.channel.id;
        const ch = await message.guild.channels.fetch(chId).catch(()=>null);
        if (ch && 'send' in ch) (ch as any).send(`🎉 <@${message.author.id}> reached level **${updated.level}**!`);
      }
    }
  }
};
