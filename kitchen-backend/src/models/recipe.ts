import mongoose from "mongoose";
import { IRecipe } from "../types";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String] },
  directions: { type: [String] },
});

recipeSchema.set("toJSON", {
  transform: (
    _document,
    returnedObject: Partial<IRecipe> & {
      _id?: mongoose.Types.ObjectId;
      __v?: unknown;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    return returnedObject as IRecipe;
  },
});

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default Recipe;
