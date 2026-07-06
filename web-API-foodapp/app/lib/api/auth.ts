import axios from './axios'; // aaghi banako axios.ts bata
import {API} from './endpoints'

export const registerUser=async(registerData:any)=>{
    try{
        const response = await axios.post(
            API.AUTH.REGISTER,
            registerData
        );
        return response.data;
    } catch(err:Error | any){
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Registration failed"
        )
    }
}

export const loginUser = async(loginData: any)=>{
    try{
        const response = await axios.post(
            API.AUTH.LOGIN,
            loginData
        );
        return response.data;
    } catch(err:Error | any){
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Login failed"
        )
    }
}

export const whoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI, {
      withCredentials: true, // important to send cookie
      headers: {
        // Some setups may rely on Authorization header instead of cookies
        // (cookie name is auth_token)
      },
    });

    // API returns { success: true, data: { id, email, name, role, ... } }
    // So we need to return response.data.data
    return response.data.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Whoami failed');
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATEPROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // for file upload/multer
        }
      }
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Update profile failed');
  }
}