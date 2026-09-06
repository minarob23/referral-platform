'use client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <span className="font-bold text-xl text-blue-600">ReferralAI</span>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        <Link href="/referrals" className="text-gray-600 hover:text-blue-600">My Referrals</Link>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Hi, {user.name}</span>
        <button
          onClick={logout}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
