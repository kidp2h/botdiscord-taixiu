import {Client, Message, MessageEmbed} from "discord.js";
import {ICommands} from "../Interfaces"
export default abstract class BaseCommands {
    constructor(client : Client, message : Message, embed : MessageEmbed){}

    public daily(client : Client,message : Message, embed : MessageEmbed){};
    public bet(client : Client, message : Message, embed: MessageEmbed){};
    public help(client: Client,message : Message ,listCommand : Array<ICommands>,embed : MessageEmbed){};
    public user(client : Client ,message : Message, embed : MessageEmbed){};
    public profile(client: Client, message : Message, embed : MessageEmbed){};
}