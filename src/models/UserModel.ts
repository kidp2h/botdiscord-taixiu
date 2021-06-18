import Mongoose, {Document} from "mongoose"
import {IUser} from "../Interfaces"
import moment, { relativeTimeThreshold } from "moment"
const Schema = Mongoose.Schema;

const UserSchema : Mongoose.Schema = new Schema ({
    id : Mongoose.Types.ObjectId,
    idDiscord : String,
    idGuild : String,
    money : {type : Number,default : 0},
    lastDaily : {type : Date, default : null},
    lastHourly : {type : Date, default : null},
    lastWeekly : {type : Date, default : null}
    
},{timestamps : true})

export default new class UserModel {
    private _model;
    constructor(){
        this._model = Mongoose.model<IUser>("users",UserSchema);
    }
/**
 * 
 * @param _idDiscord 
 * @returns Promise<IUser>
 */
    public async findUserByIdDiscord(_idDiscord : IUser["idDiscord"],_idGuild : IUser["idGuild"]) : Promise<IUser>{
        //console.log(_idDiscord);
        //console.log(await this._model.findOne({idDiscord : _idDiscord}));
        return this._model.findOne({idDiscord : _idDiscord,idGuild : _idGuild})
    }
/**
 * 
 * @param id 
 * @returns Promise<IUser>
 */
    public findUserById(id : IUser["id"]) : Promise<IUser> {
        return this._model.find({id : id})
    }

    public addUser(_idDiscord : IUser["idDiscord"], _idGuild : IUser["idGuild"]) : Promise<IUser>{
        return this._model.create({idDiscord : _idDiscord,idGuild : _idGuild});
    }

    public receiveGift(typeGift,_idDiscord : IUser["idDiscord"], _idGuild: IUser["idGuild"], newMoney : number) : Promise<IUser> {
        if(typeGift == "daily"){
            return this._model.updateOne({idDiscord : _idDiscord, idGuild : _idGuild},{money : newMoney,lastDaily : moment()});
        }else if(typeGift == "hourly"){
            return this._model.updateOne({idDiscord : _idDiscord, idGuild : _idGuild},{money : newMoney,lastHourly : moment()});
        }else if(typeGift == "weekly"){
            return this._model.updateOne({idDiscord : _idDiscord, idGuild : _idGuild},{money : newMoney,lastWeekly : moment()});
        }
    }

    public setMoney(_idDiscord : IUser["idDiscord"], _idGuild : IUser["idGuild"], amount : number) : void {
        return this._model.updateOne({idDiscord : _idDiscord, idGuild : _idGuild},{money : amount}).exec();
    }
}
