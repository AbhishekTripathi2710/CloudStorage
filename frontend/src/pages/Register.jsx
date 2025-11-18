import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register(username, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create Your Account
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-3">{error}</p>
                )}

                <form onSubmit={handleRegister} className="space-y-4">

                    <div>
                        <label className="block font-semibold text-gray-700">Username</label>
                        <input 
                            type="text"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}
