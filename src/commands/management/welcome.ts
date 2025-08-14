
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Test/send a welcome message')
    .addUserOption(o=>o.setName('user').setDescription('User to simulate').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const cfg = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guildId! } });
    if (!cfg?.welcomeChannelId) return interaction.reply({ content: 'Set welcomeChannelId with /config set.', ephemeral: true });
    const ch = interaction.guild?.channels.cache.get(cfg.welcomeChannelId);
    if (!ch || !('send' in ch)) return interaction.reply({ content: 'Configured channel not found.', ephemeral: true });
    const msg = (cfg.welcomeMessage ?? 'Welcome {user} to {guild}!').replace('{user}', `<@${user.id}>`).replace('{guild}', interaction.guild!.name);
    await (ch as any).send({ content: msg });
    await interaction.reply({ content: 'Welcome message sent.', ephemeral: true });
  }
};
