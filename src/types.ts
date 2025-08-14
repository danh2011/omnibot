
import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export type SlashCommand = {
  data: any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
  guildOnly?: boolean;
  defaultMemberPermissions?: bigint;
};
