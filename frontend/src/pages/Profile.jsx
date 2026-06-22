import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get('https://typing-website-f8me.onrender.com/api/v1/scores/latest', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setScore(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load profile data'));
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700 mb-4">You need to log in to view your profile.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {score ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Last WPM</span>
              <span className="font-bold text-gray-800">{score.wpm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Accuracy</span>
              <span className="font-bold text-gray-800">{score.accuracy}%</span>
            </div>
          </div>
        ) : (
          !error && <p className="text-gray-500 text-center">No test results yet. Go take a typing test!</p>
        )}

        <Link to="/practice" className="block text-center mt-6 text-blue-600 hover:underline">
          Take a new test
        </Link>
      </div>
    </div>
  );
}

export default Profile;
