import { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from "../../middlewares/conectaBancoDeDados"
import {validarTokenJWT} from "../../middlewares/validarTokenJWT"
import { RespostaPadramsg } from "@/types/respostaPadraoMsg";
import { usuarioModel } from "./login";
import usuario from "./usuario";

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadramsg | any[]>) => {
    try {
        if(req.method === "GET") {
            if(req?.query?.id) {
                const usuarioEncontrado = await usuarioModel.findById(req?.query?.id)
                if(!usuarioEncontrado) {
                    return res.status(405).json({erro: "usuario não encontrado"})
                }
                usuarioEncontrado.senha = null
                return res.status(200).json(usuarioEncontrado)
            }else {
                const {filtro} = req.query

                if(!filtro || filtro.length < 2) {
                    return res.status(400).json({erro: "favor informar com pelos menos 2 caracteres"})
    
                }
                const usuarioEncontrados = await usuarioModel.find({
                        nome: {$regex: filtro, $options: "i" }, 
                        //email: {$regex: filtro, $options: "i"}
                       
                })
                return res.status(200).json(usuarioEncontrados)
    
            }
            return res.status(405).json({erro: "metodo incorreto"})
            }
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({erro: "não foi possivel buscar usuarios"})
    }
} 

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))