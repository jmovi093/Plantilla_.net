"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { OwlGuardian } from "../components/OwlGuardian"
import { Eye, EyeOff, Lock, User, Mail, UserPlus, Check } from "lucide-react"

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [owlEmotion, setOwlEmotion] = useState<"neutral" | "watching" | "hiding" | "happy" | "nervous" | "celebrating">(
    "neutral",
  )

  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

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
    } else if (focusedField === "password" || focusedField === "confirmPassword") {
      setOwlEmotion("hiding")
    } else if (focusedField) {
      setOwlEmotion("watching")
    } else if (formData.userName && formData.email && formData.password && formData.confirmPassword && !error) {
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

  const validateForm = (): boolean => {
    if (!formData.userName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor completa todos los campos")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    const success = await register({
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
    })

    if (success) {
      setSuccess(true)
      setOwlEmotion("celebrating")
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } else {
      setError("Error al crear la cuenta. El usuario podría ya existir.")
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <OwlGuardian emotion="celebrating" lookAtField={null} mousePosition={mousePosition} />
          </div>

          <div className="p-8 text-center border shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">¡Cuenta creada exitosamente!</h3>
            <p className="mb-4 text-gray-600">Tu cuenta ha sido creada correctamente.</p>
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <p className="text-sm text-green-700">Serás redirigido al login en unos segundos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="w-full max-w-md">
        {/* Búho Guardián */}
        <div className="mb-8">
          <OwlGuardian emotion={owlEmotion} lookAtField={focusedField} mousePosition={mousePosition} />
        </div>

        {/* Formulario de Registro */}
        <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Crear tu cuenta</h2>
            <p className="text-gray-600">Únete a nuestra plataforma</p>
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
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Elige tu nombre de usuario"
                value={formData.userName}
                onChange={handleChange}
                onFocus={() => handleFocus("userName")}
                onBlur={handleBlur}
              />
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
              />
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
                  className="w-full px-4 py-3 pr-12 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Mínimo 6 caracteres"
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

            {/* Campo Confirmar Contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4" />
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 pr-12 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          {/* Link a Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-500"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
