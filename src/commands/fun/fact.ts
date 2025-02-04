import type { APIApplicationCommandOption } from "discord-api-types/v10";
import type { ChatInputCommandInteraction } from "discord.js";
import { HibikiCommand } from "../../classes/Command.js";
import fetch from "../../utils/fetch.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

export class FactCommand extends HibikiCommand {
  description = "Get a random fact.";

  options: APIApplicationCommandOption[] = [
    {
      name: "category",
      description: "The category of fact to get.",
      required: false,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Cat",
          value: "cat",
        },
        {
          name: "Dog",
          value: "dog",
        },
        {
          name: "Random",
          value: "random",
        },
      ],
    },
  ];

  public async runWithInteraction(interaction: ChatInputCommandInteraction) {
    // An array of API information to fetch
    const factApis = [
      {
        url: "https://catfact.ninja/fact",
        category: "cat",
        factObject: "fact",
      },
      {
        url: "https://dog-api.kinduff.com/api/facts",
        category: "dog",
        factObject: "facts",
      },
      {
        url: "https://useless-facts.sameerkumar.website/api",
        category: "random",
        factObject: "data",
      },
    ];

    // Gets the fact category and what API to query
    const category = interaction.options.getString(this.options[0].name) || "random";
    const api = factApis.find((a) => a.category === category) || factApis[Math.floor(Math.random() * factApis.length)];

    // Fetches the fact information
    const response = await fetch(api.url);
    const body = await response?.json();
    let fact;

    // Figures out what to set the fact info to
    if (body?.["facts"]) fact = body["facts"][0];
    else if (body?.["data"]) fact = body?.["data"];
    else if (body?.["fact"]) fact = body?.["fact"];

    // Sends if no fact was found
    if (!body || !fact) {
      await interaction.followUp({
        embeds: [
          {
            title: interaction.getString("global.ERROR"),
            description: interaction.getString("fun.COMMAND_FACT_ERROR"),
            color: this.bot.config.colours.error,
          },
        ],
      });

      return;
    }

    // todo type
    const messageResponse = {
      embeds: [
        {
          title: interaction.getString("fun.COMMAND_FACT_TITLE"),
          description: fact,
          color: this.bot.config.colours.primary,
        },
      ],
    };

    await interaction.followUp(messageResponse);
  }
}
