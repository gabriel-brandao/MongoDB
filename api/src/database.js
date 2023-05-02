const mongoose = require("mongoose");

function connectToDatabase(){
    //chama a variavel de ambiente da URL de conexão
    mongoose.connect(process.env.DATABASE_URL, {
        //padrões de configuração do Mongo - (para aplicações atuais)
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

//informações de conecção com o mongoose
const db = mongoose.connection;
//qunado ocorrer um erro
db.on("error", (error)=>{console.error(error)});
//faz algo somente uma vez - (quando abrir, executa a arrow function)
db.once("open", () => {console.log("📦 Banco de dados conectado !!")});


//exporta o modulo
module.exports = connectToDatabase;