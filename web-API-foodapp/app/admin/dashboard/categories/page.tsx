"use client";
import React, { useState } from "react";
import { CategoryProvider, useCategory, Category } from "../../../context/CategoryContext";
import CategoryCard from "./components/CategoryCard";
import CategoryTable from "./components/CategoryTable";
import { createCategory, updateCategory, deleteCategory } from "../../../lib/categoryApi";

const AdminCategoryPageInner = () => {
  const { categories, refreshCategories } = useCategory();
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing._id, { name, description });
      } else {
        await createCategory({ name, description });
      }
      setName("");
      setDescription("");
      setEditing(null);
      refreshCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure to delete this category?")) {
      await deleteCategory(id);
      refreshCategories();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Category Name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded flex-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {editing ? "Update" : "Add"}
        </button>
      </form>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>

      {/* Table */}
      <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

const AdminCategoryPage = () => {
  return (
    <CategoryProvider>
      <AdminCategoryPageInner />
    </CategoryProvider>
  );
};

export default AdminCategoryPage;