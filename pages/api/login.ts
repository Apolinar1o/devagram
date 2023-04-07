    import type {NextApiRequest, NextApiResponse} from "next"
    import {conectarMongoDB} from "../../middlewares/conectaBancoDeDados" 
    import type {RespostaPadramsg} from "../../types/respostaPadraoMsg"
    import md5 from "md5"
import { usuarioModel } from "@/models/usuarioModel"
    export {usuarioModel} from "../../models/usuarioModel"
    
    const endpointLogin =  async(   
        req: NextApiRequest,
        res: NextApiResponse<RespostaPadramsg>
    ) => {
        if(req.method == "POST") {
            const {login, senha} = req.body

            const usuariosEncontrados = await usuarioModel.find({email: login, senha : md5(senha)})
            if(usuariosEncontrados && usuariosEncontrados.length > 0) {
                
                const usuarioLogado = usuariosEncontrados[0]
                return res.status(200).json({msg : `Usuario ${usuarioLogado.nome} autenticado com sucesso`})

            } else {
                return res.status(405).json({erro: "Usuario ou senha não encontrados"})
            }
        }
        return res.status(405).json({erro: "metodo informnado não é válido"})
    }

    export default conectarMongoDB(endpointLogin)