import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://typing-website-f8me.onrender.com/api/v1/user/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      alert('Login Successful!');
    } catch (error) {
      alert('Login Failed: ' + (error.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 border border-gray-300 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
          Sign In
        </button>
                <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
        </p>
      </form>

      
    </div>
  );
}

export default Login;
