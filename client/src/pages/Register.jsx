import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { User, Lock, Mail, GraduationCap } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default to student
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      // Redirect based on selected role
      if (role === "professor") navigate("/professor-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      alert("Registration failed. Email might be taken.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* Role Selection */}
          <div className="relative">
            <GraduationCap className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;