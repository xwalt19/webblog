import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { SessionProvider } from "./components/SessionProvider";
import React, { Suspense, useEffect } from 'react'; // Memperbaiki baris impor React dan Suspense

const Home = React.lazy(() => import("./pages/Home")); // Memindahkan deklarasi Home ke sini
const PostDetail = React.lazy(() => import("./pages/PostDetail"));
const BlogPage = React.lazy(() => import("./pages/Blog"));
const AboutPage = React.lazy(() => import("./pages/About"));
const Archives = React.lazy(() => import("./pages/Archives"));
const RegularEventsClasses = React.lazy(() => import("./pages/info/RegularEventsClasses"));
const RegularEventDetail = React.lazy(() => import("./pages/info/RegularEventDetail")); // New import
const Camps = React.lazy(() => import("./pages/info/Camps"));
const Training = React.lazy(() => import("./pages/info/Training"));
const ProgramsPage = React.lazy(() => import("./pages/info/Programs"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
const Partners = React.lazy(() => import("./pages/Partners"));
const YouTubePage = React.lazy(() => import("./pages/media/YouTubePage"));
const TikTokPage = React.lazy(() => import("./pages/media/TikTokPage"));
const CalendarPage = React.lazy(() => import("./pages/info/CalendarPage"));
const UploadBlogPost = React.lazy(() => import("./pages/UploadBlogPost"));
const ManageCalendar = React.lazy(() => import("./pages/admin/ManageCalendar"));
const ManageArchives = React.lazy(() => import("./pages/admin/ManageArchives"));
const ManageBlogPosts = React.lazy(() => import("./pages/admin/ManageBlogPosts"));
const ManagePrograms = React.lazy(() => import("./pages/admin/ManagePrograms"));
const UploadProgram = React.lazy(() => import("./pages/admin/UploadProgram"));
const ManageRegularEvents = React.lazy(() => import("./pages/admin/ManageRegularEvents"));
const UploadRegularEvent = React.lazy(() => import("./pages/admin/UploadRegularEvent"));
const ManageCamps = React.lazy(() => import("./pages/admin/ManageCamps"));
const UploadCamp = React.lazy(() => import("./pages/admin/UploadCamp"));
const ManageTrainingPrograms = React.lazy(() => import("./pages/admin/ManageTrainingPrograms"));
const UploadTrainingProgram = React.lazy(() => import("./pages/admin/UploadTrainingProgram"));
const ManageYouTubeVideos = React.lazy(() => import("./pages/admin/ManageYouTubeVideos"));
const UploadYouTubeVideo = React.lazy(() => import("./pages/admin/UploadYouTubeVideo"));
const ManageTikTokVideos = React.lazy(() => import("./pages/admin/ManageTikTokVideos"));
const UploadTikTokVideo = React.lazy(() => import("./pages/admin/UploadTikTokVideo"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const ManageUsers = React.lazy(() => import("./pages/admin/ManageUsers"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
// Removed ManageBlogCategories and ManageHeroImages imports
// const ManageBlogCategories = React.lazy(() => import("./pages/admin/ManageBlogCategories"));
// const ManageHeroImages = React.lazy(() => import("./pages/admin/ManageHeroImages")); 

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log("App component mounted or re-rendered");
    return () => {
      console.log("App component unmounted");
    };
  }); // No dependencies, runs on every render

  return (
    <QueryClientProvider client={queryClient}>
      <React.Fragment>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SessionProvider>
            <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense fallback */}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="posts/:id" element={<PostDetail />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="archives" element={<Archives />} />
                  <Route path="info/regular-events-classes" element={<RegularEventsClasses />} />
                  <Route path="info/regular-events-classes/:id" element={<RegularEventDetail />} /> {/* New route */}
                  <Route path="info/camps" element={<Camps />} />
                  <Route path="info/training" element={<Training />} />
                  <Route path="info/programs" element={<ProgramsPage />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="media/youtube" element={<YouTubePage />} />
                  <Route path="media/tiktok" element={<TikTokPage />} />
                  <Route path="info/calendar" element={<CalendarPage />} />
                  <Route path="profile" element={<UserProfile />} />
                  {/* Admin Routes */}
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/blog-posts/new" element={<UploadBlogPost />} />
                  <Route path="admin/blog-posts/:id/edit" element={<UploadBlogPost />} />
                  <Route path="admin/manage-blog-posts" element={<ManageBlogPosts />} />
                  <Route path="admin/programs/new" element={<UploadProgram />} />
                  <Route path="admin/programs/:id/edit" element={<UploadProgram />} />
                  <Route path="admin/manage-programs" element={<ManagePrograms />} />
                  <Route path="admin/manage-regular-events" element={<ManageRegularEvents />} />
                  <Route path="admin/regular-events/new" element={<UploadRegularEvent />} />
                  <Route path="admin/regular-events/:id/edit" element={<UploadRegularEvent />} />
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
                  <Route path="admin/manage-calendar" element={<ManageCalendar />} />
                  <Route path="admin/manage-archives" element={<ManageArchives />} />
                  <Route path="admin/manage-users" element={<ManageUsers />} />
                  {/* Removed routes for ManageBlogCategories and ManageHeroImages */}
                  {/* <Route path="admin/manage-blog-categories" element={<ManageBlogCategories />} /> */}
                  {/* <Route path="admin/manage-hero-images" element={<ManageHeroImages />} /> */}
                  {/* Removed new and edit routes for UploadHeroImage */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </SessionProvider>
        </BrowserRouter>
      </React.Fragment>
    </QueryClientProvider>
  );
};

export default App;