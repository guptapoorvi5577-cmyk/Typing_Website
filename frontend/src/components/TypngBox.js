import axios from 'axios';

function TypingBox() {
  
  // This is the function you need to add
  const saveScore = async (wpm) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/scores/save-score', 
        { wpm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Score saved successfully!');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Trigger this when the game ends
  const handleGameEnd = (finalWpm) => {
    saveScore(finalWpm);
  };

  return (
    <div>
      {/* Your game UI code here */}
    </div>
  );
}

export default TypingBox;