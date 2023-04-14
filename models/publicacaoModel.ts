import mongoose, {Schema, mongo} from "mongoose";

const publicacalSchema = new Schema({
    idUsuario : {type : String, required : true},
    descricao : {type : String, required : true},
    foto : {type : String, required : true},
    data : {type: Date, required : true},
    comentarios : {type: Array, required : true, default: []}
})

export const PublicacaoModel = (mongoose.models.publicacoes || mongoose.model("publicacoes", publicacalSchema))