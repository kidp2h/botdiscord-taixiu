import codeError from "./codeError.json"
import {Client, Guild, GuildMember, UserResolvable} from "discord.js"
import _ from "lodash"
import moment from "moment";

export default {
    getArgument : (message)  : Array<String> => {
            let listArgument = message.content.split(" ");
            listArgument.shift();
            _.map(listArgument,_.trim);
            return listArgument;
    },
    throwError : (message, embed,error) : void => {
        embed.setColor('#f52a2a')
            .setTitle('Notification')
            .setDescription(error)
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
            if(idDiscord.startsWith("<@!") && idDiscord.endsWith(">")){
                let mention = idDiscord.slice(3,-1);
                return client.users.cache.get(mention);
            }else{
                return false;
            }
        } catch (error) {
            
        }
        
        
    }
}