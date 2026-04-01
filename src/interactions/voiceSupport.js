const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings } = require('../services/guildSettingsStore');

const managedChannels = new Set();

async function handleVoiceStateUpdate(oldState, newState) {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;

  const settings = getGuildSettings(guild.id);
  if (!settings.modules.voice) return;

  const waitingRoomId = settings.channels.voiceWaitingRoomId;
  const categoryId = settings.channels.voiceCategoryId;

  if (!waitingRoomId || !categoryId) return;

  const joinedChannelId = newState.channelId;
  const oldChannelId = oldState.channelId;

  if (joinedChannelId === waitingRoomId && oldChannelId !== waitingRoomId) {
    const member = newState.member;
    if (!member) return;

    const channel = await guild.channels.create({
      name: `🔊 ${member.user.username}`,
      type: ChannelType.GuildVoice,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel],
        },
      ],
      reason: `Voice Support Raum für ${member.user.tag}`,
    });

    managedChannels.add(channel.id);
    await newState.setChannel(channel);
    return;
  }

  const leftChannel = oldState.channel;
  if (!leftChannel) return;

  if (managedChannels.has(leftChannel.id) && leftChannel.members.size === 0) {
    managedChannels.delete(leftChannel.id);
    await leftChannel.delete('Temporärer Voice Support Raum leer');
  }
}

module.exports = {
  handleVoiceStateUpdate,
};
