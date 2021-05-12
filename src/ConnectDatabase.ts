import mongoose from "mongoose"
require("dotenv").config();

export default class ConnectDatabase {

    constructor(){
        this.Connect();
    }

    async Connect(){
        try {
            await mongoose.connect(process.env.URI,{useNewUrlParser : true,useUnifiedTopology:true,useFindAndModify: true});
        } catch (error) {
            throw new Error(error);
        }
    }
}