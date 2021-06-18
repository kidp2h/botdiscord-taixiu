import moment from "moment";
require("dotenv").config();

import {Client} from "discord.js"
import Model from "./models/index"
import _ from "lodash"
import { IPlayer } from "./Interfaces";

export default {
    getArgument : (message)  : Array<String> => {
            let listArgument = message.content.split(" ");
            listArgument.shift();
            _.map(listArgument,_.trim);
            return listArgument;
    },
    throwError : (message, embed,error) : void => {
        embed.setColor('#f52a2a')
        .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Error')
            .setDescription(error)
            .setTimestamp(new Date())
            .setFooter("TaiXiu", process.env.B_AVATAR)
        message.channel.send(embed);
    },
    checkDaily : (_lastDaily : Date) : Boolean => {
        if(_lastDaily == null){
            return true;
        }
        let lastDaily = moment(_lastDaily);
        return moment(Date.now()).isAfter(lastDaily.add(2,"hours"))
    },
    isValidIdDiscord : (client : Client,idDiscord : string) : any => {
        try {
            if(idDiscord.startsWith("<@") && idDiscord.endsWith(">")){
                idDiscord = idDiscord.slice(2,-1)
		        if (idDiscord.startsWith('!')) {
			        idDiscord = idDiscord.slice(1);
		        }
                return client.users.cache.get(idDiscord);
            }else{
                return false;
            }
        } catch (error) {
            
        }
    },
    isEndWave : (begin) : Boolean => {
        let currentTime = moment(begin);
        let endTime = currentTime.add(90,"seconds");
        if(moment(Date.now()).diff(endTime) >= 0){
            return true;
        }else{
            return false;
        }
    },
    sendResultWave : (message, embed, listPlayerInWave, result) : void => {
        (result == "tai") ? result = "Tài" : result = "Xỉu";
        let listPlayerWin : Array<IPlayer>;
        
        listPlayerInWave.forEach(element => {
            let Player : IPlayer = {
                idDiscord : element.idDiscord,
                idGuild : element.idGuild,
                moneyBet : element.moneyBet,
                valueBet : element.valueBet,
                money : element.money
            };
            if(element.valueBet == result){
                listPlayerWin.push(Player);
            }
        });

        embed.setColor('#f52a2a')
        .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Result')
            .setDescription(`Tài Xỉu : ${result} thắng !!.\n`)
            .setTimestamp(new Date())
            .setFooter("TaiXiu", process.env.B_AVATAR)
        message.channel.send(embed);
    },
    noticeSuccessBet : (message, embed, PlayerInWave) : void => {
        embed.setColor('#f52a2a')
        .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Result')
            .setDescription(`<@!${message.author.id}> đã cược \`${PlayerInWave.moneyBet}\` vào  \`${PlayerInWave.valueBet}\``)
            .setTimestamp(new Date())
            .setFooter("TaiXiu", process.env.B_AVATAR)
        message.channel.send(embed);
    },
    noticeWasBet : (message, embed) : void => {
        embed.setColor('#f52a2a')
        .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Notification')
            .setDescription(`<@!${message.author.id}> đã cược rồi`)
            .setTimestamp(new Date())
            .setFooter("TaiXiu", process.env.B_AVATAR)
        message.channel.send(embed);
    },
    noticeResultSession : async (session, content, message, embed) : Promise<void> => {
        
        if(session.isNotice == false){
            await Model.SessionModel.finishSession(session._id);
            embed.setColor('#f52a2a')
            .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle('Result Session')
                .setDescription(content)
                .setTimestamp(new Date())
                .setFooter("TaiXiu", process.env.B_AVATAR)
            message.channel.send(embed);
        }
    },
    formatMoney : (value : number) : any => {
        let formatter = new Intl.NumberFormat();
        return formatter.format(value); /* $2,500.00 */
    }  
}