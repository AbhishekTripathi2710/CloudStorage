import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Login to Your Cloud Storage
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-3">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-gray-700">Email</label>
                        <input 
                            type="email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700">Password</label>
                        <input 
                            type="password"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
