import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const useApiMutation = (loadingMessage="Processing...",endpoint, method = "post", config = {}) => {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState(null);

    const executeMutate = async (data = {}) => { 
        let toastId;
    
        if (method !== "get") {
            toastId = toast.loading(loadingMessage);
        }
        try {
            setLoading(true);
    
            const resp = await axios({
                url: `${import.meta.env.VITE_BACKEND_URL}/api${endpoint}`, 
                method,
                data,  
                ...config
            });
    
            setRes(resp);
            
            toast.update(toastId, { 
                render: resp.data?.message || "Done", 
                type: "success", 
                isLoading: false, 
                autoClose: 3000 
            });
    
        } catch (err) {
            console.error("API Error:", err);
    
            toast.update(toastId, { 
                render: err.response?.data?.message || "Something Went Wrong!", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000
            });
    
        } finally {
            setLoading(false);
        }
    };

    return [executeMutate, res, loading];
};
