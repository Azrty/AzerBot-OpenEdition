const Discord = require('discord.js');
var bot = new Discord.Client();
var client = new Discord.Client();
var prefix = ("-");
client.login('Placez le token du bot ici');
client.on("ready", function() {
    client.user.setActivity(`-help | ${client.guilds.size} serveurs | ${client.users.size} utilisateurs`);
    console.log("AzerBot initié et prêt à servir ${client.guilds.size} serveurs dont ${client.users.size} utilisateurs !");

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

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
    if (message.author.equals(client.user)) return;
	
    if (!message.content.startsWith(prefix)) return;
    
    var args = message.content.substring(prefix.length).split(" ");
    
    switch (args[0].toLowerCase()) {

case "help":
//Correctly Indented
		var embede = new Discord.RichEmbed()
			.setDescription(`${message.author.username}, Voici la liste des commandes:`)
			.addField(`Divertissement`, "`\n-8ball\n-sondage`")
			.addField("Utilitaire", "`\n-profil\n-serverinfo\n-id\n-ping`")
			.addField(`Modération`, "`\n-ban\n-kick\n-clear`", true)
			.addField(`Administration`, "`\n-sondage\n-say\n-annonce`")
			.addField(`Commandes désactivés`, "`\n-play\n-skip\n-stop`", true)
			.setFooter("AzerBot - By [Azrty](https://azrty.com)") //Vous pouvez modifier
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
break;
case "id":
               var idembed = new Discord.RichEmbed()
                   .setDescription(`Votre IDENTIFIANT/ID est ${message.author.id}`)
               message.channel.sendEmbed(idembed)
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
};
})})
