'use client';

import { useState } from 'react';
import { registerSchema } from '../schema/register.schema';
import { registerService } from '../services/auth.service';

export function useRegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(form);
    if (!result.success) return;

    await registerService(form);
  };

  return { form, handleChange, handleSubmit };
}
