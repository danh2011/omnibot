
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(o=>o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild?.members.fetch(user.id).catch(()=>null);
    if (!member) return interaction.reply({ content: 'User not in this guild.', ephemeral: true });
    await member.kick(reason);
    await interaction.reply(`Kicked **${user.tag}** for: ${reason}`);
  }
};
