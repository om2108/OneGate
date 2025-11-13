// src/App.jsx (updated AnimatedRoutes + App)
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm"));
const VerifyEmail = lazy(() => import("./components/auth/VerifyEmail"));

const UserLayout = lazy(() => import("./components/layout/UserLayout"));
const MemberLayout = lazy(() => import("./components/layout/MemberLayout"));
const SecretaryLayout = lazy(() => import("./components/layout/SecretaryLayout"));
const WatchmanLayout = lazy(() => import("./components/layout/WatchmanLayout"));
const OwnerLayout = lazy(() => import("./components/layout/OwnerLayout"));

const SecretaryHome = lazy(() => import("./components/dashboard/secretary/SecretaryHome"));
const Notices = lazy(() => import("./components/dashboard/secretary/Notices"));
const Complaints = lazy(() => import("./components/dashboard/secretary/Complaint"));
const Residents = lazy(() => import("./components/dashboard/secretary/Resident"));
const Visitors = lazy(() => import("./components/dashboard/secretary/Visitors"));
const Facilities = lazy(() => import("./components/dashboard/secretary/Facilities"));
const Reports = lazy(() => import("./components/dashboard/secretary/Reports"));
const Attendance = lazy(() => import("./components/dashboard/secretary/Attendance"));

const OwnerHome = lazy(() => import("./components/dashboard/owner/OwnerHome"));
const Properties = lazy(() => import("./components/dashboard/owner/Properties"));
const TenantRequests = lazy(() => import("./components/dashboard/owner/TenantRequests"));
const Agreements = lazy(() => import("./components/dashboard/owner/Agreement"));
const UserRole = lazy(() => import("./components/dashboard/owner/UserRoleManager"));

const VisitorEntry = lazy(() => import("./components/dashboard/watchman/VisitorEntry"));
const ResidentVerification = lazy(() => import("./components/dashboard/watchman/ResidentVerification"));
const Logs = lazy(() => import("./components/dashboard/watchman/Logs"));

const MemberHome = lazy(() => import("./components/dashboard/member/MemberHome"));
const DuesList = lazy(() => import("./components/dashboard/member/DuesList"));
const FacilitiesBooking = lazy(() => import("./components/dashboard/member/FacilitiesBooking"));
const ResidentsList = lazy(() => import("./components/dashboard/member/RecentActivity"));
const ComplaintsList = lazy(() => import("./components/dashboard/member/CollapsibleSection"));

const TenantHome = lazy(() => import("./components/dashboard/tenant/TenantHome"));
const Unauthorized = lazy(() => import("./components/dashboard/Unauthorized"));

// small PageTransition wrapper used only for auth pages
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  // We still need location for AnimatePresence when animating auth pages
  const location = useLocation();

  // pages to animate
  const authPaths = ["/login", "/register", "/verify"];

  // If current path is an auth page, render auth routes inside AnimatePresence
  const isAuthPath = authPaths.includes(location.pathname);

  return (
    <>
      {/* AUTH ROUTES (animated) */}
      <AnimatePresence mode="wait" initial={false}>
        {isAuthPath && (
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={
              <PageTransition>
                <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                  <LoginForm />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/register" element={
              <PageTransition>
                <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                  <RegisterForm />
                </Suspense>
              </PageTransition>
            } />
            <Route path="/verify" element={
              <PageTransition>
                <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                  <VerifyEmail />
                </Suspense>
              </PageTransition>
            } />
            {/* fallback while on authPaths — redirect others to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </AnimatePresence>

      {/* ALL OTHER ROUTES (non-animated) */}
      {!isAuthPath && (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={
            <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
              <Unauthorized />
            </Suspense>
          } />

          {/* SECRETARY */}
          <Route path="/dashboard/secretary/*" element={
            <ProtectedRoute roles={["SECRETARY"]}>
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                <SecretaryLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<SecretaryHome />} />
            <Route path="notices" element={<Notices />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="residents" element={<Residents />} />
            <Route path="visitors" element={<Visitors />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="reports" element={<Reports />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>

          {/* OWNER */}
          <Route path="/dashboard/owner/*" element={
            <ProtectedRoute roles={["OWNER"]}>
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                <OwnerLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<OwnerHome />} />
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<TenantRequests />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="user-role" element={<UserRole />} />
          </Route>

          {/* MEMBER */}
          <Route path="/dashboard/member/*" element={
            <ProtectedRoute roles={["MEMBER"]}>
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                <MemberLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<MemberHome />} />
            <Route path="dashboard" element={<MemberHome />} />
            <Route path="dues" element={<DuesList />} />
            <Route path="facilities" element={<FacilitiesBooking />} />
            <Route path="bookings" element={<div className="p-4">My bookings (implement)</div>} />
            <Route path="residents" element={<ResidentsList />} />
            <Route path="complaints" element={<ComplaintsList />} />
          </Route>

          {/* WATCHMAN */}
          <Route path="/dashboard/watchman/*" element={
            <ProtectedRoute roles={["WATCHMAN"]}>
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                <WatchmanLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<VisitorEntry />} />
            <Route path="visitor-entry" element={<VisitorEntry />} />
            <Route path="resident-verification" element={<ResidentVerification />} />
            <Route path="logs" element={<Logs />} />
          </Route>

          {/* USER */}
          <Route path="/dashboard/user/*" element={
            <ProtectedRoute roles={["USER", "MEMBER", "OWNER", "SECRETARY", "WATCHMAN"]}>
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
                <UserLayout />
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<TenantHome />} />
            <Route path="dashboard" element={<TenantHome />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading app...</div>}>
          <AnimatedRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
