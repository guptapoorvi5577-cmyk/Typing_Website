import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import TypingBox from './components/TypingBox'; // Import your game

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="App">
      {isLoggedIn ? (
        <TypingBox /> 
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;