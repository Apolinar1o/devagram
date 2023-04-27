import type {NextApiRequest, NextApiResponse, NextApiHandler} from "next"
import { RespostaPadramsg  } from "@/types/respostaPadraoMsg"
import NextCors from "nextjs-cors"

export const politicaCORS =  (handler : NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadramsg>) => {
        try {
            console.log("1")
            await NextCors(req, res, {
                origin : "*",
                methods : ["GET", "PUT", "POST"],
                optionSuccessStatus: 200//navegadores antigos dao problema quando se retorna 204

            })
            return (handler(req, res))
        } catch(e) {
            console.log("2")
            console.log("erro ao tratar a politica de CORS ")
            res.status(500).json({erro: "OCorreu erro ao tratar politica de cors"})
        }
    }   
