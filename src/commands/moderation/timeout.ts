
import { SlashCommandBuilder, PermissionFlagsBits, TimeSpan } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o=>o.setName('minutes').setDescription('Minutes (1-10080)').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const minutes = interaction.options.getInteger('minutes', true);
    if (minutes < 1 || minutes > 10080) return interaction.reply({ content: 'Minutes must be 1-10080.', ephemeral: true });
    const reason = interaction.options.getString('reason') ?? 'No reason';
    const member = await interaction.guild?.members.fetch(user.id).catch(()=>null);
    if (!member) return interaction.reply({ content: 'User not in this guild.', ephemeral: true });
    const ms = minutes * 60 * 1000;
    await member.timeout(ms, reason);
    await interaction.reply(`Timed out **${user.tag}** for ${minutes}m. Reason: ${reason}`);
  }
};
