import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadramsg} from '../../types/respostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectaBancoDeDados';
import { usuarioModel } from '../../models/usuarioModel';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../serviços/uploadImagemCosmic';

const handler = nc()
    .use(upload.single('file'))
    .put(async(req : NextApiRequest | any, res : NextApiResponse<RespostaPadramsg>) => {
        try{
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            
            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrado'});
            }

            const {nome} = req?.body;
            console.log(nome)
            if(nome && nome.length > 2){
                console.log("1")
                usuario.nome = nome;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                } 
            }

            await usuarioModel
                .findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({msg : 'Usuario alterado com sucesos'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Nao foi possivel atualizar usuario:' + e});
        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadramsg | any>) => {
        try{
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            console.log('usuario', usuario);
            usuario.senha = null;
            return res.status(200).json(usuario);
        }catch(e){
            console.log(e);
        }
    
        return res.status(400).json({erro : 'Nao foi possivel obter dados do usuario'})
    });

export const config = {
    api : {
        bodyParser : false
    }
}

export default (validarTokenJWT(conectarMongoDB(handler)));
