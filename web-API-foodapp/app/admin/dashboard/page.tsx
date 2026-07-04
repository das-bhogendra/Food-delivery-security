'use client';
import Image from 'next/image';

export default function AdminDashboardContent() {
  return (
    <div className="flex-1 flex flex-col p-8 space-y-8 bg-gray-100 min-h-screen">

      
      <div className="bg-black text-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 flex-1">
          <h2 className="text-2xl font-bold mb-2">Welcome Administrator!</h2>
          <p className="mb-4">
            Manage users, monitor orders, update menu items, and oversee the entire platform.
          </p>
          <button className="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">
            Manage Platform
          </button>
        </div>
        <div className="flex-1 relative h-56 md:h-auto">
          <Image
            src="/assets/images/hero-bg.jpg"
            alt="Admin Dashboard"
            fill
            className="object-cover rounded-r-2xl"
          />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold">245</p>
          <p className="text-yellow-500 text-sm">+12 this week</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">1,256</p>
          <p className="text-yellow-500 text-sm">+8% growth</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500 text-sm">Revenue Generated</p>
          <p className="text-2xl font-bold">$12,560</p>
          <p className="text-yellow-500 text-sm">+4.3%</p>
        </div>
      </div>

      {/* Top Selling Dishes */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Top Selling Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Image
              src="/assets/images/burger1.jpg"
              alt="Dish 1"
              width={200}
              height={150}
              className="object-cover"
            />
            <div className="p-4">
              <p className="font-semibold">Premium Burger</p>
              <p className="text-gray-500 text-sm">Total Sold: 320</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Image
              src="/assets/images/biryani2.jpg"
              alt="Dish 2"
              width={200}
              height={150}
              className="object-cover"
            />
            <div className="p-4">
              <p className="font-semibold">Special Biryani</p>
              <p className="text-gray-500 text-sm">Total Sold: 270</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Image
              src="/assets/images/pizza.jpg"
              alt="Dish 3"
              width={200}
              height={150}
              className="object-cover"
            />
            <div className="p-4">
              <p className="font-semibold">Deluxe Pizza</p>
              <p className="text-gray-500 text-sm">Total Sold: 198</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #1023</p>
              <p className="text-gray-500 text-sm">Customer: John Doe</p>
            </div>
            <p className="font-bold">$51</p>
          </li>
          <li className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #1024</p>
              <p className="text-gray-500 text-sm">Customer: Sarah Lee</p>
            </div>
            <p className="font-bold">$76</p>
          </li>
          <li className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #1025</p>
              <p className="text-gray-500 text-sm">Customer: Michael Ray</p>
            </div>
            <p className="font-bold">$64</p>
          </li>
        </ul>
      </div>

    </div>
  );
}