import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AccountPage } from "./pages/account";
import { LoginPage } from "./pages/login";
import { RegistrationPage } from "./pages/registration";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("something");
  }, []);
  return (
    <Router>
      <Routes>
        <Route index path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
