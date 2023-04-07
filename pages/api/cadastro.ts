import type {NextApiRequest, NextApiResponse} from "next"
import type {usuarioReq} from "../../types/usuarioReq"
import type { RespostaPadramsg } from "../../types/respostaPadraoMsg"
import  {usuarioModel} from "../../models/usuarioModel"
import md5 from "md5"
import {conectarMongoDB} from "../../middlewares/conectaBancoDeDados"

const endPointCadastro = async(req :NextApiRequest, res: NextApiResponse<RespostaPadramsg>) => {

    if(req.method === "POST") {
        const usuario = req.body as usuarioReq

        if(!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({erro: "nome inválido"})
        }
        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes("@") || !usuario.email.includes(".") ) {
            return res.status(400).json({erro: "email inválido"})
        }
        if(!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({erro: "senha inválida"})
        }
            //validação se ja existe com o mesmo email
            const usuariosComMesmoEmail = await usuarioModel.find({email: usuario.email})
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({erro:"já existe uma conta com o email informado"})
            }
            //salvar no banco de dados
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha)
            }
            await usuarioModel.create(usuario)
            return res.status(200).json({erro: "Usuario criado com sucesso"})
    } else {
        return res.status(405).json({erro : "método informado não é válido"})
    }

}

export default conectarMongoDB(endPointCadastro)