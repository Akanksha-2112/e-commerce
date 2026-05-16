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
import NexusLanding from "./pages/NexusLanding";
import VanceLanding from "./pages/VanceLanding";
import WishlistPage from "./pages/WishlistPage";
import FixedLandingPage from "./pages/FixedLandingPage";
import LuxuryCheckout from "./pages/LuxuryCheckout";
import MaisonPage from "./pages/MaisonPage";
import MemberEntrance from "./pages/MemberEntrance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryLandingPage from "./pages/CategoryLandingPage";
import CategoryProducts from "./pages/CategoryProducts";
import CollectionPage from "./pages/CollectionPage";
import OAuthCallback from "./pages/OAuthCallback";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import { GlobalProvider } from "./context/GlobalContext";
import LuxurySidebar from "./components/common/LuxurySidebar";
import CartDrawer from "./components/common/CartDrawer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalProvider>
          <LuxurySidebar />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/inquiry-confirmed" element={<InquiryConfirmed />} />
            <Route path="/sarees" element={<SareePage />} />
            <Route path="/nexus" element={<NexusLanding />} />
            <Route path="/vance" element={<VanceLanding />} />

            {/* Main Category Landing Pages */}
            <Route path="/men" element={<CategoryLandingPage category="Men" initialSubcategories={['Shirts', 'Pants', 'Jackets', 'Suits']} />} />
            <Route path="/women" element={<CategoryLandingPage category="Women" initialSubcategories={['Sarees', 'Lehengas', 'Dresses', 'Tops', 'Kurtis']} />} />
            <Route path="/kids" element={<CategoryLandingPage category="Kids" initialSubcategories={['Boys Kurtas', 'Boys Sherwanis', 'Boys Suits', 'Girls Lehengas', 'Girls Shararas', 'Girls Gowns']} />} />

            {/* Nested Subcategory Routes */}
            <Route path="/men/:subcategory" element={<CategoryProducts category="Men" />} />
            <Route path="/women/:subcategory" element={<CategoryProducts category="Women" />} />
            <Route path="/kids/:subcategory" element={<CategoryProducts category="Kids" />} />

            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/fixed" element={<FixedLandingPage />} />
            <Route path="/checkout" element={<LuxuryCheckout />} />
            <Route path="/maison" element={<MaisonPage />} />
            <Route path="/entrance" element={<MemberEntrance />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/collection/:categoryId" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </GlobalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
