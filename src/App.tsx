import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import ListingPage from "./pages/public/ListingPage";
import DetailPage from "./pages/public/DetailPage";
import AboutPage from "./pages/public/AboutPage";
import MediaPage from "./pages/public/MediaPage";
import EventsPage from "./pages/public/EventsPage";
import EventDetailPage from "./pages/public/EventDetailPage";
import MapPage from "./pages/public/MapPage";
import SearchPage from "./pages/public/SearchPage";

import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ContentListPage from "./pages/admin/ContentListPage";
import ContentFormPage from "./pages/admin/ContentFormPage";
import EventsAdminListPage from "./pages/admin/EventsAdminListPage";
import EventFormPage from "./pages/admin/EventFormPage";
import MediaManagerPage from "./pages/admin/MediaManagerPage";
import AboutEditorPage from "./pages/admin/AboutEditorPage";
import HomepageCmsPage from "./pages/admin/HomepageCmsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UsersPage from "./pages/admin/UsersPage";

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-pine-600">404</p>
      <p className="mt-2 font-body text-ink-soft">Bunday sahifa topilmadi.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public tourism website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/xonabod-haqida" element={<AboutPage />} />
        <Route path="/tadbirlar" element={<EventsPage />} />
        <Route path="/tadbirlar/:slug" element={<EventDetailPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/xarita" element={<MapPage />} />
        <Route path="/qidiruv" element={<SearchPage />} />
        <Route path="/:contentSlug" element={<ListingPage />} />
        <Route path="/:contentSlug/:itemSlug" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin panel */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tadbirlar" element={<EventsAdminListPage />} />
        <Route path="tadbirlar/:id" element={<EventFormPage />} />
        <Route path="media" element={<MediaManagerPage />} />
        <Route path="xonabod-haqida" element={<AboutEditorPage />} />
        <Route path="bosh-sahifa" element={<HomepageCmsPage />} />
        <Route path="sozlamalar" element={<SettingsPage />} />
        <Route path="foydalanuvchilar" element={<UsersPage />} />
        <Route path=":contentSlug" element={<ContentListPage />} />
        <Route path=":contentSlug/:id" element={<ContentFormPage />} />
      </Route>
    </Routes>
  );
}
