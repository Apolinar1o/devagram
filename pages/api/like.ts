import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectaBancoDeDados";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadramsg } from "@/types/respostaPadraoMsg";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { usuarioModel } from "../../models/usuarioModel";

const likeEndpoint = async(req: NextApiRequest, res: NextApiResponse<RespostaPadramsg>) => {
    try {
        if(req.method === "PUT") {
            const {id} = req?.query
            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({erro: "publicação não encontrado"})
            }
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId)
            if(!usuario){
                return res.status(400).json({erro: "usuario não encontrado"})
            }
            console.log("2")
            const indexUsuarioLike = publicacao.like.findIndex((e: any) => e.toString() === usuario.id.toString())
            console.log("3")
            if(indexUsuarioLike != -1) {
                publicacao.like.splice(indexUsuarioLike, 1)
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)
                return res.status(200).json({msg: "publicacao descurtida com sucesso"})
            } else {
                publicacao.like.push(usuario._id)
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)
                return res.status(200).json({msg : "publicação curtida com sucesso"})
            }
        }
        return res.status(400).json({erro: "erro no metodo"})
    } catch (e) {
       console.log(e) 
       return res.status(500).json({erro: "não foi possivel dar like/deslike"})
    }
}
export default validarTokenJWT(conectarMongoDB(likeEndpoint))