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
    lastDaily : Date,
    lastHourly : Date,
    lastWeekly : Date
}

export interface IPlayer {
    idDiscord : String,
    idGuild : String,
    money : Number,
    valueBet : String,
    moneyBet : String
}

export interface ISession extends Document{
    idSession : Types.ObjectId,
    idDiscord : String,
    idGuild : String,
    idChannel : String,
    listPlayerInSession : Array<IPlayer>,
    resultWin : String,
    timeEndSession : Date
    isEnd : Boolean,
    isNotice : Boolean

}