import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from './pages/Chapter2';
import Nav from './Nav';

function App() {
  return (
    <div className='App'>
    <Router>
      <div>
        <Nav/>
      <Routes>
        <Route exact path="/" element={<Chapter1/>} />
        <Route exact path="/chapter2" element={<Chapter2/>}/>
      </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
