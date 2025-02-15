import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Home = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLogin) {
      if (!email || !password) {
        setErrorMessage('Please fill in all fields');
        return;
      }
      try {
        const response = await axios.post('https://allcart-backend.onrender.com/api/auth/login', {
          email,
          password
        });
        localStorage.setItem('token', response.data.token);
        onLogin();
        navigate('/product');
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Invalid credentials');
      }
    } else {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in all fields');
        return;
      }
      try {
        const response = await axios.post('https://allcart-backend.onrender.com/api/auth/register', {
          name,
          email,
          password
        });
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
      <h1 className="text-white text-4xl font-bold mb-6">Allcart</h1>
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold text-dark mb-4">
          {isLogin ? 'Welcome Back' : 'Sign Up'}
        </h2>
        {errorMessage && (
          <p className="text-red-400 text-center mb-2">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 rounded-lg bg-dark bg-opacity-30 text-white placeholder-gray-700 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-dark placeholder-gray-700 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 text-dark placeholder-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-dark bg-opacity-30 text-white font-bold py-2 rounded-lg hover:bg-opacity-50 transition duration-300"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-white mt-4">
          {isLogin ? "New user? " : "Already have an account? "}
          <button 
            className="underline" 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
              setEmail('');
              setPassword('');
              setName('');
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Home;