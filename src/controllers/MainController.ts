//import Helpers from "./helpers";
import Discord, { Guild, Message, TextChannel}  from "discord.js";
import moment from "moment"
require("dotenv").config();

import ConnectDatabase from "../ConnectDatabase";
import InitializeCommands from "../index"
import {BaseController} from "./BaseController/BaseController";
import { listCommands } from "../listCommands";
import Model from "../models/index"
import {IPlayer} from "../Interfaces"

/**
 * @extends BaseController
 */
export default new class MainController extends BaseController{
    constructor(){
        super();
        this._clientTaiXiu = new Discord.Client();
        new ConnectDatabase;
        this.App();
    }

    public App(){
        const TaiXiu = this._clientTaiXiu

        TaiXiu.on("message", (message : Message) : void => {
            new InitializeCommands(TaiXiu, message, listCommands);
        })
        TaiXiu.on("ready",() : void => {
            setInterval(async function(){
                let result = await Model.SessionModel.fetchAllSessionIsOpen();
                if(result){
                    for(const session of result){
                        let embed = new Discord.MessageEmbed
                        if(moment(session.timeEndSession).isBefore(moment(Date.now()))){
                            let listPlayerWin = await Model.SessionModel.closeSession(session._id);
                            let guild = await TaiXiu.guilds.fetch(session.idGuild)
                            if(guild){
                                let channel = await TaiXiu.channels.cache.get(session.idChannel);
                                let noticeSession : string = `List player win in session \`${session._id}\` :\n`;
                                if(listPlayerWin.length == 0){
                                    noticeSession += `No one :(`;
                                }else{
                                    listPlayerWin.forEach((player : IPlayer) => {
                                        noticeSession += `<@!${player.idDiscord}> `;
                                    })
                                }
                                embed.setColor('#f52a2a')
                                .setAuthor("TaiXiu", process.env.B_AVATAR)
                                .setTitle('Notification')
                                .setDescription(noticeSession)
                                .setTimestamp(new Date())
                                .setFooter("TaiXiu", process.env.B_AVATAR)
                                let result = await (channel as TextChannel).send(embed);
                            }
                        }
                    }
                }
            },1000)
        })
        TaiXiu.login(process.env.TOKEN);
    }
}






