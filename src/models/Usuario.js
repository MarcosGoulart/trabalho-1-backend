const { Email } = require("./Email")
const { Telefone } = require("./Telefone")

class Usuario {
    constructor(id, nome, cpf, tipo, telefonePrincipal, telefones, emailPrincipal, emails){
        this.id = id
        this.nome = nome
        this.cpf = cpf
        this.tipo = tipo
        this.telefonePrincipal = telefonePrincipal
        this.telefones = telefones
        this.emailPrincipal = emailPrincipal
        this.emails = emails
    }

    podeAtualizar(){
        return this.tipo == 'cliente'
    }

    verificaExisteTelefonePrincipal(){
        let contadorPrincipal = 0
        console.log(this.telefones)
        for(let telefone of this.telefones) if(telefone.ehPrincipal == 1) contadorPrincipal++
        if(contadorPrincipal > 1) return { mensagem: 'Só é possível ter um Telefone principal', existe: false }
        else if(contadorPrincipal == 0 && this.telefones.length > 0) return { mensagem: 'É necessário ao menos um Telefone principal', existe: false }
        console.log('contador ' + contadorPrincipal)
        return { mensagem: null, existe: true }
    }

    verificaExisteEmailPrincipal(){
        let contadorPrincipal = 0
        for(let email of this.emails) if(email.ehPrincipal == 1) contadorPrincipal++
        if(contadorPrincipal > 1) return { mensagem: 'Só é possível ter um Email principal', existe: false }
        else if(contadorPrincipal == 0 && this.emails.length > 0) return { mensagem: 'É necessário ao menos um Email principal', existe: false }
        return { mensagem: null, existe: true }
    }

    atualizaTelefones(telefoneRepository){
        let telefonesAntigos = telefoneRepository.buscarPorUsuario(this.id)

        let telefonesInserir = this.telefones.filter((telefone) => { if(telefonesAntigos.findIndex((telefoneAntigo) => telefoneAntigo.id == telefone.id) == -1) return telefone })
        let telefonesDeletar = telefonesAntigos.filter((telefoneAntigo) => { if(this.telefones.findIndex((telefone) => telefoneAntigo.id == telefone.id) == -1) return telefoneAntigo })
        let telefonesAtualizar = this.telefones.filter((telefone) => { if(telefonesAntigos.findIndex((telefoneAntigo) => telefoneAntigo.id == telefone.id) != -1) return telefone })
        
        Telefone.inserirLista(telefoneRepository, telefonesInserir, this.id)

        Telefone.deletarLista(telefoneRepository, telefonesDeletar)

        Telefone.atualizarLista(telefoneRepository, telefonesAtualizar)
        
    }

    atualizarEmails(emailRepository){
        let emailsAntigos = emailRepository.buscarPorUsuario(this.id)

        let emailsInserir = this.emails.filter((email) => { if(emailsAntigos.findIndex((emailAntigo) => emailAntigo.email === email.email) == -1) return email })
        let emailsDeletar = emailsAntigos.filter((emailAntigo) => { if(this.emails.findIndex((email) => emailAntigo.email === email.email) == -1) return emailAntigo })
        let emailsAtualizar = this.emails.filter((email) => { if(emailsAntigos.findIndex((emailAntigo) => emailAntigo.email === email.email) != -1) return email })

        Email.inserirLista(emailRepository, emailsInserir, this.id)    

        Email.deletarLista(emailRepository, emailsDeletar)

        Email.atualizarLista(emailRepository, emailsAtualizar)
    }
}

class UsuarioRepository {
    constructor(db){
        this.db = db
    }

    buscaTodos(){
        const stmt = this.db.prepare('SELECT * FROM usuario')
        return stmt.all()
    }

    buscaPorId(id){
        console.log(id)
        const stmt = this.db.prepare(`SELECT * FROM usuario WHERE id = ?`)
        return stmt.get(id)
    }

    inserir(usuario){
        const stmt = this.db.prepare(` INSERT INTO 
        usuario (nome, cpf, tipo) 
        VALUES (?, ?, ?)`)
        return stmt.run(usuario.nome, usuario.cpf, usuario.tipo)
    }

    atualizar(usuario){
        const stmt = this.db.prepare(`UPDATE usuario SET nome = ?, cpf = ?, tipo = ? WHERE id = ?`)
        return stmt.run(usuario.nome, usuario.cpf, usuario.tipo, usuario.id)
    }

    deletar(id){
        const stmt = this.db.prepare(`DELETE FROM usuario WHERE id = ?`)
        return stmt.run(id)
    }
}

module.exports = { UsuarioRepository, Usuario }