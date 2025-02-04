/**
 * @file BotGuildUpdate
 * @description Logs when added or removed from a guild
 * @module BotGuildUpdateEvent
 */

import { HibikiEvent } from "../classes/Event.js";
import { logger } from "../utils/logger.js";
import { createFullTimestamp } from "../utils/timestamp.js";
import { ChannelType, EmbedField, Guild } from "discord.js";

export class HibikiBotGuildUpdateEvent extends HibikiEvent {
  events: HibikiEventEmitter[] = ["guildCreate", "guildDelete"];

  public async run(event: HibikiEventEmitter, guild: Guild) {
    if (!guild) return;

    // Tries to get the guild owner
    const owner = await guild
      .fetchOwner()
      .then((guildOwner) => {
        return guildOwner;
      })
      .catch(() => {
        return;
      });

    // Logs when added or removed to a guild
    const isGuildCreate = event === "guildCreate";
    logger.info(`${isGuildCreate ? "Added to" : "Removed from"} guild: ${guild.name} (${guild.id}).`);

    // Gets the logging channel information
    if (!this.bot.config.loggingChannelID) return;
    const channel = await this.bot.channels.fetch(this.bot.config.loggingChannelID);
    if (!channel || channel?.type !== ChannelType.GuildText) return;

    // The function to get strings
    const getStringFunction = this.bot.localeSystem.getLocaleFunction(this.bot.config.defaultLocale);

    /**
     * Logs to the logging channel ID on guildCreate
     */

    if (event === "guildCreate") {
      try {
        // Empty fields array
        const fields: EmbedField[] = [];

        fields.push(
          {
            // Guild ID
            name: getStringFunction("global.ID"),
            value: guild.id,
            inline: false,
          },
          {
            // Guild creation date
            name: getStringFunction("global.CREATED_ON"),
            value: createFullTimestamp(guild.createdAt),
            inline: false,
          },
        );

        // Guild owner
        if (owner) {
          fields.push({
            name: getStringFunction("global.OWNER"),
            value: `${owner.user.tag} (${owner.user.id})`,
            inline: false,
          });
        }

        // Guild member count
        if (guild.memberCount) {
          fields.push({
            name: getStringFunction("global.MEMBERS"),
            value: guild.memberCount.toString(),
            inline: false,
          });
        }

        // Sends info
        await channel.send({
          embeds: [
            {
              title: getStringFunction("global.ADDED_TO_GUILD", { guild: guild.name }),
              color: this.bot.config.colours.success,
              fields: fields,
              image: {
                url: guild.bannerURL({ size: 1024 }) ?? "",
              },
              thumbnail: {
                url: guild.iconURL({ size: 1024 }) ?? "",
              },
            },
          ],
        });
      } catch (error) {
        logger.error(`Error while logging guildCreate info to the logging channel: ${error}`);
      }
    }

    /**
     * Logs to the logging channel ID on guildDelete
     */

    if (event === "guildDelete") {
      try {
        // Empty fields array
        const fields: EmbedField[] = [];

        fields.push(
          {
            // Guild ID
            name: getStringFunction("global.ID"),
            value: guild.id,
            inline: false,
          },
          {
            // Guild creation date
            name: getStringFunction("global.CREATED_ON"),
            value: createFullTimestamp(guild.createdAt),
            inline: false,
          },
        );

        // Guild owner
        if (owner) {
          fields.push({
            name: getStringFunction("global.OWNER"),
            value: `${owner.user.tag} (${owner.user.id})`,
            inline: false,
          });
        }

        // Guild member count
        if (guild.memberCount) {
          fields.push({
            name: getStringFunction("global.MEMBERS"),
            value: guild.memberCount.toString(),
            inline: false,
          });
        }

        // Sends info
        await channel.send({
          embeds: [
            {
              title: getStringFunction("global.REMOVED_FROM_GUILD", { guild: guild.name }),
              color: this.bot.config.colours.error,
              fields: fields,
              image: {
                url: guild.bannerURL({ size: 1024 }) ?? "",
              },
              thumbnail: {
                url: guild.iconURL({ size: 1024 }) ?? "",
              },
            },
          ],
        });
      } catch (error) {
        logger.error(`Error while logging guildDelete info to the logging channel: ${error}`);
      }
    }
  }
}
