import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import BlogPage from "./pages/Blog";
import AboutPage from "./pages/About";
import Archives from "./pages/Archives";
import RegularEventsClasses from "./pages/info/RegularEventsClasses";
import Camps from "./pages/info/Camps";
import Training from "./pages/info/Training";
import ProgramsPage from "./pages/info/Programs";
import ContactUs from "./pages/ContactUs";
import Partners from "./pages/Partners";
import YouTubePage from "./pages/media/YouTubePage";
import TikTokPage from "./pages/media/TikTokPage";
import CalendarPage from "./pages/info/CalendarPage";
import UploadBlogPost from "./pages/UploadBlogPost";
import ContentList from "./pages/ContentList";
import ManageCalendar from "./pages/admin/ManageCalendar";
import ManageArchives from "./pages/admin/ManageArchives";
import ManageBlogPosts from "./pages/admin/ManageBlogPosts";
import ManagePrograms from "./pages/admin/ManagePrograms";
import UploadProgram from "./pages/admin/UploadProgram";
import ManageRunningClasses from "./pages/admin/ManageRunningClasses";
import UploadRunningClass from "./pages/admin/UploadRunningClass";
import ManageRegularEvents from "./pages/admin/ManageRegularEvents";
import UploadRegularEvent from "./pages/admin/UploadRegularEvent";
import ManageCamps from "./pages/admin/ManageCamps";
import UploadCamp from "./pages/admin/UploadCamp";
import ManageTrainingPrograms from "./pages/admin/ManageTrainingPrograms";
import UploadTrainingProgram from "./pages/admin/UploadTrainingProgram";
import ManageYouTubeVideos from "./pages/admin/ManageYouTubeVideos";
import UploadYouTubeVideo from "./pages/admin/UploadYouTubeVideo";
import ManageTikTokVideos from "./pages/admin/ManageTikTokVideos";
import UploadTikTokVideo from "./pages/admin/UploadTikTokVideo";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { SessionProvider } from "./components/SessionProvider";
import React from "react";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserProfile from "./pages/UserProfile";
import MemberDashboard from "./pages/MemberDashboard"; // Import MemberDashboard

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <React.Fragment>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="posts/:id" element={<PostDetail />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="archives" element={<Archives />} />
              <Route path="info/regular-events-classes" element={<RegularEventsClasses />} />
              <Route path="info/camps" element={<Camps />} />
              <Route path="info/training" element={<Training />} />
              <Route path="info/programs" element={<ProgramsPage />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="partners" element={<Partners />} />
              <Route path="media/youtube" element={<YouTubePage />} />
              <Route path="media/tiktok" element={<TikTokPage />} />
              <Route path="info/calendar" element={<CalendarPage />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="dashboard" element={<MemberDashboard />} /> {/* New Member Dashboard Route */}
              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/blog-posts/new" element={<UploadBlogPost />} />
              <Route path="admin/blog-posts/:id/edit" element={<UploadBlogPost />} />
              <Route path="admin/manage-blog-posts" element={<ManageBlogPosts />} />
              <Route path="admin/programs/new" element={<UploadProgram />} />
              <Route path="admin/programs/:id/edit" element={<UploadProgram />} />
              <Route path="admin/manage-programs" element={<ManagePrograms />} />
              <Route path="admin/running-classes/new" element={<UploadRunningClass />} />
              <Route path="admin/running-classes/:id/edit" element={<UploadRunningClass />} />
              <Route path="admin/manage-running-classes" element={<ManageRunningClasses />} />
              <Route path="admin/regular-events/new" element={<UploadRegularEvent />} />
              <Route path="admin/regular-events/:id/edit" element={<UploadRegularEvent />} />
              <Route path="admin/manage-regular-events" element={<ManageRegularEvents />} />
              <Route path="admin/camps/new" element={<UploadCamp />} />
              <Route path="admin/camps/:id/edit" element={<UploadCamp />} />
              <Route path="admin/manage-camps" element={<ManageCamps />} />
              <Route path="admin/training-programs/new" element={<UploadTrainingProgram />} />
              <Route path="admin/training-programs/:id/edit" element={<UploadTrainingProgram />} />
              <Route path="admin/manage-training-programs" element={<ManageTrainingPrograms />} />
              <Route path="admin/youtube-videos/new" element={<UploadYouTubeVideo />} />
              <Route path="admin/youtube-videos/:id/edit" element={<UploadYouTubeVideo />} />
              <Route path="admin/manage-youtube-videos" element={<ManageYouTubeVideos />} />
              <Route path="admin/tiktok-videos/new" element={<UploadTikTokVideo />} />
              <Route path="admin/tiktok-videos/:id/edit" element={<UploadTikTokVideo />} />
              <Route path="admin/manage-tiktok-videos" element={<ManageTikTokVideos />} />
              <Route path="content" element={<ContentList />} />
              <Route path="admin/manage-calendar" element={<ManageCalendar />} />
              <Route path="admin/manage-archives" element={<ManageArchives />} />
              <Route path="admin/manage-users" element={<ManageUsers />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </React.Fragment>
  </QueryClientProvider>
);

export default App;