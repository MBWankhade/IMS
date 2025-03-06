import User from "../db/model.js";
import jwt from "jsonwebtoken";
import {jwtDecode} from 'jwt-decode'; 


export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Please Login." });
        }          

        const isCustomAuth = token.length < 500;         

        let decodedData; 

        if(token && isCustomAuth){
            decodedData = jwt.verify(token, process.env.JWT_SECRET);   
            const user = await User.findById(decodedData.id);
    
            if (!user) {
                return res.status(401).json({ message: "User Not Found." });
            }    
            
            req.user = user;
        }        
        else{
            decodedData = jwtDecode(token);  
            
            const user = await User.findOne({ googleId: decodedData.sub });

            if (!user) {
                return res.status(401).json({ message: "User Not Found." });
            }  

            req.user = user;
        }  
        next(); 

    } catch (error) {
        res.status(401).send({ error: "Please authenticate." });
    }
    }