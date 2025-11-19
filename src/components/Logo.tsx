import { Link } from "react-router-dom"

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
    
      <span className="font-bold text-lg hidden sm:inline">NOLabel</span>
    </Link>
  )
}

export default Logo
