"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/foodlogo.jpg"
            alt="FoodWorld Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-gray-800">FoodWorld</span>
        </div>
        <nav className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Dashboard
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 pt-32 pb-20 max-w-6xl mx-auto">
        {/* Text */}
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6">
            Delicious Food,
            <span className="text-orange-500 block">Delivered Fast</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the best food delivery service with fresh ingredients, amazing flavors,
            and lightning-fast delivery to your doorstep.
          </p>

          {!user && (
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 shadow-lg transition transform hover:scale-105"
              >
                Start Ordering
              </Link>
              <Link
                href="/food-menu"
                className="px-8 py-4 border-2 border-orange-500 text-orange-500 text-lg font-semibold rounded-xl hover:bg-orange-50 transition transform hover:scale-105"
              >
                See Menu
              </Link>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 relative">
          <Image
            src="/assets/images/food.jpg"
            alt="Delicious food"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mt-16 px-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-orange-400 rounded-full flex items-center justify-center mb-4">
            <Image src="/assets/icons/gradient.jpg" alt="Fresh Ingredients" width={32} height={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
          <p className="text-gray-600">We use only the freshest ingredients sourced locally.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full flex items-center justify-center mb-4">
            <Image src="/assets/icons/delivery.jpg" alt="Fast Delivery" width={32} height={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Get your food delivered in under 30 minutes.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <div className="w-16 h-16 bg-gradient-to-r from-green-200 to-green-400 rounded-full flex items-center justify-center mb-4">
            <Image src="/assets/icons/quality.jpg" alt="Best Quality" width={32} height={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
          <p className="text-gray-600">Rated 5 stars by thousands of satisfied customers.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-24 bg-orange-50 py-12 px-6 rounded-3xl shadow-inner max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Our Customers Say</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-600 mb-4">"Amazing food and super fast delivery. Highly recommend!"</p>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/user.jpg"
                alt="User 1"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">Ramesh</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Image key={i} src="/assets/icons/star.jpg" alt="Star" width={16} height={16} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Add more testimonial cards as needed */}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-gray-600 bg-white/50 backdrop-blur-sm border-t mt-16">
        <div className="max-w-6xl mx-auto">
          <p>&copy; {new Date().getFullYear()} FoodWorld. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/about" className="hover:text-orange-500 transition">About</Link>
            <Link href="/contact" className="hover:text-orange-500 transition">Contact</Link>
            <Link href="/privacy" className="hover:text-orange-500 transition">Privacy</Link>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="#" className="hover:text-orange-500 transition">
              <Image src="/assets/icons/facebook.jpg" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="#" className="hover:text-orange-500 transition">
              <Image src="/assets/icons/instagram.jpg" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="#" className="hover:text-orange-500 transition">
              <Image src="/assets/icons/twitter.jpg" alt="Twitter" width={24} height={24} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}