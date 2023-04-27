import type {NextApiRequest, NextApiResponse} from "next"
import type {usuarioReq} from "../../types/usuarioReq"
import type { RespostaPadramsg } from "../../types/respostaPadraoMsg"
import  {usuarioModel} from "../../models/usuarioModel"
import md5 from "md5"
import {conectarMongoDB} from "../../middlewares/conectaBancoDeDados"
import {upload, uploadImagemCosmic} from "../../serviços/uploadImagemCosmic"
import nc from "next-connect"
import { politicaCORS } from "@/middlewares/potilcaCORS"

const handler = nc()
    .use(upload.single('file'))
    .post(  async(req :NextApiRequest, res: NextApiResponse<RespostaPadramsg>) => {

        
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
                // enviar a imagem do multer para o cosmic
                const image = await uploadImagemCosmic(req)


                //salvar no banco de dados
                const usuarioASerSalvo = {
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: md5(usuario.senha),
                    avatar: image?.media?.url
                }
                await usuarioModel.create(usuarioASerSalvo)
                return res.status(200).json({msg: "Usuario criado com sucesso"})
    
    }
    )

export const config = {
    api: {
        bodyParser : false
    }
}
  
export default politicaCORS(conectarMongoDB(handler))