import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { default as AccountPage } from "./pages/account";
import { default as LoginPage } from "./pages/login";
import { default as RegistrationPage } from "./pages/registration";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <>
        <Router>
          <Routes>
            <Route index path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/account" element={<AccountPage />} />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </>
    </Provider>
  );
}

export default App;
