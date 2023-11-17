async function connect(){
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql");
    const connection = await mysql.createConnection("mysql://root:@localhost:3306/dadosclientes");
    console.log ("Conexão realizada com sucesso!");
    global.connection = connection;
    return connection;
}


async function insertCliente( nomeCliente: string, numeroCPF: string){
    const conn = await connect();
    const sql = 'INSERT INTO dadosclientes(nomeCliente, numeroCPF) VALUES (?,?);';
    const values = [nomeCliente, numeroCPF];
    await conn.query(sql,values);   
}

module.exports = {insertCliente}