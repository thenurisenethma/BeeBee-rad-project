import type { ReactNode } from "react"
import loginbee from "../assets/loginbee.png"

interface AuthCardProps {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-200 to-yellow-200 px-4">
      
      {/* Cards */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        
        {/* BeeBee */}
        <img
          src={loginbee}
          alt="bee"
          className="
            absolute 
            -top-10 
            -left-30 
            w-70 h-50  
            pointer-events-none
          "
        />

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h1>

        {children}
      </div>
    </div>
  )
}