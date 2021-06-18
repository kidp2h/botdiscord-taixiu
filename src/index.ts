import Commands from "./controllers/CommandsController";
import {Client, Message} from "discord.js"
import { ICommands } from "./Interfaces";

export default class InitializeCommands {

    private _client : Client
    public listCommands : Array<ICommands>

    constructor(client : Client, message : Message, listCommands : Array<ICommands>){
        this._client = client;
        this.listCommands = listCommands;
        new Commands(this._client,message, this.listCommands);
    }
}