import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import HomePage from "@/pages/HomePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfUsePage from "@/pages/TermsOfUsePage";

const App = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
      </Route>
    </Routes>
  );
};

export default App;
