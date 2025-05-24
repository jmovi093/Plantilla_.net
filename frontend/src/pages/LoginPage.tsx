"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { OwlGuardian } from "../components/OwlGuardian"
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react"

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [owlEmotion, setOwlEmotion] = useState<"neutral" | "watching" | "hiding" | "happy" | "nervous" | "celebrating">(
    "neutral",
  )

  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (error) {
      setOwlEmotion("nervous")
    } else if (focusedField === "password") {
      setOwlEmotion("hiding")
    } else if (focusedField) {
      setOwlEmotion("watching")
    } else if (formData.userName && formData.password && !error) {
      setOwlEmotion("happy")
    } else {
      setOwlEmotion("neutral")
    }
  }, [error, focusedField, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.userName || !formData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    const success = await login(formData)
    if (success) {
      setOwlEmotion("celebrating")
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 2000)
    } else {
      setError("Credenciales inválidas. Por favor verifica tu usuario y contraseña.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Búho Guardián */}
        <div className="mb-8">
          <OwlGuardian emotion={owlEmotion} lookAtField={focusedField} mousePosition={mousePosition} />
        </div>

        {/* Formulario de Login */}
        <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="text-gray-600">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border-l-4 border-red-400 rounded-lg bg-red-50">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campo Usuario */}
            <div className="space-y-2">
              <label htmlFor="userName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                Usuario
              </label>
              <div className="relative">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Ingresa tu usuario"
                  value={formData.userName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("userName")}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 pr-12 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Link a Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
