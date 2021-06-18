import {Client, Message, MessageEmbed} from "discord.js";
import {ICommands} from "../../Interfaces"
import { BaseController } from "./BaseController";
export default abstract class BaseCommandsController extends  BaseController{
    constructor(client : Client){
        super();
        this._clientTaiXiu = client;
    }

    abstract hourly(message : Message, embed : MessageEmbed) : Promise<void>;
    abstract daily(message : Message, embed : MessageEmbed) : Promise<void>;
    abstract weekly(message : Message, embed : MessageEmbed) : Promise<void>;
    abstract bet(client : Client, embed: MessageEmbed,  message : Message) : Promise<void>; 
    abstract help(message : Message ,listCommand : Array<ICommands>,embed : MessageEmbed): void;
    abstract developer(message : Message, embed : MessageEmbed);
    abstract profile(client: Client, message : Message, embed : MessageEmbed) : Promise<void>;
    abstract session(message : Message, embed : MessageEmbed) : Promise<void>;

}