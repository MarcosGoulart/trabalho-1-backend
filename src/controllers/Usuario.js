const db = require('../database/dbConnection')
const { UsuarioRepository, Usuario } = require('../models/Usuario') 
const { TelefoneRepository, Telefone } = require('../models/Telefone') 
const { EmailRepository, Email } = require('../models/Email')
const { inspect } = require('util')

class UsuarioController {

    constructor(){
        this.usuarioRepository = new UsuarioRepository(db)
        this.telefoneRepository = new TelefoneRepository(db)
        this.emailRepository = new EmailRepository(db)
    }

    listar(req, res) {
        console.log('entrou aqui')
        let usuarios = this.usuarioRepository.buscaTodos()
        
        for(let usuario of usuarios){
            //adicionando telefone principal
            const telefone = this.telefoneRepository.buscarTelefonePrincipal(usuario.id)
            if(telefone) usuario.telefonePrincipal = telefone.numero

            //adicionando email principal
            const email = this.emailRepository.buscarEmailPrincipal(usuario.id)
            if(email) usuario.emailPrincipal = email.email
        }
        //res.render('usuario', { usuarios })
        res.json(usuarios)
    }

    buscarPorId(req, res){
        const id = req.params.id
        const usuario = this.usuarioRepository.buscaPorId(id)
        
        //adicionando lista de telefones
        const telefones = this.telefoneRepository.buscarPorUsuario(usuario.id)
        usuario.telefones = telefones

        //adicionando lista emails
        const emails = this.emailRepository.buscarPorUsuario(usuario.id)
        usuario.emails = emails

        res.json(usuario)
    }

    cadastrar(req, res){
        const { nome, cpf, tipo, telefones, emails } = req.body
        const usuario = new Usuario(null, nome, cpf, tipo)
        let retornoUsuarioInserido = this.usuarioRepository.inserir(usuario)
        
        const idUsuario = retornoUsuarioInserido?.lastInsertRowid
        if (idUsuario) {
            //Insere telefones
            Telefone.inserirLista(this.telefoneRepository, telefones, idUsuario)

            //Insere emails
            Email.inserirLista(this.emailRepository, emails, idUsuario)
        }

        res.sendStatus(201)
    }

    atualizar(req, res){
        const { nome, cpf, tipo, telefones, emails } = req.body
        const { id } = req.params
        const usuario = new Usuario(id, nome, cpf, tipo, null, telefones, null, emails)

        //Verifica se o usuario pode ser atualizado
        if(usuario.podeAtualizar()) this.usuarioRepository.atualizar(usuario)

        //Verifica se existe apenas um telefone principal
        let exiteTelefonePrincipal = usuario.verificaExisteTelefonePrincipal()
        console.log(inspect(exiteTelefonePrincipal))
        if(!exiteTelefonePrincipal.existe) return res.status(400).send(exiteTelefonePrincipal.mensagem)
        
        //Verifica se existe apenas um email principal
        let exiteEmailPrincipal = usuario.verificaExisteEmailPrincipal()
        if(!exiteEmailPrincipal.existe) return res.status(400).send(exiteEmailPrincipal.mensagem)
        
        //Atualiza telefone
        usuario.atualizaTelefones(this.telefoneRepository)
        
        //Atualiza email
        usuario.atualizarEmails(this.emailRepository)
        
        res.sendStatus(200)
    }

    deletar(req, res){
        const id = req.params.id

        //Verifica se o usuario é admin
        const usuario = this.usuarioRepository.buscaPorId(id)
        if(usuario.tipo == 'admin') return res.status(403).send('Usuário admin não pode ser removido')

        this.telefoneRepository.deletarPorUsuario(id)
        this.emailRepository.deletarPorUsuario(id)
        this.usuarioRepository.deletar(id)
        res.sendStatus(200)
    }
}

module.exports = { UsuarioController }