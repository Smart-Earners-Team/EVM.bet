import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Trophy from "./pages/Trophy";
import Dashboard from "./pages/Dashboard";
import Upline from "./pages/[upline]";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<Landing />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rewards/:upline" element={<Upline />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
