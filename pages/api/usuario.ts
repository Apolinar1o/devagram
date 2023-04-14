import type {NextApiRequest, NextApiResponse} from "next"
import { validarTokenJWT } from "@/middlewares/validarTokenJWT" 
const usuarioEndPoint = (req : NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json("USuario autenticado com sucesso")
}

export default validarTokenJWT(usuarioEndPoint)