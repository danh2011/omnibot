
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(o=>o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild?.members.fetch(user.id).catch(()=>null);
    if (!member) return interaction.reply({ content: 'User not in this guild.', ephemeral: true });
    await member.ban({ reason });
    await interaction.reply(`Banned **${user.tag}** for: ${reason}`);
  }
};
