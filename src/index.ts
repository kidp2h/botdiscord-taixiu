import Commands from "./Commands";
import {Message, MessageEmbed, Client, Guild } from "discord.js"
import { ICommands } from "./Interfaces";

export default class InitializeCommands {
    private _message : Message;
    private _embed : MessageEmbed;
    private _client : Client
    public listCommands : Array<ICommands>
    private _guild : Guild;

    constructor(client : Client, message : Message,listCommands : Array<ICommands>,embed : MessageEmbed){
        this._message = message;
        this._embed = embed;
        this._client = client;
        this.listCommands = listCommands;
        new Commands(this._client, this._message, this.listCommands, this._embed);
    }
}