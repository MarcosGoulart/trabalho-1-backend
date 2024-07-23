class Telefone {
    constructor(id, numero, ehPrincipal){
        this.id = id
        this.numero = numero
        this.ehPrincipal = ehPrincipal
    }

    static inserirLista(telefoneRepository, telefones, idUsuario){
        for(let telefone of telefones) {
            const objetoTelefone = new Telefone(null, telefone.numero, telefone.ehPrincipal)
            telefoneRepository.inserir(idUsuario, objetoTelefone)
        }
    }

    static deletarLista(telefoneRepository, telefones){
        for(let telefone of telefones){
            telefoneRepository.deletar(telefone.id)
        }
    }

    static atualizarLista(telefoneRepository, telefones){
        for(let telefone of telefones){
            let telefoneObjeto = new Telefone(telefone.id, telefone.numero, telefone.ehPrincipal)
            telefoneRepository.atualizar(telefoneObjeto)
        }
    }
}
const { inspect } = require('util')
class TelefoneRepository{
    constructor(db){
        this.db = db
    }

    buscarPorUsuario(idUsuario){
        const stmt = this.db.prepare('SELECT * FROM telefone WHERE id_usuario = ?')
        return stmt.all(idUsuario)
    }

    buscarTelefonePrincipal(idUsuario){
        const stmt = this.db.prepare(`SELECT * FROM telefone WHERE id_usuario = ? and eh_principal = true`)
        return stmt.get(idUsuario)
    }


    inserir(idUsuario, telefone) {
        const stmt = this.db.prepare(`INSERT INTO 
        telefone (numero, id_usuario, eh_principal)
        VALUES (?, ?, ?)`)

        return stmt.run(telefone.numero, idUsuario, telefone.ehPrincipal)
    }

    atualizar(telefone){
        const stmt = this.db.prepare(`UPDATE telefone SET numero = ?, eh_principal = ? WHERE id = ?`)
        return stmt.run(telefone.numero, telefone.ehPrincipal, telefone.id)
    }

    deletar(id){
        const stmt = this.db.prepare(`DELETE FROM telefone WHERE id = ?`)
        return stmt.run(id)
    }

    deletarPorUsuario(idUsuario){
        const stmt = this.db.prepare(`DELETE FROM telefone WHERE id_usuario = ?`)
        return stmt.run(idUsuario)
    }
}

module.exports = { TelefoneRepository, Telefone }