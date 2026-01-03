import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import LandingPage from "./components/landing/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import InquiryConfirmed from "./pages/InquiryConfirmed";
import SareePage from "./pages/SareePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/inquiry-confirmed" element={<InquiryConfirmed />} />
          <Route path="/sarees" element={<SareePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
