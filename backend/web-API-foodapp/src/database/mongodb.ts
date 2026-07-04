import mongoose from "mongoose"; 
import { MONGODB_URI} from "../config/config"; 
export async function connectionDatabase(){
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return;
        }
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected sucessfull");
    }catch(error){
        console.error("Database Error:",error);
        process.exit(1);
    }
}
