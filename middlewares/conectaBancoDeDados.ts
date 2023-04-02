import type {NextApiRequest, NextApiResponse, NextApiHandler} from "next"
import mongoose from "mongoose"
import type {RespostaPadramsg} from "../types/respostaPadraoMsg"

export const conectarMongoDB = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res : NextApiResponse<RespostaPadramsg>) => {

        //veriricar se o bando ja esta conectado, se tiver seguir para o endpoint
        if(mongoose.connections[0].readyState) {
            return handler(req, res)
        }
        //ja que nao está conectado vamos conectar
        //obter a variavel de ambiente preenchido do env
        const {DB_CONEXAO_STRING} = process.env

        //se a env estiver aborta o uso do sistema e avise o programador
        if(!DB_CONEXAO_STRING) {
            return res.status(500).json({erro: "ENV de configuração do banco, não informado"})

        }

        mongoose.connection.on("connected", () => console.log("Banco de dados conectado"))
        mongoose.connection.on("error", () => console.log("ocorreu um erro no banco de dados"))
        await mongoose.connect(DB_CONEXAO_STRING)

        //agora posso seguir para endpoint, pois estou conectado
        // no banco
        return handler(req, res)
    }
