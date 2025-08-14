
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure server settings')
    .addSubcommand(sc=>sc.setName('set')
      .setDescription('Set a key/value')
      .addStringOption(o=>o.setName('key').setDescription('logChannelId|welcomeChannelId|welcomeMessage|levelUpChannelId').setRequired(true))
      .addStringOption(o=>o.setName('value').setDescription('Value').setRequired(true)))
    .addSubcommand(sc=>sc.setName('show').setDescription('Show current config'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: 'Guild only.', ephemeral: true });
    const sub = interaction.options.getSubcommand();
    if (sub === 'show') {
      const cfg = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guildId } });
      return interaction.reply({ content: '```json\n'+JSON.stringify(cfg ?? {}, null, 2)+'\n```', ephemeral: true });
    }
    const key = interaction.options.getString('key', true);
    const value = interaction.options.getString('value', true);
    const data: any = {};
    data[key] = value;
    const cfg = await prisma.guildConfig.upsert({
      where: { guildId: interaction.guildId },
      update: data,
      create: { guildId: interaction.guildId, ...data }
    });
    await interaction.reply({ content: `Updated \`${key}\`.`, ephemeral: true });
  }
};
