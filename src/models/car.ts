import mongoose,{Schema,Document,Model} from "mongoose";

export interface ICar extends Document{
    name:string;
    modelName:string;
    imagePath:string,
    owner:mongoose.Types.ObjectId
}

const CarSchema :Schema<ICar> =new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        modelName:{
            type:String,
            required:true
        },
        imagePath:{
            type:String,
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps: {
          createdAt: "createdAt",
          updatedAt: "updatedAt",
        },
      }
)

export const CarModel: Model<ICar> = mongoose.model<ICar>(
    "Car",
    CarSchema
  );
