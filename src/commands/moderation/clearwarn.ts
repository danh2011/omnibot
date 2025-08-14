
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Clear all warnings for a user')
    .addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const count = await prisma.warn.deleteMany({ where: { guildId: interaction.guildId!, userId: user.id } });
    await interaction.reply(`Cleared ${count.count} warnings for **${user.tag}**.`);
  }
};
