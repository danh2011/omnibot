
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('List user warnings')
    .addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const warns = await prisma.warn.findMany({ where: { guildId: interaction.guildId!, userId: user.id }, orderBy: { createdAt: 'desc' } });
    const embed = new EmbedBuilder().setTitle(`Warnings for ${user.tag}`)
      .setDescription(warns.length ? warns.map(w => `• ${w.reason} — <t:${Math.floor(w.createdAt.getTime()/1000)}:R>`).join('\n') : 'No warnings.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
