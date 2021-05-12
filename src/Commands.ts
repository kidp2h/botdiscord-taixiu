import {Message, MessageEmbed, Client} from "discord.js";
import {ICommands,IUser} from "./Interfaces";
import BaseCommands from "./Base/BaseCommands"
import codeError from "./codeError.json"
import moment from "moment"
import UserModel from "./Model";
import Helpers from "./Helpers"

/**
 * @param client  @type Discord.Client;
 * @param message : Discord.Message
 * @param embed : Discord.MessageEmbed
 * @extends BaseCommands
 */
export default class Commands extends BaseCommands{
    constructor(client : Client, message : Message, listCommands : Array<ICommands>,embed : MessageEmbed){
        super(client, message, embed);
        //init method
        this.daily(client, message, embed);
        this.bet(client, message);
        this.help(client, message, listCommands, embed);
        this.profile(client, message, embed);
        this.user(client, message, embed);
    }
    /**
     * @param client 
     * @param message 
     * @param embed 
     * @return Promise<void>
     * @command tx!daily
     */
    public async daily(client : Client ,message : Message, embed : MessageEmbed) : Promise<void> {
        try {
            if(message.content == "tx!daily"){
                let idDiscord : IUser["idDiscord"] = `<@!${message.author.id}>`
                let idGuild : IUser["idGuild"] = message.guild.id;
                let user = await UserModel.findUserByIdDiscord(idDiscord,idGuild);
                let isReceived = false;
                if(user == null){
                    user = await UserModel.addUser(idDiscord,idGuild);
                }
                if(user.lastDaily == null){
                    //receive
                    isReceived = true;
                }else{
                    let checkDaily = Helpers.checkDaily(user.lastDaily);
                    (checkDaily) ? isReceived = true : isReceived = false;
                }
                if(isReceived){
                    await UserModel.receiveDailyGift(idDiscord,<number>user.money + 500)
                    embed.setColor('#f52a2a')
                        .setTitle('Notification')
                        .setDescription("Bạn nhận được quà hằng ngày 500 money :D")
                    message.channel.send(embed);
                }else{
                    user = await UserModel.findUserByIdDiscord(idDiscord, idGuild);
                    let timeToReceive = moment(user.lastDaily).add(2,"hours");
                    let lastDaily = moment(user.lastDaily);
                    let range = Math.abs(moment(Date.now()).diff(timeToReceive,"seconds"));
                    embed.setColor('#f52a2a')
                    .setTitle('Notification')
                    .setDescription(`:x: Bạn đã nhận quà hằng ngày rồi !!!\nHãy nhận lại sau ${range}s nữa, vào lúc ${timeToReceive.locale("vi").format('MMMM Do YYYY, h:mm:ss a')}`)
                    message.channel.send(embed);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
        
    }
    public help(client : Client, message : Message,listCommands : Array<ICommands>, embed : MessageEmbed ) : void {
        if(message.content.includes("tx!help") && message.content.slice(0,7) =="tx!help"){
                let listArgument : Array<String> = Helpers.getArgument(message)
                if(listArgument.length == 0){
                    let msg = "";
                    listCommands.forEach(element => {
                        element.syntax ? msg += `• \`${element.command}\` :arrow_right: ${element.description}\n• Cú pháp : \`${element.syntax}\`\n\n` : msg += `• \`${element.command}\` :arrow_right: ${element.description}\n\n`
                    });
                    embed.setColor('#f52a2a')
                            .setTitle('Notification')
                            .setDescription(msg)
                    message.channel.send(embed);
                }else if(listArgument.length >= 1){
                    Helpers.throwError(message,embed,codeError.COMMAND_NOT_VALID.contentError);
                }
            }
    }

    public bet(client : Client, message : Message){
        if(message.content.includes("tx!bet") && message.content.slice(0,6) == "tx!bet"){
                console.log(message.guild.id);
        }
    }

    public user(client: Client, message : Message, embed : MessageEmbed){
        if(message.content == "tx!user"){
            embed.setColor('#f52a2a')
                    .setTitle('Notification')
                    .setDescription(':white_check_mark: Bot code by <@!747412156110077973>')
            message.channel.send(embed);
        }
    }

    public async profile(client : Client, message : Message, embed : MessageEmbed) : Promise<void>{
            let listArgument : Array<String> = Helpers.getArgument(message);

            let idGuild = message.guild.id;
            if(Helpers.isValidIdDiscord(client,<string>listArgument[0])){
                if(message.content.includes("tx!profile")){
                    if((listArgument.length >= 2 || listArgument.length == 0)){
                        Helpers.throwError(message,new MessageEmbed,codeError.COMMAND_NOT_VALID.contentError)
                    }else{
                        let profile = await UserModel.findUserByIdDiscord(listArgument[0],idGuild);
                        if(profile == null){
                            profile = await UserModel.addUser(listArgument[0],idGuild);
                        }
                        embed.setColor('#f52a2a')
                                .setTitle('Profile')
                                .addFields(
                                { name: ":bust_in_silhouette: Name", value: `${profile.idDiscord}`},
                                { name: ':moneybag: Money', value: `${profile.money}`,inline : true}
                        )
                        message.channel.send(embed);
                    }
                }
            }
            
    }
}