import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { logout, isLoggedIn } = useContext(AuthContext);

  return (
    <nav>
      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </nav>
  );
}