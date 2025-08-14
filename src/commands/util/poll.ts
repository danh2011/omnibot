
import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a quick poll (up to 5 options)')
    .addStringOption(o=>o.setName('question').setDescription('Question').setRequired(true))
    .addStringOption(o=>o.setName('options').setDescription('Comma separated options (2-5)').setRequired(true)),
  async execute(interaction) {
    const q = interaction.options.getString('question', true);
    const options = interaction.options.getString('options', true).split(',').map(s=>s.trim()).filter(Boolean).slice(0,5);
    if (options.length < 2) return interaction.reply({ content: 'Provide at least 2 options.', ephemeral: true });

    const select = new StringSelectMenuBuilder().setCustomId('poll').setPlaceholder('Vote').addOptions(
      options.map((o,i)=>({ label: o, value: String(i) }))
    );
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    const embed = new EmbedBuilder().setTitle('📊 '+q).setDescription('Vote using the menu below.');
    const msg = await interaction.reply({ embeds:[embed], components:[row], fetchReply: true });
    const tally = new Map<string, Set<string>>();
    options.forEach((_o,i)=>tally.set(String(i), new Set()));

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15*60*1000 });
    collector.on('collect', i => {
      if (i.customId !== 'poll') return i.deferUpdate();
      // each user can have one vote; remove previous
      for (const set of tally.values()) set.delete(i.user.id);
      tally.get(i.values[0])?.add(i.user.id);
      i.reply({ content: 'Vote recorded.', ephemeral: true });
    });
    collector.on('end', async () => {
      const results = options.map((o,i)=>`**${o}** — ${tally.get(String(i))?.size ?? 0} votes`).join('\n');
      await interaction.editReply({ embeds:[EmbedBuilder.from(embed).setDescription(results)], components: [] });
    });
  }
};
