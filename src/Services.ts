
import { IPlayer } from "./Interfaces";
import Model from "./models/index"


export default new class Services{

    public async closeSession(idGuild, idSession){
        let session = await Model.SessionModel.findSessionByIdGuild(idGuild);
        //Model.SessionModel.updateSession(session.idSession,{isEnd : true});
    }

    public async pushPlayerToSession(idGuild, idSession, listPlayer : Array<IPlayer>){
        //await Model.SessionModel.updateSession({idSession : idSession,idGuild : idGuild, isEnd : false},{listPlayerInSession : listPlayer})
    }
}