import Discord , {Message, MessageEmbed, Client} from "discord.js";
import moment from "moment"
import _ from "lodash"
require("dotenv").config();

import BaseCommandsController from "./BaseController/BaseCommands"
import {ICommands,IUser, IPlayer, ISession} from "../Interfaces";
import codeError from "../codeError.json"
import Model from "../models/index";
import Helpers from "../Helpers"

/**
 * @param client  @type Discord.Client;
 * @param message : Discord.Message
 * @param embed : Discord.MessageEmbed
 * @extends BaseCommands
 */
export default class CommandsController extends BaseCommandsController{
    private embed : MessageEmbed;

    constructor(client : Client, message : Message, listCommands : Array<ICommands>){
        super(client);
        this.embed = new Discord.MessageEmbed;
        //init method
        this.hourly(message, this.embed);
        this.daily(message, this.embed)
        this.weekly(message, this.embed)
        this.bet(client, this.embed, message);
        this.help(message, listCommands, this.embed);
        this.profile(client, message, this.embed);
        this.developer(message, this.embed);
        this.session(message,this.embed);
    }
    /**
     * @param client 
     * @param message 
     * @param embed 
     * @return Promise<void>
     * @command tx!daily
     */
    public async hourly(message : Message, embed : MessageEmbed) : Promise<void> {
        try {
            if(message.content == "tx!hourly"){
                let idDiscord : IUser["idDiscord"] = message.author.id;
                let idGuild : IUser["idGuild"] = message.guild.id;
                let user = await Model.UserModel.findUserByIdDiscord(idDiscord,idGuild);
                let isReceived = false;
                if(user == null){
                    user = await Model.UserModel.addUser(idDiscord,idGuild);
                }
                if(user.lastHourly == null){
                    //receive
                    isReceived = true;
                }else{
                    let checkHourly = Helpers.checkDaily(user.lastHourly);
                    (checkHourly) ? isReceived = true : isReceived = false;
                }
                if(isReceived){
                    await Model.UserModel.receiveGift("hourly",idDiscord, idGuild, <number>user.money + 2000)
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle('Hourly Gift')
                        .setDescription("Bạn nhận được quà hằng giờ 2000 money :D")
                        .setTimestamp(new Date())
                        .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }else{
                    user = await Model.UserModel.findUserByIdDiscord(idDiscord, idGuild);
                    let timeToReceive = moment(user.lastHourly).add(1,"hours");
                    let lastDaily = moment(user.lastHourly);
                    let range = Math.abs(moment(Date.now()).diff(timeToReceive,"seconds"));
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Notification')
                    .setDescription(`:x: Bạn đã nhận quà hằng giờ rồi !!!\nHãy nhận lại sau ${range}s nữa, vào lúc ${timeToReceive.locale("vi").format('MMMM Do YYYY, h:mm:ss a')}`)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
        
    }
    public async daily(message : Message, embed : MessageEmbed) : Promise<void> {
        try {
            if(message.content == "tx!daily"){
                let idDiscord : IUser["idDiscord"] = message.author.id;
                let idGuild : IUser["idGuild"] = message.guild.id;
                let user = await Model.UserModel.findUserByIdDiscord(idDiscord,idGuild);
                let isReceived = false;
                if(user == null){
                    user = await Model.UserModel.addUser(idDiscord,idGuild);
                }
                if(user.lastDaily == null){
                    //receive
                    isReceived = true;
                }else{
                    let checkDaily = Helpers.checkDaily(user.lastDaily);
                    (checkDaily) ? isReceived = true : isReceived = false;
                }
                if(isReceived){
                    await Model.UserModel.receiveGift("daily",idDiscord, idGuild, <number>user.money + 10000)
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle('Daily Gift')
                        .setDescription("Bạn nhận được quà hằng ngày 10000 money :D")
                        .setTimestamp(new Date())
                        .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }else{
                    user = await Model.UserModel.findUserByIdDiscord(idDiscord, idGuild);
                    let timeToReceive = moment(user.lastDaily).add(24,"hours");
                    let lastDaily = moment(user.lastDaily);
                    let range = Math.abs(moment(Date.now()).diff(timeToReceive,"seconds"));
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Notification')
                    .setDescription(`:x: Bạn đã nhận quà hằng ngày rồi !!!\nHãy nhận lại sau ${range}s nữa, vào lúc ${timeToReceive.locale("vi").format('MMMM Do YYYY, h:mm:ss a')}`)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async weekly(message : Message, embed : MessageEmbed) : Promise<void> {
        try {
            if(message.content == "tx!weekly"){
                let idDiscord : IUser["idDiscord"] = message.author.id;
                let idGuild : IUser["idGuild"] = message.guild.id;
                let user = await Model.UserModel.findUserByIdDiscord(idDiscord,idGuild);
                let isReceived = false;
                if(user == null){
                    user = await Model.UserModel.addUser(idDiscord,idGuild);
                }
                if(user.lastWeekly == null){
                    //receive
                    isReceived = true;
                }else{
                    let checkWeekly = Helpers.checkDaily(user.lastDaily);
                    (checkWeekly) ? isReceived = true : isReceived = false;
                }
                if(isReceived){
                    await Model.UserModel.receiveGift("weekly",idDiscord, idGuild, <number>user.money + 20000)
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle('Weekly Gift')
                        .setDescription("Bạn nhận được quà hằng tuần 20000 money :D")
                        .setTimestamp(new Date())
                        .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }else{
                    user = await Model.UserModel.findUserByIdDiscord(idDiscord, idGuild);
                    let timeToReceive = moment(user.lastWeekly).add(168,"hours");
                    let lastDaily = moment(user.lastWeekly);
                    let range = Math.abs(moment(Date.now()).diff(timeToReceive,"seconds"));
                    embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Notification')
                    .setDescription(`:x: Bạn đã nhận quà hằng tuần rồi !!!\nHãy nhận lại sau ${range}s nữa, vào lúc ${timeToReceive.locale("vi").format('MMMM Do YYYY, h:mm:ss a')}`)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    public help(message : Message,listCommands : Array<ICommands>, embed : MessageEmbed ) : void {
        if(message.content.includes("tx!help") && message.content.slice(0,7) =="tx!help"){
            let listArgument : Array<String> = Helpers.getArgument(message)
            if(listArgument.length == 0){
                let msg = "";
                listCommands.forEach(element => {
                    element.syntax ? msg += `• \`${element.command}\` :arrow_right: ${element.description}\n• Cú pháp : \`${element.syntax}\`\n\n` : msg += `• \`${element.command}\` :arrow_right: ${element.description}\n\n`
                });
                embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Commands')
                    .setDescription(msg)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu",process.env.B_AVATAR)
                message.channel.send(embed);
            }else if(listArgument.length >= 1){
                Helpers.throwError(message,embed,codeError.MANY_ARG.contentError);
            }
        }
    }

    public async bet(client : Client, embed : MessageEmbed, message : Message){
        let listValueBet : Array<String> = ["tai", "xiu"]
        let resultWin = listValueBet[Math.round(Math.random())]

        if(message.content.includes("tx!bet") && message.content.slice(0,6) == "tx!bet"){
            let idGuild = message.guild.id;
            let idChannel = message.channel.id;
            let idDiscord = message.author.id
            
            let listArgument : Array<String> = Helpers.getArgument(message);
            let user : IUser = await Model.UserModel.findUserByIdDiscord(idDiscord,idGuild);
            if(user == null || !user){
                user = await Model.UserModel.addUser(idDiscord,idGuild);
                
            }
            
            if(listArgument.length == 0){
                Helpers.throwError(message, embed, codeError.FEW_ARG.contentError);
            }else if(listArgument.length > 2){
                Helpers.throwError(message, embed, codeError.MANY_ARG.contentError);
            }else if(listArgument.length == 1 && listArgument[0] == "info"){ 
                //show info bet
            }else if(Number(listArgument[0]) < 500 || (listValueBet.includes(listArgument[1]) == false)){
                Helpers.throwError(message, embed, ":x: Min money to bet is `500` and value bet is only `tai` or `xiu`. Detail in `tx!help`")
            }else if(Number(listArgument[0]) > user.money){
                Helpers.throwError(message, embed, ":x: You not enough money to bet !!")
            }else{
                let PlayerInWave : IPlayer  = {
                    idDiscord :idDiscord,
                    idGuild :idGuild,
                    moneyBet : listArgument[0],
                    valueBet : listArgument[1],
                    money : user.money
                };
                let session = await Model.SessionModel.findSessionByIdGuild(PlayerInWave.idGuild);
                if(!_.isEmpty(session)){
                    let checkExistPlayerInSession = session.listPlayerInSession.filter(player => player.idDiscord == PlayerInWave.idDiscord && player.idGuild == PlayerInWave.idGuild);
                    if(checkExistPlayerInSession.length == 0){
                        session.listPlayerInSession.push(PlayerInWave);
                        await Model.SessionModel.updateListPlayer(session._id,PlayerInWave.idGuild, session.listPlayerInSession)
                        Helpers.noticeSuccessBet(message, embed, PlayerInWave);
                    }else{
                        Helpers.noticeWasBet(message, embed);
                    }
                }else{
                    await Model.SessionModel.initSession(idGuild, idChannel, PlayerInWave, resultWin);
                    Helpers.noticeSuccessBet(message, embed, PlayerInWave);
                }
            }
        }
    }

    public developer(message : Message, embed : MessageEmbed){
        if(message.content == "tx!dev"){
            embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Developer')
                    .setDescription('Developer by <@!747412156110077973>')
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
            message.channel.send(embed);
        }
    }

    public async profile(client : Client, message : Message, embed : MessageEmbed) : Promise<void>{
        if(message.content.includes("tx!profile")){
            let listArgument : Array<String> = Helpers.getArgument(message);
            let idGuild = message.guild.id;
            let idDiscord : IUser["idDiscord"];
            if(listArgument.length == 0){
                //Helpers.throwError(message, new MessageEmbed, codeError.FEW_ARG.contentError)
                let profile = await Model.UserModel.findUserByIdDiscord(message.author.id,idGuild);
                embed.setColor('#f52a2a')
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setThumbnail(message.author.avatarURL())
                        .setTitle('Profile')
                        .addFields(
                        { name: ":bust_in_silhouette: Name", value: `<@!${profile.idDiscord}>`},
                        { name: ':moneybag: Money', value: `${Helpers.formatMoney(<number>profile.money)}`,inline : true})
                        .setTimestamp(new Date())
                        .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
            }else{
                idDiscord = (listArgument[0].match(/<@!?(\d+)>/))[1];
            }
            
            let author = Helpers.isValidIdDiscord(client,<string>listArgument[0])
            if(author){
                if(author.bot){

                }else{
                    let profile = await Model.UserModel.findUserByIdDiscord(idDiscord,idGuild);
                    if(!profile){
                        profile = await Model.UserModel.addUser(idDiscord,idGuild);
                    }
                    embed.setColor('#f52a2a')
                        .setAuthor(author.username, author.avatarURL())
                        .setThumbnail(author.avatarURL())
                        .setTitle('Profile')
                        .addFields(
                        { name: ":bust_in_silhouette: Name", value: `<@!${profile.idDiscord}>`},
                        { name: ':moneybag: Money', value: `${Helpers.formatMoney(<number>profile.money)}`,inline : true})
                        .setTimestamp(new Date())
                        .setFooter("TaiXiu", process.env.B_AVATAR)
                    message.channel.send(embed);
                }
            }
        }
    }

    public async session(message : Message, embed : MessageEmbed) : Promise<void> {
        if(message.content == "tx!session"){
            let content : string;
            let idGuild = message.guild.id;
            let session : ISession = await Model.SessionModel.fetchListSessionsOpen(idGuild);
            if(session){
                let listPlayerInSession : Array<IPlayer> = session.listPlayerInSession;
                content = `ID Session : \`${session._id}\`\nList player in session :\n`
                for await(const player of listPlayerInSession){
                    content+= `<@!${player.idDiscord}> - Bet : \`${player.valueBet}\` - Money Bet : \`${Helpers.formatMoney(Number(player.moneyBet))}\`\n`
                }
                embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Session')
                    .setDescription(content)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
                message.channel.send(embed);
            }else{
                content = `\`DON'T HAVE SESSION :(\``
                embed.setColor('#f52a2a')
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle('Session')
                    .setDescription(content)
                    .setTimestamp(new Date())
                    .setFooter("TaiXiu", process.env.B_AVATAR)
                message.channel.send(embed);
            }
        }
    }
}