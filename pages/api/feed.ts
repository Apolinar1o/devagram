import type {NextApiRequest, NextApiResponse} from "next"
import type {RespostaPadramsg} from "../../types/respostaPadraoMsg"
import { validarTokenJWT } from "@/middlewares/validarTokenJWT" 
import { conectarMongoDB } from "@/middlewares/conectaBancoDeDados" 
import { connect } from "http2"
import { usuarioModel } from "./login"
import { PublicacaoModel } from "@/models/publicacaoModel"
import usuario from "./usuario"
import { seguidorModel } from "@/models/seguidorModel"
import { idText } from "typescript"

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadramsg | any> ) =>{
    try{
        if(req.method ==="GET") {
            
            if(req?.query?.id){

                const usuario  = await usuarioModel.findById(req?.query?.id)
                if(!usuario){
                    return res.status(200).json({msg: "usuario não encontrado"})
                }
                const publicacoes = await PublicacaoModel.find({idUsuario :  usuario._id}).sort({data: -1})
                return res.status(200).json(publicacoes)
            } else {
                const {userId} = req?.query
                const usuarioLogado = await usuarioModel.findById(userId)
                if(!usuarioLogado) {
                    return res.status(400).json({erro: "usuario não encontrado"})
                }

                const seguidores = await seguidorModel.findById({usuarioId : usuarioLogado._id})
                
                const publicacoes = await PublicacaoModel.findById({
                    $or : [
                       { IdUsuario :  usuarioLogado._id},
                       {IdUsuario : }

                    ]
                })


            }

         
        }
        return res.status(405).json({erro: "método errado"})
    }catch(e) {
        console.log(e)
    }     return res.status(400).json({erro:"Erro ao tentar obter o feed"})
    }

export default validarTokenJWT(conectarMongoDB(feedEndpoint))