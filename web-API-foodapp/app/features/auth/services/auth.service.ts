'use server';

import { LoginPayload, RegisterPayload } from '../types/auth.types';

const API_URL = 'http://localhost:5005';

export async function loginService(data: LoginPayload) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 COOKIE के लिए MUST
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message };
    }

    return { success: true, user: result.user };

  } catch (err) {
    console.error(err);
    return { success: false, message: 'Login failed' };
  }
}

export const registerService = async (form: any) => {
  // Implement registration logic here
  return { success: true };
};
