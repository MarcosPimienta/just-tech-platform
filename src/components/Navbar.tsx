"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="h-16 border-b border-gray-200 bg-white flex items-center px-6 justify-between shrink-0 font-sans shadow-sm z-50 relative">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <Image src="/logo.png" alt="Just Tech Logo" width={40} height={40} className="object-contain" />
        <span className="font-bold text-xl tracking-tight text-gray-900 font-heading">JUST TECH</span>
      </Link>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            suppressHydrationWarning
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm transition-colors"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/create-course" className="bg-[#0f4a8a] text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm whitespace-nowrap">
          Create Course
        </Link>
        <Link href="#" className="text-gray-700 font-semibold text-sm hover:text-gray-900 transition-colors hidden sm:block">
          My Courses
        </Link>
        
        {session ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => signOut()}>
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 bg-[#0f4a8a] text-yellow-400 font-bold flex items-center justify-center text-xs shadow-sm">
                JT
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                {session.user?.name || session.user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-sm font-semibold text-[#0f4a8a] hover:text-blue-800 transition-colors">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
