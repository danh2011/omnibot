
import { Events, EmbedBuilder } from 'discord.js';
import { prisma } from '../lib.prisma.js';

export default {
  name: 'logEvents',
  register(client) {
    client.on(Events.MessageDelete, async (msg) => {
      if (!msg.guild || msg.author?.bot) return;
      const cfg = await prisma.guildConfig.findUnique({ where: { guildId: msg.guild.id } });
      if (!cfg?.logChannelId) return;
      const ch = msg.guild.channels.cache.get(cfg.logChannelId);
      if (ch && 'send' in ch) (ch as any).send({ embeds: [new EmbedBuilder().setTitle('🗑️ Message Deleted').addFields(
        { name: 'Author', value: `${msg.author?.tag ?? 'Unknown'} (${msg.author?.id ?? 'n/a'})` },
        { name: 'Channel', value: `<#${msg.channelId}>` },
        { name: 'Content', value: msg.content?.slice(0,1024) || '*no content*' }
      ).setTimestamp(new Date())] });
    });
    client.on(Events.MessageUpdate, async (_old, msg) => {
      if (!msg.guild || msg.author?.bot) return;
      const cfg = await prisma.guildConfig.findUnique({ where: { guildId: msg.guild.id } });
      if (!cfg?.logChannelId) return;
      const ch = msg.guild.channels.cache.get(cfg.logChannelId);
      if (ch && 'send' in ch) (ch as any).send({ embeds: [new EmbedBuilder().setTitle('✏️ Message Edited')
        .addFields({ name: 'Author', value: `${msg.author?.tag} (${msg.author?.id})` }, { name: 'Channel', value: `<#${msg.channelId}>` })
        .setURL(msg.url).setTimestamp(new Date())] });
    });
  }
};
