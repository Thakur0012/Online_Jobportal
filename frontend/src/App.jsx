import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import Companies from './pages/Companies';
import Services from './pages/Services';
import Newsletter from './pages/Newsletter';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Loading from './components/Loading';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import InterviewCoach from './pages/InterviewCoach';
import DailyDigest from './pages/DailyDigest';
import DigestDetails from './pages/DigestDetails';
import Community from './pages/Community';
import ResumeScorer from './pages/ResumeScorer';
import CareerRoadmapper from './pages/CareerRoadmapper';
import ForgotPassword from './pages/ForgotPassword';
import ScrollToTop from './components/ScrollToTop';



function App() {
  const { checkAuth, isLoading } = useAuthStore();
  const location = useLocation();

  // Hide Navbar and Footer completely on the admin panel
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer-register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/community" element={<Community />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/resume-scorer" element={<ResumeScorer />} />
          <Route path="/career-roadmap" element={<CareerRoadmapper />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/services" element={<Services />} />
          <Route path="/job-pdf" element={<Newsletter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/interview-coach" element={<InterviewCoach />} />
          <Route path="/daily-digest" element={<DailyDigest />} />
          <Route path="/daily-digest/:slug" element={<DigestDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>

  );
}

export default App;
