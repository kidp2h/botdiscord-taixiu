import Mongoose from "mongoose"
import moment from "moment";
const Schema = Mongoose.Schema;

import {ISession, IPlayer} from "../Interfaces"
import Model from "../models/index";




const SessionSchema : Mongoose.Schema = new Schema({
    idSession : Mongoose.Types.ObjectId,
    idGuild : String,
    idChannel : String,
    listPlayerInSession : [{
        idDiscord : String,
        idGuild : String,
        money : Number,
        valueBet : String,
        moneyBet : String
    }],
    resultWin : String,
    timeEndSession : Date,
    isEnd : {type : Boolean, default : false}

},{timestamps : true});

export default new class SessionModel {
    private _model; 
    constructor(){
        this._model = Mongoose.model<ISession>("sessions",SessionSchema)
    }
    async initSession(_idGuild : ISession["idGuild"], _idChannel : ISession["idChannel"], _firstPlayer : IPlayer,_resultWin) : Promise<ISession> {
        const session = await this._model.startSession();
        session.startTransaction();
        try {
        let result = this._model.create({idGuild : _idGuild, idChannel : _idChannel, resultWin : _resultWin, listPlayerInSession : _firstPlayer,timeEndSession : moment(Date.now()).add(60,"seconds")});
            session.endSession();
            return result
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }

    findSessionByIdGuild(_idGuild) : Promise<ISession> {
        return this._model.findOne({idGuild : _idGuild, isEnd : false})
    }
    
    findSessionByIdSession(_idSession) : Promise<ISession> {
        return this._model.findOne({_id : _idSession});
    }

    updateListPlayer(_idSession, _idGuild, _newListPlayer : Array<IPlayer>) : Promise<ISession> {
        return this._model.updateOne({_id : _idSession, idGuild : _idGuild, isEnd : false},{listPlayerInSession : _newListPlayer});
    }

    fetchListSessionsOpen(_idGuild){
        return this._model.findOne({idGuild : _idGuild,isEnd : false})
    }

    async closeSession(_idSession){
        let result = await this._model.updateOne({_id : _idSession,isEnd:false},{isEnd : true});
        let session : ISession = await this.findSessionByIdSession(_idSession);
        let listPlayerInSession : Array<IPlayer> = session.listPlayerInSession;
        let listPlayerWinner : Array<IPlayer> = [];
        for await( const player of listPlayerInSession){
            if(player.valueBet == session.resultWin){
                listPlayerWinner.push(player);
                Model.UserModel.setMoney(player.idDiscord, player.idGuild, Number(player.moneyBet) + Number(player.money));
            }else{
                Model.UserModel.setMoney(player.idDiscord, player.idGuild, Number(player.money) - Number(player.moneyBet));
            }
        }
        return listPlayerWinner;
    }

    public finishSession(_idSession){
        return this._model.updateOne({_id:_idSession},{isNotice : true});
    }

    fetchAllSessionIsOpen(){
        return this._model.find({isEnd : false})
    }

}