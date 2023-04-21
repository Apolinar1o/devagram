import mongoose, {Schema} from "mongoose"

const seguidorSchema = new Schema({
    usuarioId : {type: String, required: true},
    usuarioSeguidoId : {type : String, required: true}
})
export const seguidorModel = (mongoose.models.seguidoree || mongoose.model("seguidores", seguidorSchema))