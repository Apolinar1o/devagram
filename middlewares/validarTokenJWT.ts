import {NextApiHandler, NextApiRequest, NextApiResponse} from "next"
import {RespostaPadramsg } from "@/types/respostaPadraoMsg"
import  Jwt, { JwtPayload } from "jsonwebtoken"

export const validarTokenJWT =  (handler :NextApiHandler) => 
     (req: NextApiRequest, res : NextApiResponse<RespostaPadramsg>) => {

        try{
            const {MINHA_CHAVE_JWT} = process.env
            if(!MINHA_CHAVE_JWT) {
                return res.status(500).json({erro: "env chave jwt não informado na execução do processo- "})
            }
    
            if(!req || !req.headers) {
                return res.status(401).json({erro: "não foi possivel validar o token de acesso"})
            }
            if(req.method !== "OPTION") {
                const authorization = req.headers["authorization"]
                if(!authorization) {
                    return res.status(401).json({erro: "não é possivel validar o tokne de acesso"})
                }
    
                const token = authorization.substring(7)
                if(!token) {
                    return res.status(401).json({erro: "não é possivel validar o token de acesso"})
                }
                const decoded =  Jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload
                if (!decoded) {
                    return res.status(401).json({erro: "não foi possivel validar o tokne de acesso"})
                }
    
                if(!req.query) {
                    req.query = {}
                }
    
                req.query.userId = decoded._id
    
            }
        } 
        catch(e) {
            console.log(e)
            return res.status(401).json({erro: "não foi possivel validar o tokne de acesso"})

        }

       
        return handler(req, res)
    }