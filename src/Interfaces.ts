import {Types, Document} from "mongoose"

export interface ICommands {
    command : String,
    syntax? : String,
    arg? : any,
    description : String
}

export interface IUser extends Document{
    id : Types.ObjectId,
    idDiscord : String,
    idGuild : String,
    money : Number,
    lastDaily : Date
}