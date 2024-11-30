const {Sequelize} = require("sequelize");
const config = require('./config.json');

const sequelize = new Sequelize(config.development.database,config.development.username,config.development.password,{
host: config.development.host,
dialect: config.development.dialect,
pool:{
    max:5,
    min:0,
    acquire:30000,
    idle:10000
}
});


const connect = async () =>{
    try{
        await sequelize.authenticate();
        console.log("connection established");

    }catch(error){
        console.error("unable to connect",error);
    }

}

module.exports ={
    sequelize,
    connect
}
