
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);
    await prisma.warn.create({
      data: {
        guildId: interaction.guildId!,
        userId: user.id,
        modId: interaction.user.id,
        reason
      }
    });
    await interaction.reply(`Warned **${user.tag}**: ${reason}`);
  }
};
