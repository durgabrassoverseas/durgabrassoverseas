import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'; // Importing icons for a modern touch

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.auth); // Destructuring only 'loading' as 'error' is handled in the catch block

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        try {
            // Using a simple loading toast for immediate feedback
            const loginPromise = dispatch(login({ email, password })).unwrap();
            
            // Wait for the promise and handle success/navigation
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
                        // Assuming err is an object/string containing the error message
                        return err.message || String(err) || 'Login failed.';
                    },
                }
            );

            // Navigation happens after successful unwrap
            if (res.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            // The toast.promise handles the error display, so we just catch it silently here
            // console.error("Final catch block:", err);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 space-y-7 transition duration-300 ease-in-out"
                onSubmit={handleLogin}
            >
                {/* Header */}
                <div className="text-center">
                    <LogIn className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Sign In
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Access your control panel.
                    </p>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Auxiliary Links */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                            Forgot password?
                        </a>
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>

                {/* Link to Sign Up */}
                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                            Sign up here
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;