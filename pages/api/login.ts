    import type {NextApiRequest, NextApiResponse} from "next"
    import {conectarMongoDB} from "../../middlewares/conectaBancoDeDados" 
    import type {RespostaPadramsg} from "../../types/respostaPadraoMsg"
    import type {loginResposta} from "../../types/loginResposta"
    import md5 from "md5"
    import { usuarioModel } from "@/models/usuarioModel"
    export {usuarioModel} from "../../models/usuarioModel"
    import jwt from "jsonwebtoken"
    
    const endpointLogin =  async(   
        req: NextApiRequest,
        res: NextApiResponse<RespostaPadramsg | loginResposta>
    ) => {

        const {MINHA_CHAVE_JWT} = process.env
        if(!MINHA_CHAVE_JWT) {
           return res.status(500).json({erro: "env jwt não informada"})
        }

        if(req.method === "POST") {
            const {login, senha} = req.body

            const usuariosEncontrados = await usuarioModel.find({email: login, senha : md5(senha)})
            if(usuariosEncontrados && usuariosEncontrados.length > 0) {
                
                const usuarioLogado = usuariosEncontrados[0]

                const token = jwt.sign({_id: usuarioLogado._id}, MINHA_CHAVE_JWT)

                return res.status(200).json({
                    nome: usuarioLogado.nome,
                     email: usuarioLogado.email,
                     token})

            } else {
                return res.status(405).json({erro: "Usuario ou senha não encontrados"})
            }
        }
         else {
            return res.status(405).json({erro: "metodo informnado não é válido"})
         }
      
    }

    export default conectarMongoDB(endpointLogin)