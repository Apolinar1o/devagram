import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {RespostaPadramsg} from '../types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadramsg>) => {
    try{
        await NextCors(req, res, {
            origin : '*',
            methods : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus : 200, // navegadores antigos dao problema quando se retorna 204
        });

        return handler(req, res);
    }catch(e){
        console.log('Erro ao tratar a politica de CORS:', e);
        return res.status(500).json({erro : 'Ocorreu erro ao tratar a politica de CORS'});
    }
}