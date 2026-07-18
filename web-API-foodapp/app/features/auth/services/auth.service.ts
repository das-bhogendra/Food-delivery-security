'use server';

import { LoginPayload, RegisterPayload } from '../types/auth.types';

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005';

export async function loginService(data: LoginPayload) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Login failed',
      };
    }

    return {
      success: true,
      user: result.user || result.data,
    };

  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: 'Login failed',
    };
  }
}

export const registerService = async (form: any) => {
  return {
    success: true,
  };
};