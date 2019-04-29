const Discord = require('discord.js');
var bot = new Discord.Client();
var client = new Discord.Client();
var prefix = ("-");
const YTDL = require("ytdl-core");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter);
const talkedRecently = new Set();
const cooldown = new Set();
const fs = require("fs");
bot.login(process.env.TOKEN);
client.login(process.env.TOKEN);
db.defaults({ histoires: [], xp: []}).write();

fs.readdir("./commandes/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(`TEXTE  ERREUR`);
      return;
    }

     jsfile.forEach((f, i) =>{
      let ticketjs = require(`./commandes/ticket.js`);
      console.log(`File ${f} is fully loaded!`);
      client.commandes.set(ticketjs.ticket.name, ticketjs);
    });
  });

client.on("message", message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commandes.get(cmd.slice("1"));
    if(commandfile) commandfile.run(client, message, args);
  });

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var servers = {};

bot.on("ready", function() {
    bot.user.setActivity(`-help | ${bot.guilds.size} serveurs | ${bot.users.size} utilisateurs`);
    console.log("AzerBot initié et prêt à servir ${client.guilds.size} serveurs dont ${client.users.size} utilisateurs !");

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  /*if (message.content.toLowerCase().startsWith(prefix + `ticket help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Vulnix Help`)
    .setColor(0xCF40FA)
    .setDescription(`Hello! I'm Vulnix, the Discord bot for super cool support ticket stuff and more! Here are my commands:`)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about Vulnix`)
    message.channel.send({ embed: embed });
  }*/

  /*if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hoold on!`).then(m => {
    m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });
}*/

if (message.content.toLowerCase().startsWith(prefix + `ticket open`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support")) return message.channel.send(`Veuillez créer un rôle nommé Support !`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Vous avez déjà un ticket d'ouvert.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Support");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(":white_check_mark: Votre ticket a bien été créé, " + c.toString() + ".");
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Yop ${message.author.username}!`, `Veuillez expliquer votre problème en fournissant le plus de détails possible. Notre équipe fera son possible pour vous aider.`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `ticket close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Vous devez executer cette commande dans le canal du ticket à fermer.`);

    message.channel.send(`Êtes-vous sûr ? \nAfin de confirmer, envoyez \`CONFIRMER\`. Vous avez 30 secondes pour confirmer.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Le délais de confirmation est dépassé, le ticket ne sera pas fermé.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

//bot.on("message", function(message) {
client.on("message", async message => {
    if (message.author.equals(bot.user)) return;
	
    if (!message.content.startsWith(prefix)) return;
    
    var args = message.content.substring(prefix.length).split(" ");
    
    switch (args[0].toLowerCase()) {

case "play":
	var playembed = new Discord.RichEmbed()
		.setDescription(`Cette commande est temporairement indisponible en raison d'erreurs.`)
	message.channel.sendEmbed(playembed)
break;
case "ping":
          const m = await message.channel.send("Ping?");
          m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms. Le temps de latence de l'API discord est de ${Math.round(client.ping)}ms`);
break;
case "skip":
	var skipembed = new Discord.RichEmbed()
		.setDescription(`Cette commande est temporairement indisponible en raison d'erreurs.`)
	message.channel.sendEmbed(skipembed)
break;
case "stop":
	var stopembed = new Discord.RichEmbed()
		.setDescription(`Cette commande est temporairement indisponible en raison d'erreurs.`)
	message.channel.sendEmbed(stopembed)
break;
case "help":
//Correctly Indented
		var embede = new Discord.RichEmbed()
			.setDescription(`${message.author.username}, Voici la liste des commandes:`)
			.addField(`Divertissement`, "`\n-8ball\n-sondage`")
			.addField("Utilitaire", "`\n-profil\n-serverinfo\n-botinfo\n-id\n-ping\n-invite`")
			.addField(`Modération`, "`\n-ban\n-kick\n-clear`", true)
			.addField(`Administration`, "`\n-sondage\n-say\n-annonce`")
			.addField(`Commandes désactivés`, "`\n-play\n-skip\n-stop`", true)
			.addField(`Prochainement`, "`\n-ticket help`")
			.addField(`Support`, "[[Clique ici pour accéder au support du Bot]](https://discord.gg/Jrbw2Zh)")
			.setFooter("AzerBot - By [Azrty](https://azrty.com)")
			.setTimestamp()
			.setColor("0xDF7401")
		message.author.sendEmbed(embede)
		message.react("✉")
		message.reply("La liste des commandes vous a bien été envoyé en MP ! :envelope:")
break;
/*case "say":
	if(message.member.hasPermission("ADMINISTRATOR")) {
		message.delete();
		let args = message.content.split(" ").slice(1);
		let thingToEcho = args.join(" ")
		message.channel.send(thingToEcho)
	} else {
		message.reply(`Tu n'as pas la permission de faire cette commande.`)}
break;*/
case "serverinfo":
	var embedee = new Discord.RichEmbed()
		.setDescription("Informations du serveur")
		.addField("Nom du Discord", message.guild.name)
		.addField("Crée le", message.guild.createdAt)
		.addField("Tu as rejoin le", message.member.joinedAt)
		.addField("Utilisateurs sur le discord", message.guild.memberCount)
		.addField("Nombre de canaux sur ce serveur", `${message.guild.channels.size}`)
		.setColor("0xFE2E64")
	message.channel.sendEmbed(embedee)
break;
case "sondage":
	if (message.member.hasPermission("MANAGE_MESSAGES")) {
		let args = message.content.split(" ").slice(1);
		let thingToEcho = args.join(" ")
		if (!thingToEcho) return message.reply("Merci d'envoyer une question pour le sondage")
		if (!message.guild.channels.find("name", "sondage")) return message.reply("Le channel sondage est introuvable. merci de crée ce channel pour que celui-ci marche.")
		var embedeee = new Discord.RichEmbed()
			.setDescription("Sondage")
			.addField(thingToEcho, "Répondre avec :white_check_mark: ou :x:")
			.setColor("0xB40404")
			.setTimestamp()
		message.channel.sendMessage("Votre sondage a bien été envoyé dans " + message.guild.channels.find("name", "sondage").toString() + ".")
		message.guild.channels.find("name", "sondage").sendEmbed(embedeee)
			.then(function (message) {
				message.react("✅")
				message.react("❌")
		}).catch(function() {
		});
	}else{
		return message.reply("Tu n'as pas la permission.")}
break;
/*case "kick":
           let command = message.content.split(" ")[0];
           const args = message.content.slice(prefix.length).split(/ +/);
           command = args.shift().toLowerCase();
    
               if(!message.member.hasPermission("KICK_MEMBERS")) {
                   return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
               }
               if(message.mentions.users.size === 0) {
                   return message.reply("Merci de mentionner l'utilisateur à expluser.").catch(console.error);
               }
               let kickMember = message.guild.member(message.mentions.users.first());
               if(!kickMember) {
                   return message.reply("Cet utilisateur est introuvable ou impossible à expulser.")
               }
               if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
                   return message.reply("Je n'ai pas la permission KICK_MEMBERS pour faire ceci.").catch(console.error);
               }
               kickMember.kick().then(member => {
                   message.reply(`${member.user.username} a été expulsé avec succès.`).catch(console.error);
                   message.guild.channels.find("name", "general").send(`**${member.user.username}** a été expulsé du discord par **${message.author.username}**`)
               }).catch(console.error)
break;
case "ban":
           let commande = message.content.split(" ")[0];
           const argse = message.content.slice(prefix.length).split(/ +/);
           commande = argse.shift().toLowerCase();
           if(!message.member.hasPermission("BAN_MEMBERS")) {
               return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
           }
	   if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
               return message.reply("Je n'ai pas la permission BAN_MEMBERS pour faire ceci.").catch(console.error);
           }
           const member = message.mentions.members.first();
           if (!member) return message.reply("Merci de mentionner l'utilisateur à bannir.");
           member.ban().then(member => {
               message.reply(`${member.user.username} a été banni avec succès.`).catch(console.error);
               message.guild.channels.find("name", "general").send(`**${member.user.username}** a été banni du discord par **${message.author.username}**`)
           }).catch(console.error)
break;*/
case "8ball":
           let argsed = message.content.split(" ").slice(1);
           let tte = argsed.join(" ")
           if (!tte){
               return message.reply("Merci de poser une question. :8ball:")};
    
               var replys = [
               "Oui.",
               "Non.",
               "Je ne sais pas.",
               "Peut-être.",
               "Probablement."
               ];
           
               let reponse = (replys[Math.floor(Math.random() * replys.length)])
               var ballembed = new Discord.RichEmbed()
               .setDescription(":8ball: 8ball")
               .addField("Question", tte)
               .addField("Réponse", reponse)
               .setColor("0x40FF00")
           message.channel.sendEmbed(ballembed)
break;
case "eval":
	if(message.member.id !== '335521075230277635'){
		return message.channel.send("Vous devez être **propriétaire du bot** pour effectuer cette commande !");
	}
	let command = message.content.slice(prefix.length);
	let split = command.split(" ");
	command = split[0];
	split.shift();
	let code = split.join(" ");
	try {
		let ev = require('util').inspect(eval(code));
		if (ev.length > 1950) {
			ev = ev.substr(0, 1950);
	}
	let token = process.env.TOKEN.replace(/\./g, "\.")
	let re = new RegExp(token, 'g') 
	ev = ev.replace(re, "*R-eD-Ac-Te-D-*");
	message.channel.sendMessage("**Input:**```js\n"+code+"```**Eval:**```js\n"+ev+"```")
        } catch(err) {
		message.channel.sendMessage('```js\n'+err+"```")
	}
break;
case "id":
               var idembed = new Discord.RichEmbed()
                   .setDescription(`Votre IDENTIFIANT/ID est ${message.author.id}`)
               message.channel.sendEmbed(idembed)
break;
case "invite":
               var inlembed = new Discord.RichEmbed()
                   .setDescription(`Il est désormais possible de m'inviter en [cliquant ici](https://discordapp.com/api/oauth2/authorize?client_id=434362960232579084&permissions=1610083399&scope=bot) (Lien: https://discordapp.com/api/oauth2/authorize?client_id=434362960232579084&permissions=1610083399&scope=bot)`)
               message.channel.sendEmbed(inlembed)
break;
case "clear":
        const prefixe = "-";
        const argss = message.content.split(" ").slice(1);
		message.delete()
           if(!argss[0]){
                        var err_code = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription('Tu n\'as pas précisé le nombre de messages !' + argss)
                        .setColor('#e74c3c')
                        message.channel.send(err_code);
                }else if(!message.member.hasPermission("MANAGE_MESSAGES")){
                        var err_code = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription('Tu n\'as pas la permission d\'executer cette commande !')
                        .setColor('#e74c3c')
                        message.channel.send(err_code);
                }else if(isNaN(argss[0])){
                        var err_code = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription('L\'argument donné n\'est pas un nombre !'  + argss)
                        .setColor('#e74c3c')
                        message.channel.send(err_code);
                }else if(parseInt(argss[0]) > 99){
                        var err_code = new Discord.RichEmbed()
                        .setTitle('Erreur')
                        .setDescription('Tu ne peux effacer que 99 messages max. !')
                        .setColor('#e74c3c')
                        message.channel.send(err_code);
                }else{
                        message.channel.fetchMessages()
                        .then(messages => {
                                try {
								message.channel.bulkDelete(parseInt(argss[0])).then(() => {
								var clear_code = new Discord.RichEmbed()
                                .setTitle('Succès :')
                                .setDescription(argss[0]+' message(s) ont été supprimé !')
                                .setColor('#8e44ad')
                                message.channel.send(clear_code).then(msg => msg.delete(3000));
								}).catch(error => message.channel.send("Vous pouvez seulement supprimer les messages datant de moins de 14 jours.").then(msg => msg.delete(3000)));
                                } catch (err) {
                                console.log(err);
                                }
                        })
                }
break;
case "annonce":
           if (message.member.hasPermission("MANAGE_MESSAGES")) {
               let args = message.content.split(" ").slice(1);
               let thingToEcho = args.join(" ")
               if (!thingToEcho) return message.reply("Tu dois mettre un message à ton annonce !")
               if (!message.guild.channels.find("name", "annonce")) return message.reply("Le channel annonce est introuvable. Merci de créer ce channel pour que celui-ci marche.")
               var embedeee = new Discord.RichEmbed()
                   .setTitle("Annonce")
                   .setDescription(thingToEcho)
                   .setColor("0xB40404")
                   .setTimestamp()
           message.channel.sendMessage("Votre annonce a bien été envoyé dans #annonce !")
           message.guild.channels.find("name", "annonce").sendEmbed(embedeee)
           }else{
              return message.reply("Tu n'as pas la permission.")}
break;
case "event":
           if (message.member.hasPermission("MANAGE_MESSAGES")) {
               let args = message.content.split(" ").slice(1);
               let thingToEcho = args.join(" ")
               if (!thingToEcho) return message.reply("Tu dois mettre un message !")
               if (!message.guild.channels.find("name", "event")) return message.reply("Le channel event est introuvable. Merci de créer ce channel pour que celui-ci marche.")
               var embedeee = new Discord.RichEmbed()
                   .setTitle("Évènement")
                   .setDescription(thingToEcho)
                   .setColor("0xB40404")
                   .setTimestamp()
           message.channel.sendMessage("Votre event a bien été envoyé dans #event !")
           message.guild.channels.find("name", "event").sendEmbed(embedeee)
           }else{
              return message.reply("Tu n'as pas la permission.")}
break;
case "botinfo":
               var embedbot = new Discord.RichEmbed()
                   .setDescription("Information")
                   .addField("Nombre de discord sur lequel je suis", `${bot.guilds.size} serveur(s)`)
                   .addField(`Nombre d'utilisateur(s) au total sur les ${bot.guilds.size} serveur(s) ou je suis`, `${bot.users.size} utilisateur(s)`)
                   .addField("Crée par", "[Azrty](http://azrty.com)")
                   .addField("Crée le", "04/04/2018")
                   .addField("Version", "1.0.0")
                   .setColor("0x81DAF5")
               message.channel.sendEmbed(embedbot)
break;
/*case "release":
           let xoargs = message.content.split(" ").slice(1);
           let xo03 = xoargs.join(" ")
           var xo01 = bot.channels.findAll('name', 'azerbot');
           var xo02 = message.guild.channels.find('name', 'azerbot');
           if(message.member.hasPermission("ADMINISTRATOR") || message.member.id === '204895667784704'){
		   if(!xo03) return message.reply("Merci d'écrire un message à envoyer à la globalité des discords.")

                        var replysg = [
                            '#F407FC', 
                            '#034EEF',
                            '#09F4D1',
                            '#09F14E',
                            '#E7EF07',
                            '#F5A718',
                            '#FB4B06',
                            '#FB2702',
                            '#F6F4F3',
                            '#201F1F'
                        ];
                    
                        let reponseg = (replysg[Math.floor(Math.random() * replysg.length)])
             
           var embedxo = new Discord.RichEmbed()
           .setColor(reponseg)
           .setTitle("Mise à jour !")
           .setDescription(xo03)
           .setFooter("AzerBot by Azrty")
           .setTimestamp()
       bot.channels.findAll('name', 'azerbot').map(channel => channel.send(embedxo))
            }else{
                message.reply(`Seul mon créateur peut effectuer cette action.`)}
break;*/
/*case "tempsondage":
                let argson = message.content.split(" ").slice(1);
                let thingToEchon = argson.join(" ")
                if (!thingToEchon) return message.reply("Merci d'envoyer une question pour le sondage temporaire de 5 minutes")
                if (!message.guild.channels.find("name", "sondage-temp")) return message.reply("Erreur: le channel `sondage-temp` est introuvable, il est nécéssaire de le créer pour effectuer cette commande.");
                if (message.channel.name !== 'sondage-temp') { return message.reply("Cette commande ne se fait pas ici, elle se fait dans `sondage-temp`");
                }else{
                message.delete()
                if (cooldown.has(message.author.id)) return message.author.send(`**[ Command __tempsondage__ via le discord __${message.guild.name}__ ]** Veuillez attendre 12 heures avant de re-éffectuer cette commande.`);
            
            
                    cooldown.add(message.author.id);
            
                    setTimeout(() => {
            
                      cooldown.delete(message.author.id);
            
                    }, 43200000);
                setTimeout(() => message.guild.channels.find("name", "sondage-temp").send(`Le sondage de ${message.author.username} vient d'expirer.`), 10000)
                var embedeeeon = new Discord.RichEmbed()
                    .setDescription("Sondage Temporaire")
                    .addField(thingToEchon, "Répondre avec :white_check_mark: ou :x:")
                    .addField("Fin du sondage dans", "Moin de 5 minutes")
                    .setColor("0xFF00FF")
                    .setFooter(`Requête de ${message.author.username}`)
                    .setTimestamp()
                message.channel.sendEmbed(embedeeeon)
                .then(function (message) {
                message.react("✅")
                message.react("❌")
                setTimeout(() => message.delete(), 300000)
                if (talkedRecently.has(message.author)) {
                    message.delete()
                } else {
                talkedRecently.add(message.author);
                setTimeout(() => {
                    talkedRecently.delete(message.author);
                }, 43200000);
                }
                }).catch(function() {
                });
break;*/

  //let prefix = prefixes[message.guild.id].prefixes;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
};
})})
