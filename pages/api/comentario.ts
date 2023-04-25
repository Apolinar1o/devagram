import { conectarMongoDB } from "@/middlewares/conectaBancoDeDados";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadramsg } from "@/types/respostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import { usuarioModel } from "./login";
import { PublicacaoModel } from "@/models/publicacaoModel";

const comentarioEndpoint = async(req: NextApiRequest, res: NextApiResponse<RespostaPadramsg>) => {
 

    try {
        if(req.method ==="PUT") {
                const {userId, id} = req.query
                const usuarioLogado = await usuarioModel.findById(userId)
                if(!usuarioLogado) {
                    return res.status(400).json({erro: "não foi possivel de achar usuario"})

                }
                const publicacao = await PublicacaoModel.findById(id)
                if(!publicacao) {
                    return res.status(405).json({erro: "publicação não encontrada"})

                }

                if(!req.body || !req.body.comentario || req.body.comentario.length < 2) {
                    return res.status(405).json({erro: "comentario invalido"})

                }
                const comentarios = {
                    usuarioId: usuarioLogado._id,
                    nome: usuarioLogado.nome,
                    comentario : req.body.comentario
                }
                publicacao.comentarios.push(comentarios)
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
                return res.status(200).json({erro: "comentario enviado com sucesso"})
        }
        return res.status(405).json({erro: "Metodo inválido"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({erro: "impossivel de comentar"})
    }
}
export default validarTokenJWT(conectarMongoDB(comentarioEndpoint )) 