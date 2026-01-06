import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png'; // Import your logo

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.auth);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        try {
            const loginPromise = dispatch(login({ email, password })).unwrap();
            
            const res = await toast.promise(
                loginPromise,
                {
                    loading: 'Authenticating...',
                    success: (res) => {
                        console.log("Login successful, navigating based on role:", res.user.role);
                        return res.message || 'Login successful!';
                    },
                    error: (err) => {
                        console.error(err);
                        return err.message || String(err) || 'Login failed.';
                    },
                }
            );

            if (res.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            // Error handled by toast.promise
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            <form
                className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 space-y-6 transition-all duration-300 hover:shadow-indigo-200/50"
                onSubmit={handleLogin}
            >
                {/* Logo and Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Sign in to access your dashboard
                        </p>
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm bg-gray-50/50 hover:bg-white"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm bg-gray-50/50 hover:bg-white"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center group">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                            disabled={loading}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors">
                            Remember me
                        </label>
                    </div>
                    <a 
                        href="#" 
                        className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full"
                    >
                        Forgot password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                        </>
                    )}
                </button>

                {/* Divider */}
                {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-4 bg-white text-gray-500 font-medium">
                            New to our platform?
                        </span>
                    </div>
                </div> */}

                {/* Sign Up Link */}
                {/* <div className="text-center">
                    <a 
                        href="/register" 
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
                    >
                        Create an account
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div> */}
            </form>
        </div>
    );
}

export default LoginPage;
