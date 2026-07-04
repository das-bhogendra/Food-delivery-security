'use client';
import React from 'react';
import Sidebar from './_components/Sidebar';
import Image from 'next/image';
import { BiSearch } from 'react-icons/bi'; // search icon

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/assets/icons/foodlogo.jpg"
                alt="Food Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-black">
              DpopFood Dashboard
            </span>
          </div>

          {/* Right: Search + Avatar */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative text-gray-400">
              <BiSearch className="absolute left-2 top-1/2 -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-8 flex-1 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}