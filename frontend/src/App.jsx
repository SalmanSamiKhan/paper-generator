import { ThemeProvider } from "./components/theme-provider";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitQuestion from "./pages/Submit"; 
import Generate from "./pages/Generate"; 
import Questions from "./pages/Questions"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="medirecord-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<SubmitQuestion />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/questions" element={<Questions />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
