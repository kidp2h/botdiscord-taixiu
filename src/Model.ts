import Mongoose, {Document} from "mongoose"
import {IUser} from "./Interfaces"
import moment from "moment"
const Schema = Mongoose.Schema;

const UserSchema : Mongoose.Schema = new Schema ({
    id : Mongoose.Types.ObjectId,
    idDiscord : String,
    idGuild : String,
    money : {type : Number,default : 0},
    lastDaily : {type : Date, default : null}
    
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

    public receiveDailyGift(_idDiscord : IUser["idDiscord"], newMoney : number) : Promise<IUser> {
        return this._model.updateOne({idDiscord : _idDiscord},{money : newMoney,lastDaily : moment()});
    }
}

