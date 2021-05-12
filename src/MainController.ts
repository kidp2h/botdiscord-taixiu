//import Helpers from "./helpers";
import Discord, { Guild }  from "discord.js";
import ConnectDatabase from "./ConnectDatabase";
import InitializeCommands from "./index"
import {BaseController} from "./Base/BaseController";
import { listCommands } from "./listCommands";
require("dotenv").config();
/**
 * @extends BaseController
 */
export default new class MainController extends BaseController{
    private _guild : Guild;
    constructor(){
        super();
        
        this._clientTaiXiu = new Discord.Client();
        this.embed = new Discord.MessageEmbed();
        new ConnectDatabase;

        this.App();
    }

    public App(){
        const TaiXiu = this._clientTaiXiu
        const embed = this.embed;
        const guild = this._guild;

        TaiXiu.on("message", (message : Discord.Message) : void => {
            new InitializeCommands(TaiXiu, message, listCommands, new Discord.MessageEmbed);
        })
        TaiXiu.login(process.env.TOKEN);
    }
}



