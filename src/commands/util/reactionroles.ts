
import { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rolesmenu')
    .setDescription('Create a reaction role menu (select)')
    .addStringOption(o=>o.setName('label1').setDescription('Role 1 label').setRequired(true))
    .addRoleOption(o=>o.setName('role1').setDescription('Role 1').setRequired(true))
    .addStringOption(o=>o.setName('label2').setDescription('Role 2 label').setRequired(false))
    .addRoleOption(o=>o.setName('role2').setDescription('Role 2').setRequired(false))
    .addStringOption(o=>o.setName('label3').setDescription('Role 3 label').setRequired(false))
    .addRoleOption(o=>o.setName('role3').setDescription('Role 3').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const entries: {label: string, roleId: string}[] = [];
    for (let i=1;i<=3;i++) {
      const label = interaction.options.getString(`label${i}` as any);
      const role = interaction.options.getRole(`role${i}` as any);
      if (label && role) entries.push({ label, roleId: role.id });
    }
    if (!entries.length) return interaction.reply({ content: 'Provide at least one role.', ephemeral: true });
    const menu = new StringSelectMenuBuilder().setCustomId('roleselect').setMinValues(0).setMaxValues(entries.length).addOptions(entries.map(e=>({ label: e.label, value: e.roleId })));
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
    await interaction.reply({ content: 'Select roles:', components: [row] });
  }
};
