import type { APIApplicationCommandOption } from "discord-api-types/v10";
import type { ChatInputCommandInteraction } from "discord.js";
import { HibikiCommand } from "../../classes/Command.js";
import fetch from "../../utils/fetch.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

export class CuddleCommand extends HibikiCommand {
  description = "Cuddle with another server member!";
  options: APIApplicationCommandOption[] = [
    {
      type: ApplicationCommandOptionType.User,
      name: "member",
      description: "The member to cuddle with.",
      required: true,
    },
  ];

  public async runWithInteraction(interaction: ChatInputCommandInteraction) {
    // Gets the member to roleplay with
    const member = await interaction.options.getUser(this.options[0].name)?.fetch();

    // Sends if no member exists
    if (!member) {
      await interaction.followUp({
        embeds: [
          {
            title: interaction.getString("global.ERROR"),
            description: interaction.getString("global.ERROR_NO_MEMBER_PROVIDED"),
            color: this.bot.config.colours.error,
          },
        ],
      });

      return;
    }

    // Fetches a random gif and falls back to a static one
    let image = "https://purrbot.site/img/sfw/cuddle/gif/cuddle_024.gif";
    const response = await fetch("https://purrbot.site/api/img/sfw/cuddle/gif");
    const body = await response?.json();
    if (body?.link) image = body.link;

    await interaction.followUp({
      embeds: [
        {
          description: interaction.getString("roleplay.COMMAND_CUDDLE_DESCRIPTION", {
            author: interaction.user.username,
            member: member.username,
          }),
          image: {
            url: image,
          },
          color: this.bot.config.colours.primary,
        },
      ],
    });
  }
}