import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://typing-website-kr3a.onrender.com/api/v1/scores/latest', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScore(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load profile data');
      } finally {
        // This ensures the loading message disappears after the request finishes
        setLoading(false); 
      }
    };
    fetchProfile();
  }, []);

  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="mb-4">You need to log in to view your profile.</p>
          <Link to="/login" className="text-blue-600 underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {loading ? <p className="text-center">Loading...</p> : (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {score ? (
              <div className="space-y-3">
                <p>Last WPM: <strong>{score.wpm}</strong></p>
                <p>Last Accuracy: <strong>{score.accuracy}%</strong></p>
              </div>
            ) : !error && <p className="text-center">No test results yet.</p>}
          </>
        )}
        <Link to="/practice" className="block mt-6 text-blue-600 hover:underline text-center">Take a new test</Link>
      </div>
    </div>
  );
}

export default Profile;
