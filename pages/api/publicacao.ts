import type { NextApiResponse, } from "next"
import type {RespostaPadramsg} from "../../types/respostaPadraoMsg"
import nc from "next-connect"
import {upload, uploadImagemCosmic} from "../../serviços/uploadImagemCosmic"
import {conectarMongoDB } from "../../middlewares/conectaBancoDeDados"
import {validarTokenJWT} from "../../middlewares/validarTokenJWT"
import { usuarioModel} from "@/models/usuarioModel"
import { PublicacaoModel } from "@/models/publicacaoModel"

    const handler = nc()
    .use(upload.single("file"))
    .post(async (req: any, res: NextApiResponse<RespostaPadramsg>) => {

        try{

            const {userId} = req.query
            const usuario = await usuarioModel.findById(userId)
            if(!usuario) {
                return res.status(400).json({erro: "usuario não encontrado"})
            }

            if(!req || !req.body ) {
                return res.status(400).json({erro:"paramentros não informados"})
            }
            const {descricao} = req?.body
            
            if(!descricao || descricao.length < 2) {
                return res.status(400).json({erro: "Descrição não é valida"})
            }

            if(!req.file || !req.file.originalname) {
                return res.status(400).json({erro: "A imagem é obrigatória"})
            }
            const image = await uploadImagemCosmic(req);
         
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data: new Date()
            }
       
            await PublicacaoModel.create(publicacao);
          
            return res.status(200).json({msg:"publicação criada com sucesso"});
        
        }
        catch(e){
            console.log(e);
            res.status(200).json({erro: "erro ao cadastrar publicação"})
    }
    })



export const config = {
    api : {
        bodyParser: false
    }
}
    export default validarTokenJWT(conectarMongoDB(handler)) 