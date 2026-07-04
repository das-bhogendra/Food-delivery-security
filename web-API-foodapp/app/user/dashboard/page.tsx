'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/user/dashboard/food' },
    { name: 'Orders', href: '/user/dashboard/orders' },
    { name: 'Cart', href: '/user/dashboard/cart' },
    { name: 'Profile', href: '/user/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-yellow-400 mb-10">
          dpopfood
        </h2>

        <ul className="space-y-4">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  pathname === link.href
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Activity
          </h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg px-3 py-1"
            />
            <span className="text-gray-600">15 May 2020 8:00 am</span>
            <div className="w-8 h-8 rounded-full bg-black"></div>
          </div>
        </div>

        {/* ================= DASHBOARD CONTENT ================= */}
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div className="bg-black text-white rounded-2xl overflow-hidden flex">
            <div className="p-8 flex-1">
              <h2 className="text-2xl font-bold mb-2">Welcome People!</h2>
              <p>Enjoy your order with dpopfood management dashboard foodist</p>
              <button className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg">
                Learn more
              </button>
            </div>
            <div className="flex-1 relative">
              <Image
                src="/assets/images/hero-bg.jpg"
                alt="Welcome Food"
                width={400}
                height={300}
                className="object-cover"
              />
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Order Complete</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-green-500 text-sm">+15.6%</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Order Delivered</p>
              <p className="text-2xl font-bold">97</p>
              <p className="text-green-500 text-sm">+5.6%</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Order Canceled</p>
              <p className="text-2xl font-bold">07</p>
              <p className="text-red-500 text-sm">+1.1%</p>
            </div>
          </div>

          {/* Popular Dishes */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Popular Dishes</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/burger1.jpg"
                  alt="Dish 1"
                  width={200}
                  height={150}
                  className="object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold">Dish Name 1</p>
                  <p className="text-gray-500 text-sm">$51</p>
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
                  <p className="font-semibold">Dish Name 2</p>
                  <p className="text-gray-500 text-sm">$56</p>
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
                  <p className="font-semibold">Dish Name 3</p>
                  <p className="text-gray-500 text-sm">$66</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prepared Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Prepared Orders</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Nasi Goreng</p>
                  <p className="text-gray-500 text-sm">Main Course</p>
                </div>
                <p className="font-bold">$51</p>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Udang Semur</p>
                  <p className="text-gray-500 text-sm">Soups</p>
                </div>
                <p className="font-bold">$56</p>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Meat Ball May</p>
                  <p className="text-gray-500 text-sm">Appetizer</p>
                </div>
                <p className="font-bold">$66</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}