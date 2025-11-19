export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters"
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter"
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number"
  }
  return null
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}
