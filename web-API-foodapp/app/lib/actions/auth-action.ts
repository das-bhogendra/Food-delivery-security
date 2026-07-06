"use server"

import { success } from "zod";
import {loginUser, registerUser, updateProfile} from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";
export const handleRegister = async(formData: any)=>{
    try{
        const result = await registerUser(formData);
        //handle how to send data back to component
        if(result.success){
            return{
                success:true,
                message: "Registration sucessful",
                data: result.data
            };
        }
        return{
            success: false,
            message:result.message || "registration failed"
        }
    } catch(err:Error | any){
        return{
            sucess:false, message:err.message || "Registration failed"
        }
    }
}

export const handleLogin = async(formData: any)=>{
    try{
        const result = await loginUser(formData);
        // Normalize possible backend shapes: { user, token } or { data: { user, token } } or { data: user }
        const user = result.user || result.data?.user || result.data || null;
        const token = result.token || result.data?.token || null;

        if (user) {
            try {
                await setUserData(user);
            } catch (e) {
                // ignore cookie set errors
            }
            if (token) {
                try {
                    await setAuthToken(token);
                } catch (e) {}
            }
            return { success: true, message: "Login successful", data: user, token };
        }

        return { success: false, message: result.message || "Login failed" };
    } catch(err: any){
        // IMPORTANT: forward backend message exactly as received.
        // Axios error shape: err.response?.data?.message (or err.response?.data)
        const backendMessage = err?.response?.data?.message;
        const backendMessageFallback = err?.response?.data?.message || err?.message;

        // Extract backend message without modifying it.
        const extractedMessage =
          (typeof backendMessage === "string" && backendMessage) ||
          (typeof backendMessageFallback === "string" && backendMessageFallback) ||
          (typeof err?.message === "string" && err.message) ||
          "";

        return {
          sucess: false,
          // Guarantee `message` is always a string (never undefined).
          message: extractedMessage || "Login failed",
        };
    }
}

export const updateProfileAction = async (profileData: any) => {
    // Implement your update logic here
    return { success: true, data: profileData, message: "Profile updated successfully" };
};

export const revalidatePath = async (path: string) => {
    // Implement your revalidation logic here
    return true;
};

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}