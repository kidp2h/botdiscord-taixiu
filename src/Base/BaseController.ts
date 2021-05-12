import {Client, MessageEmbed} from "discord.js"

export abstract class BaseController {
    public embed : MessageEmbed;
    protected _clientTaiXiu : Client;

    public App() : void {}
}