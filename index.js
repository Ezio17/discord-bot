const botconfin = require('./src/botconfig.json');
const Discord = require('discord.js');
import cityCountryArray from './src/countryCity';
let city_country = cityCountryArray;
let usedWordsInGame = [];

const bot = new Discord.Client();

bot.on('ready', async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setGame('Deceit');
});

bot.on('message', async message => {
  if (message.author.bot) {
    return;
  }

  const prefix = botconfin.prefix;
  let messageArray = message.content.split(' ');
  let cmd = messageArray[0];
  let text = messageArray.splice(1);

  if (cmd === `${prefix}say`) {
    return message.channel.send(`${text.join(' ')}`);
  }

  if (cmd === `${prefix}steam`) {
    return message.channel.send(
      'Это стим создателя https://steamcommunity.com/profiles/76561198078777692/'
    );
  }

  if (cmd === `${prefix}botinfo`) {
    let botIcon = bot.user.displayAvatarURL;
    let botEmbed = new Discord.RichEmbed()
      .setDescription('Информация о мне')
      .setColor('#4d87e3')
      .setThumbnail(botIcon)
      .addField('Я был назван:', bot.user.username)
      .addField('Я был создан:', bot.user.createdAt.toString())
      .addField('Мой создатель <3', '~E z i O~');

    return message.channel.send(botEmbed);
  }

  if (cmd === `${prefix}serverinfo`) {
    let serverIcon = message.guild.iconURL;
    let serverEmbed = new Discord.RichEmbed()
      .setDescription(`Меня зовут ${bot.user.username} и я Вам расскажу об этом сервере`)
      .setColor('#e65050')
      .setThumbnail(serverIcon)
      .addField('Имя сервера:', message.guild.name)
      .addField('Сервер был зачат:', message.guild.joinedAt)
      .addField('Здесь проживает вот столько людей:', `${message.guild.memberCount}`)
      .addField('Ты появился здесь:', message.member.joinedAt);

    return message.channel.send(serverEmbed);
  }

  if (cmd === '@here') {
    let phraseHere = [
      'Ну вот зачем ты всех отвлекаешь?',
      'Ты никому не нужен, зачем ты пишешь?',
      'А ну быстро ответили ему!',
    ].sort(() => 0.5 - Math.random());

    return message.channel.send(`${phraseHere[0]}`);
  }

  if (cmd === `${prefix}г`) {
    if (message.content === `${prefix}г рестарт`) {
      return;
    }

    if (usedWordsInGame.some(word => word.toLowerCase().includes(text.join('').toLowerCase()))) {
      return message.channel.send('Оууу... Это слово уже было использовано, выбери другое.');
    }

    let lastLetterBotsWord = usedWordsInGame
      .slice(-1)
      .join('')
      .split('')
      .slice(-1);
    let firstLetterPeopleWord = text
      .join('')
      .split('')
      .slice(0, 1);

    console.log(lastLetterBotsWord, firstLetterPeopleWord);

    if (lastLetterBotsWord.length > 0) {
      if (
        lastLetterBotsWord.join('').toUpperCase() !== firstLetterPeopleWord.join('').toUpperCase()
      ) {
        return message.channel.send(
          `Не на ту букву начал слово. Тебе нужно на ${lastLetterBotsWord}`
        );
      }
    }

    // let checkWord = city_country.filter(word => word.toLowerCase() === text.join('').toLowerCase());

    // if (checkWord.length === 0) {
    //   return message.channel.send(`Такой стары или столицы нет :(`);
    // }

    city_country = city_country.filter(city => city.toLowerCase() !== text.join('').toLowerCase());

    let lastLetter = message.content.slice(-1);
    let filterCityOnLastLetter = city_country
      .filter(city => city.charAt(0) === lastLetter)
      .sort(() => 0.5 - Math.random());

    if (filterCityOnLastLetter.length === 0) {
      return message.channel.send(
        `Упссс... Я похоже проиграл ;(  Я не знаю слов на эту букву, если хочешь продолжить назви другое слово или давай начнём сначала, для этого пропиши !р. А может слово закончилось на букву на которою не начинаються слова, тогда напиши это слово без этой буквы <3`
      );
    }

    let botWord = filterCityOnLastLetter[0];
    let botWordUpperCase = botWord.charAt(0).toUpperCase() + botWord.slice(1);

    city_country = city_country.filter(
      city => city.toLowerCase() !== botWordUpperCase.toLowerCase()
    );

    usedWordsInGame.push(text.join(''), botWordUpperCase);

    return message.channel.send(`${botWordUpperCase}`);
  }

  if (cmd === `${prefix}р`) {
    city_country = cityCountryArray;
    usedWordsInGame = [];
    return message.channel.send(
      'Ну погнали заново ;). Только давай играть честно. Я буду называть только страны и их столицы, но ты можешь ещё любые города.'
    );
  }
});

bot.login(process.env.BOT_TOKEN);
