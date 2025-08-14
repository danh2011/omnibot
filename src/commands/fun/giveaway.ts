
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a simple giveaway')
    .addStringOption(o=>o.setName('prize').setDescription('Prize').setRequired(true))
    .addIntegerOption(o=>o.setName('minutes').setDescription('Duration in minutes').setRequired(true))
    .addIntegerOption(o=>o.setName('winners').setDescription('Number of winners').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const prize = interaction.options.getString('prize', true);
    const minutes = interaction.options.getInteger('minutes', true);
    const winners = interaction.options.getInteger('winners') ?? 1;
    const endsAt = new Date(Date.now() + minutes*60*1000);
    const entryBtn = new ButtonBuilder().setCustomId('g_enter').setLabel('Enter').setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(entryBtn);
    const embed = new EmbedBuilder().setTitle('🎉 Giveaway').addFields(
      { name: 'Prize', value: prize, inline: true },
      { name: 'Ends', value: `<t:${Math.floor(endsAt.getTime()/1000)}:R>`, inline: true },
      { name: 'Winners', value: String(winners), inline: true }
    );
    const msg = await interaction.reply({ embeds:[embed], components:[row], fetchReply: true });
    await prisma.giveaway.create({ data: { guildId: interaction.guildId!, channelId: interaction.channelId, messageId: msg.id, prize, endsAt, createdBy: interaction.user.id, winners } });
    const entrants = new Set<string>();
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: minutes*60*1000 });
    collector.on('collect', i => {
      if (i.customId !== 'g_enter') return i.deferUpdate();
      entrants.add(i.user.id);
      i.reply({ content: 'You are in! 🎉', ephemeral: true });
    });
    collector.on('end', async () => {
      const arr = [...entrants];
      if (arr.length === 0) return interaction.editReply({ content: 'No entries. 😢', components: [], embeds: [] });
      const winCount = Math.min(winners, arr.length);
      const winnersList = [];
      while (winnersList.length < winCount) {
        const idx = Math.floor(Math.random()*arr.length);
        const pick = arr.splice(idx,1)[0];
        winnersList.push(`<@${pick}>`);
      }
      await interaction.editReply({ content: `Winners: ${winnersList.join(', ')} — Prize: **${prize}**`, components: [], embeds: [] });
    });
  }
};
