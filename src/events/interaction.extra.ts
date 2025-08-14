
import { Events } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'roleselect') return;
    const selected = new Set(interaction.values);
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    const rolesToToggle = interaction.component.options.map(o=>o.value);
    for (const rid of rolesToToggle) {
      if (selected.has(rid)) await member.roles.add(rid).catch(()=>{});
      else await member.roles.remove(rid).catch(()=>{});
    }
    await interaction.reply({ content: 'Roles updated.', ephemeral: true });
  }
};
