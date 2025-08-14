
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a private support thread')
    .addStringOption(o=>o.setName('subject').setDescription('Short subject').setRequired(true)),
  async execute(interaction) {
    if (!interaction.channel || !interaction.channel.isTextBased()) return interaction.reply({ content: 'Run in a text channel.', ephemeral: true });
    const subject = interaction.options.getString('subject', true);
    const thread = await (interaction.channel as any).threads.create({
      name: `ticket-${interaction.user.username}-${Date.now().toString().slice(-4)}`,
      reason: subject,
      invitable: false,
      type: 12
    });
    await thread.members.add(interaction.user.id);
    await interaction.reply({ content: `Opened ${thread.toString()}`, ephemeral: true });
    await thread.send(`New ticket by <@${interaction.user.id}> — **${subject}**`);
  }
};
