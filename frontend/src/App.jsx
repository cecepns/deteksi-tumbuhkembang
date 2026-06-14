import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ScreeningProvider } from "@/context/ScreeningContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import PetunjukPage from "@/pages/PetunjukPage";
import ProfilAnakPage from "@/pages/ProfilAnakPage";
import RiwayatKesehatanPage from "@/pages/RiwayatKesehatanPage";
import DeteksiDiniPage from "@/pages/DeteksiDiniPage";
import EvaluasiPage from "@/pages/EvaluasiPage";
import StimulasiPage from "@/pages/StimulasiPage";
import KontakPage from "@/pages/KontakPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminProfilesPage from "@/pages/admin/AdminProfilesPage";
import AdminHealthHistoriesPage from "@/pages/admin/AdminHealthHistoriesPage";
import AdminScreeningPage from "@/pages/admin/AdminScreeningPage";

export default function App() {
  return (
    <AuthProvider>
      <ScreeningProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="petunjuk" element={<PetunjukPage />} />
              <Route path="profil-anak" element={<ProfilAnakPage />} />
              <Route path="riwayat-kesehatan" element={<RiwayatKesehatanPage />} />
              <Route path="deteksi-dini" element={<DeteksiDiniPage />} />
              <Route path="evaluasi" element={<EvaluasiPage />} />
              <Route path="stimulasi" element={<StimulasiPage />} />
              <Route path="kontak" element={<KontakPage />} />
            </Route>

            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="profil-anak" element={<AdminProfilesPage />} />
                <Route path="riwayat-kesehatan" element={<AdminHealthHistoriesPage />} />
                <Route path="hasil-skrining" element={<AdminScreeningPage />} />
              </Route>
            </Route>

            <Route path="admin/*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontSize: "14px" },
          }}
        />
      </ScreeningProvider>
    </AuthProvider>
  );
}
