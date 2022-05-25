import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from './pages/Chapter2';

function App() {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route exact path="/" element={<Chapter1/>} />
        <Route exact path="/chapter2" element={<Chapter2/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
