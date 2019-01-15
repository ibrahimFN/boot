const Discord = require("discord.js");
const client = new Discord.Client();
const embed = new Discord.RichEmbed();
const fortnite = require("fortnite-api");
const Canvas = require("canvas");

const config = require("./config.js");

client.login(config.token);

const fortniteAPI = new fortnite([config.fEmail, config.fPassWord,
    "MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE",
    "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ"]);

client.on("ready", () => {
    console.log("Ready");
});

client.on("message", async message => {

    var adm = false;

    if (!message.guild) return;
    
    //MutRole
        let MutRole = message.guild.roles.find(r => r.name == "Muted");
        if (!MutRole)
            MutRole = await message.guild.createRole({ name: "Muted", color: "black" })
        message.guild.channels.map(c => c.overwritePermissions(MutRole, { SEND_MESSAGES: false }));
    //

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (config.admins.includes(message.author.id))
        adm = true;

    var date = new Date();

    if (command == "help") {
        let p = config.prefix;
        message.delete();

        message.author.send({
            embed: {
                color: 16711680,
                author: {
                    name: "Команди для Адміністраторів",
                    icon_url: client.user.avatarURL
                },
                fields: [
                    {
                        name: p + "kick",
                        value: "Кікає @юреза з серверу"
                    },
                    {
                        name: p + "ban",
                        value: "Банить @юреза"
                    },
                    {
                        name: p + "clear",
                        value: "Очищає чат"
                    },
                    {
                        name: p + "say",
                        value: "Надпис він імені бота"
                    },
                    {
                        name: "mut",
                        value: "мутить @юзера"
                    },
                    {
                        name: "unmut",
                        value: "розмучує @юзера"
                    }
                ]
            }
        });
        message.author.send({
            embed: {
                color: 16711680,
                author: {
                    name: "Команди для Користувачів",
                    icon_url: client.user.avatarURL
                },
                fields: [
                    {
                        name: p + "ftn",
                        value: "Статистика фортнайту"
                    },
                    {
                        name: p + "rules",
                        value: "Показує провила сервера"
                    }
                ]
            }
        })
    }
    if (command == "rules") {
        message.author.send("Тут будуть правила", { split: { char: "\n" } })
    }
    if (command == "ping") {
        const msg = await message.channel.send({
            embed: {
                description: "Ping?",
                color: 16776960
            }
        });
        msg.edit({
            embed: {
                description: `Latency is ${msg.createdTimestamp - message.createdTimestamp}ms
            API Latency is ${Math.round(client.ping)}ms`,
                color: 65280
            }
        })
    }
    if (command == "kick") {
        if (!adm) return message.channel.send({
            embed: {
                description: "Ти не маєш прав для використання команди",
                color: 16711680,
                timestamp: date
            }
        });
        let UserK = message.mentions.members.first();
        if (!UserK) return message.channel.send({ embed: { description: `${config.prefix}${command} @user`, color: 16776960 } });
        UserK.kick()
            .then((u) => {
                message.channel.send({
                    embed: {
                        description: `${message.author.tag} кікнув ${u.user.tag}`,
                        timestamp: date
                    }
                });
            })
            .catch((e) => { console.log(e) });
    }
    if (command == "ban") {
        if (!adm) return message.channel.send({
            embed: {
                description: "Ти не маєш прав для використання команди",
                color: 16711680,
                timestamp: date
            }
        });
        let UserK = message.mentions.members.first();
        if (!UserK) return message.channel.send({ embed: { description: `${config.prefix}${command} @user`, color: 16776960 } });
        UserK.ban()
            .then((u) => {
                message.channel.send({
                    embed: {
                        description: `${u.user.tag} ban`,
                        timestamp: date
                    }
                });
            })
            .catch((e) => { console.log(e) });
    }
    if (command == "clear") {
        if (!adm) return message.channel.send({
            embed: {
                description: "Ти не маєш прав для використання команди",
                color: 16711680,
                timestamp: date
            }
        });
        if (isNaN(args[0])) return message.channel.send("clear [1]-[99]");
        if (args[0] > 99 && args[0] < 1) return message.channel.send({
            embed: {
                description: p + "clear [1]-[99]",
                color: 16711680
            }
        });
        message.channel.bulkDelete(++args[0]);
    }
    if (command == "say") {
        if (!adm) return;
        message.delete();
        if (!args[0]) return message.channel.send({
            embed: {
                description: `${config.prefix}${command} [текст]`,
                color: 16776960,
                timestamp: date
            }
        });
        message.channel.send(args.join(" "));
    }
    if (command == "mut") {
        if (!adm) return message.channel.send({
            embed: {
                description: "Ти не маєш прав для використання команди",
                color: 16711680,
                timestamp: date
            }
        });
        let UserK = message.mentions.members.first();
        if (!UserK) return message.channel.send({
            embed: {
                description: `${config.prefix}${command} @user`,
                color: 16776960,
                timestamp: date
            }
        });
        UserK.addRole(MutRole);
        message.channel.send({
            embed: {
                description: `${UserK.user.tag} замучений ${message.author.tag}`,
                timestamp: date
            }
        });
    }
    if (command == "unmut") {
        if (!adm) return message.channel.send({
            embed: {
                description: "Ти не маєш прав для використання команди",
                color: 16711680,
                timestamp: date
            }
        });
        let UserK = message.mentions.members.first();
        if (!UserK) return message.channel.send({
            embed: {
                description: `${config.prefix}${command} @user`,
                color: 16776960,
                timestamp: date
            }
        });
        UserK.removeRole(MutRole);
        message.channel.send({
            embed: {
                description: `${message.author.tag} розмутив ${UserK.user.tag}`,
                timestamp: date
            }
        });
    }
    if (command == "ftn") {
        if (!args[0]) return message.reply("fortnite [userName]");
        await fortniteAPI.login();
        var Stat;
        const msg = await message.channel.send("Search...");
        try {
            Stat = await fortniteAPI.getStatsBR(args.join(" "), "pc", "alltime");
        } catch (e) {
            try {
                Stat = await fortniteAPI.getStatsBR(args.join(" "), "ps4", "alltime");
            } catch (e) {
                try {
                    Stat = await fortniteAPI.getStatsBR(args.join(" "), "xb1", "alltime");
                } catch (e) {
                    return await msg.edit({ embed: { color: 16711680, description: "not found" } });
                }
            }
        }

        var d = new Date().getTime();

        message.channel.startTyping();
        await msg.edit("Painting...");

        var title = `${Stat.info.username}  ${Stat.info.platform.toLowerCase()}`;

        const canvas = Canvas.createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');

        await Canvas.loadImage("./Images/FortniteBK.png").then(i => {
            ctx.drawImage(i, 0, 0);
        });

        var StartWhile = 40;
        var StCircle = Math.PI / 2;

        ctx.fillStyle = `rgba(255, 0, 255, 0.03)`
        ctx.fillRect(StartWhile, StartWhile, canvas.width - StartWhile, canvas.height - StartWhile);///////

        ctx.font = "bold 92px serif";
        var t = ctx.measureText(title);

        ctx.fillStyle = "rgba(0, 128, 255, 0.3)";
        ctx.fillRect(StartWhile, StartWhile, t.width + StartWhile, 110);

        ctx.fillStyle = "rgb(255, 255, 255)";
        
        ctx.fillText(title, 45, 120);

        Stat.group.all = Stat.lifetimeStats;

        var Y = 180;
        Stat.group.solo.color = "rgb(0,212,255)";
        Stat.group.duo.color = "rgb(255,128,0)";
        Stat.group.squad.color = "rgb(128,0,255)";
        Stat.group.all.color = "rgb(145, 164, 185)";
        for (let k in Stat.group) {

            f1(StartWhile, Y);
            f2(StartWhile, Y + 60);

            ctx.font = "bold 30px serif";
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.strokeStyle = Stat.group[k].color;

            fillStroke("WIN", StartWhile + 60, Y + 200);
            fillStroke("K/D", StartWhile + 290, Y + 200);
            fillStroke("KILLS", StartWhile + 520, Y + 200);
            fillStroke("MATCHES", StartWhile + 750, Y + 200);
            fillStroke("Kill/Min", StartWhile + 1010, Y + 200);
            fillStroke("Kill/Match", StartWhile + 1260, Y + 200);

            ctx.font = "bold 48px serif";
            ctx.fillStyle = Stat.group[k].color;
            ctx.strokeStyle = "rgb(0, 0, 0)";
            fillStrokeS(Stat.group[k].wins, StartWhile + 100, Y + 130);
            fillStrokeS(Stat.group[k]["k/d"], StartWhile + 320, Y + 130);
            fillStrokeS(Stat.group[k].kills, StartWhile + 570, Y + 130);
            fillStrokeS(Stat.group[k].matches, StartWhile + 830, Y + 130);
            fillStrokeS(Stat.group[k].killsPerMin, StartWhile + 1070, Y + 130);
            fillStrokeS(Stat.group[k].killsPerMatch, StartWhile + 1330, Y + 130);//*/

            ctx.font = "bold 47px serif";
            f3(StartWhile, Y, Stat.group[k].color);
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillText(k.toUpperCase(), StartWhile + 10, Y + 45);
            ctx.fillText("Score: " + Stat.group[k].score, 1100, Y + 45);

            ctx.fillStyle = "rgba(0, 128, 255, 0.4)";
            ctx.beginPath();
            ctx.arc(1600, Y + 135, 80, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = Stat.group[k].color;
            for (let i = 0; i < 80; i++) {
                ctx.beginPath();
                ctx.arc(1600, Y + 135, i, 0 - StCircle, (Math.PI / 50 * Stat.group[k]["win%"]) - StCircle);
                ctx.stroke();
            }

            ctx.font = "bold 40px serif";
            ctx.fillStyle = "rgb(255, 255, 255)";
            var text = ctx.measureText(Stat.group[k]["win%"] + "%");
            ctx.fillText(Stat.group[k]["win%"] + "%", 1605 - text.width / 2, Y + 140);
            ctx.font = "34px serif";
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillText("win%", 1560, Y + 190);

            Y += 220;
        }

        ctx.font = "bold 24px serif";

        ctx.fillStyle = "rgb(255, 255, 255)"

        await message.channel.send({
            files: [{
                attachment: canvas.toBuffer(),
                name: 'file.jpg'
            }]
        });
        message.channel.stopTyping();
        msg.delete();

        function f1(x, y) {
            var x1 = x + 1740,
                y1 = y + 60;
            ctx.fillStyle = "rgba(84,127,168, 0.8)"//"rgba(0, 128, 255, 0.6)";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y);
            ctx.lineTo(x, y1);
            ctx.moveTo(x + 1460, y1);
            ctx.lineTo(x, y1);
            ctx.lineTo(x1, y);
            ctx.fill();

        }
        function f2(x, y) {
            var x1 = x + 1460,
                y1 = y + 160;
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y);
            ctx.lineTo(x, y1);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y);
            ctx.lineTo(x, y1);
            ctx.fill();
        }
        function f3(x, y, color) {
            var x1 = x + 200,
                y1 = y + 60;
            ctx.fillStyle = color
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y);
            ctx.lineTo(x, y1);
            ctx.moveTo(x + 230, y1);
            ctx.lineTo(x, y1);
            ctx.lineTo(x1, y);
            ctx.fill();
        }
        function fillStroke(text, x, y) {
            ctx.fillText(text, x, y);
            ctx.strokeText(text, x, y);
        }
        function fillStrokeS(text, x, y) {
            var t = ctx.measureText(text);
            ctx.fillText(text, x - t.width / 2, y);
            ctx.strokeText(text, x - t.width / 2, y);
        }
    }
});

client.on("guildMemberAdd", GMember => {
    if (message.guild.id != "529005231992733707") return
    client.channels.get(config.welcomeChannel).send(`Hello ${GMember.user}`);
});

client.on('error',(error)=>{

});