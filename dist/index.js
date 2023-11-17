"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth()
});
client.on('qr', qr => {
    qrcode_terminal_1.default.generate(qr, { small: true });
});
client.on('ready', () => {
    console.log('Client is ready!');
});
var exibirMensagemInicial = true;
var exibirMensagemNome = true;
var nomeCliente = '';
var exibirMensagemCPF = true;
var numeroCPF = '';
client.on('message', message => {
    console.log(message.body);
    console.log(exibirMensagemInicial);
    console.log(exibirMensagemNome);
    console.log(nomeCliente);
    if (exibirMensagemInicial && message.body !== null) {
        exibirMensagemInicial = false;
        client.sendMessage(message.from, 'Olá, eu sou Haland, assistente virtual Manchester City Football Club , você está no canal do sócio torcedor. Lembrando que seus dados serão utilizados de acordo com a lei de proteção de dados, e que ao continuar você estará autorizando o Manchester City a entrar em contato com você para receber ofertas e informações de nossos produtos.');
    }
    if (exibirMensagemNome && message.body !== null) {
        exibirMensagemNome = false;
        client.sendMessage(message.from, 'Poderia me informar seu nome?');
    }
    else if ((!exibirMensagemNome) && (nomeCliente === '')) {
        nomeCliente = message.body;
        console.log(nomeCliente);
        if (!validarNome(nomeCliente)) {
            client.sendMessage(message.from, 'Esse nome não é válido! Por favor, digite somente letras');
            nomeCliente = '';
        }
    }
    if (message.body === nomeCliente) {
        exibirMensagemCPF = false;
        client.sendMessage(message.from, 'Poderia me informar seu CPF?');
    }
    else if ((!exibirMensagemCPF) && (numeroCPF === '')) {
        numeroCPF = message.body;
        if (!validarCPF(numeroCPF)) {
            client.sendMessage(message.from, 'Esse CPF não é válido! Por favor, digite somente números');
            numeroCPF = '';
        }
    }
    if (message.body === numeroCPF) {
        salvarCliente(nomeCliente, numeroCPF);
        client.sendMessage(message.from, nomeCliente + ', logo entraremos em contato, agradecemos seu interesse para se tornar sócio torcedor do Manchester City Football Club');
        exibirMensagemInicial = true;
        exibirMensagemNome = true;
        nomeCliente = '';
        exibirMensagemCPF = true;
        numeroCPF = '';
    }
});
function salvarCliente(nomeCliente, numeroCPF) {
    const conexao = require("./conexao");
    conexao.insertCliente(nomeCliente, numeroCPF);
}
function validarNome(nomeCliente) {
    const regEx1 = /[^a-zA-Z\s]+/;
    nomeCliente = nomeCliente.replace(regEx1, '');
    return nomeCliente.length > 0;
}
function validarCPF(cpf) {
    const regEx1 = '^[0-9]+$';
    cpf = cpf.replace(regEx1, '');
    return cpf.length === 11;
}
client.initialize();
