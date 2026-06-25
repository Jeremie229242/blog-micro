

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string);

    console.log(" MongoDB Connecté");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;