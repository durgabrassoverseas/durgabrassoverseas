import React, { useState } from 'react'

const RegisterPage = () => {
    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic password matching validation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Handle registration logic here, e.g., send data to an API
        console.log('Registration attempt with:', { name, email, password });
        // You would typically clear the form or redirect on success
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl space-y-6 transform hover:scale-[1.01] transition duration-500 ease-in-out"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                    Create Your Account
                </h2>
                <p className="text-center text-sm text-gray-500">
                    Join us and start your journey!
                </p>

                {/* Name Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="John Doe"
                    />
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>
                
                {/* Confirm Password Input */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        Register
                    </button>
                </div>

                {/* Optional: Link to Login */}
                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in here
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage