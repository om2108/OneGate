// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

// AUTH PAGES
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm"));
const VerifyEmail = lazy(() => import("./components/auth/VerifyEmail"));
const Onboarding = lazy(() => import("./components/auth/OnboardingPage"));

// DASHBOARD LAYOUTS
const UserLayout = lazy(() => import("./components/layout/UserLayout"));
const MemberLayout = lazy(() => import("./components/layout/MemberLayout"));
const SecretaryLayout = lazy(() => import("./components/layout/SecretaryLayout"));
const WatchmanLayout = lazy(() => import("./components/layout/WatchmanLayout"));
const OwnerLayout = lazy(() => import("./components/layout/OwnerLayout"));

// SECRETARY PAGES
const SecretaryHome = lazy(() => import("./components/dashboard/secretary/SecretaryHome"));
const Notices = lazy(() => import("./components/dashboard/secretary/Notices"));
const Complaints = lazy(() => import("./components/dashboard/secretary/Complaint"));
const Residents = lazy(() => import("./components/dashboard/secretary/Resident"));
const Visitors = lazy(() => import("./components/dashboard/secretary/Visitors"));
const Facilities = lazy(() => import("./components/dashboard/secretary/Facilities"));
const Reports = lazy(() => import("./components/dashboard/secretary/Reports"));
const Attendance = lazy(() => import("./components/dashboard/secretary/Attendance"));

// OWNER PAGES
const OwnerHome = lazy(() => import("./components/dashboard/owner/OwnerHome"));
const Properties = lazy(() => import("./components/dashboard/owner/Properties"));
const TenantRequests = lazy(() => import("./components/dashboard/owner/TenantRequests"));
const Agreements = lazy(() => import("./components/dashboard/owner/Agreement"));
const UsersList = lazy(() => import("./components/dashboard/owner/UsersList"));

// WATCHMAN
const VisitorEntry = lazy(() => import("./components/dashboard/watchman/VisitorEntry"));
const ResidentVerification = lazy(() => import("./components/dashboard/watchman/ResidentVerification"));
const Logs = lazy(() => import("./components/dashboard/watchman/Logs"));

// MEMBER
const MemberHome = lazy(() => import("./components/dashboard/member/MemberHome"));
const MemberProperties = lazy(() => import("./components/dashboard/member/MemberProperties"));
const DuesList = lazy(() => import("./components/dashboard/member/DuesList"));
const FacilitiesBooking = lazy(() => import("./components/dashboard/member/FacilitiesBooking"));
const ResidentsList = lazy(() => import("./components/dashboard/member/RecentActivity"));
const ComplaintsList = lazy(() => import("./components/dashboard/member/CollapsibleSection"));

// TENANT USER
const TenantHome = lazy(() => import("./components/dashboard/tenant/TenantHome"));
const Unauthorized = lazy(() => import("./components/dashboard/Unauthorized"));

// HELP & CONTACT
const Help = lazy(() => import("./components/layout/Help"));
const Contact = lazy(() => import("./components/layout/Contact"));

// Page transitions
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
  const location = useLocation();
  const authPaths = ["/login", "/register", "/verify", "/onboarding"];

  const isAuthPath = authPaths.includes(location.pathname);

  return (
    <>
      {/* AUTH ROUTES */}
      <AnimatePresence mode="wait" initial={false}>
        {isAuthPath && (
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><LoginForm /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterForm /></PageTransition>} />
            <Route path="/verify" element={<PageTransition><VerifyEmail /></PageTransition>} />
            <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </AnimatePresence>

      {/* PROTECTED ROUTES */}
      {!isAuthPath && (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* HELP & CONTACT */}
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

          {/* SECRETARY */}
          <Route
            path="/dashboard/secretary/*"
            element={<ProtectedRoute roles={["SECRETARY"]}><SecretaryLayout /></ProtectedRoute>}
          >
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
          <Route
            path="/dashboard/owner/*"
            element={<ProtectedRoute roles={["OWNER"]}><OwnerLayout /></ProtectedRoute>}
          >
            <Route index element={<OwnerHome />} />
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<TenantRequests />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="user-list" element={<UsersList />} />
          </Route>

          {/* MEMBER */}
          <Route
            path="/dashboard/member/*"
            element={<ProtectedRoute roles={["MEMBER"]}><MemberLayout /></ProtectedRoute>}
          >
            <Route index element={<MemberHome />} />
            <Route path="dues" element={<DuesList />} />
            <Route path="facilities" element={<FacilitiesBooking />} />
            <Route path="residents" element={<ResidentsList />} />
            <Route path="complaints" element={<ComplaintsList />} />
            {/* NEW: explore properties for MEMBER */}
            <Route path="properties" element={<MemberProperties />} />
          </Route>

          {/* WATCHMAN */}
          <Route
            path="/dashboard/watchman/*"
            element={<ProtectedRoute roles={["WATCHMAN"]}><WatchmanLayout /></ProtectedRoute>}
          >
            <Route index element={<VisitorEntry />} />
            <Route path="resident-verification" element={<ResidentVerification />} />
            <Route path="logs" element={<Logs />} />
          </Route>

          {/* TENANT / USER */}
          <Route
            path="/dashboard/user/*"
            element={<ProtectedRoute><UserLayout /></ProtectedRoute>}
          >
            <Route index element={<TenantHome />} />
          </Route>

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
        <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
          <AnimatedRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
