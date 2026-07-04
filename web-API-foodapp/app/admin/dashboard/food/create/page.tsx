"use client";

import React from "react";

import { useRouter } from "next/navigation";
import CreateFoodForm from "../components/CreateFoodForm";

const CreateFoodPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/dashboard/food");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Food Item</h1>
      <CreateFoodForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateFoodPage;