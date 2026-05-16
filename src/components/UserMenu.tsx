'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogOut, LogIn } from "lucide-react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4 p-2 bg-white border border-black rounded-lg">
        {session.user?.image ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black">
            <Image src={session.user.image} alt="User" fill />
          </div>
        ) : (
          <User className="w-8 h-8 p-1 border border-black rounded-full" />
        )}
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase">{session.user?.name}</span>
          <button
            onClick={() => signOut()}
            className="text-[10px] font-bold uppercase underline hover:no-underline flex items-center gap-1"
          >
            <LogOut size={10} /> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
    >
      <LogIn size={14} /> Sign In with Google
    </button>
  );
}
