const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
        .setThumbnail('https://media.discordapp.net/attachments/1035667476601655348/1222234794767814806/Untitled-4.png?ex=661579db&is=660304db&hm=26ef04faec9d5553842745ff67ac1d51fd7ce298e879d94965deff01199ab92e&=&format=webp&quality=lossless&width=683&height=683')
        .setTitle('قوانين السيرفر')
        .setDescription('**جميع القوانين التابعه لاست بليس نرجوا منك إتباع جميع القوانين لكي لا يتم محاسبتك**')
        .setImage('https://media.discordapp.net/attachments/1035667476601655348/1222234795321593958/1_Comp_1_2022-10-01_21.36.25.png?ex=661579db&is=660304db&hm=a6eb4f5dc9336baafcf54e000067751a2bfd886478f0e7ceb8f4b16ddd5eedf9&=&format=webp&quality=lossless&width=1214&height=683')
        .setFooter({ text: 'Rules Bot' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Rules Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
