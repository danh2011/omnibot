
import { Events } from 'discord.js';
import { prisma } from '../lib.prisma.js';

export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const cfg = await prisma.guildConfig.findUnique({ where: { guildId: member.guild.id } });
    if (!cfg?.welcomeChannelId) return;
    const ch = member.guild.channels.cache.get(cfg.welcomeChannelId);
    if (ch && 'send' in ch) {
      const msg = (cfg.welcomeMessage ?? 'Welcome {user} to {guild}!')
        .replace('{user}', `<@${member.id}>`)
        .replace('{guild}', member.guild.name);
      (ch as any).send(msg);
    }
  }
};
