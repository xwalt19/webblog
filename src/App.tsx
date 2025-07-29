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
import ManagePrograms from "./pages/admin/ManagePrograms"; // New import
import UploadProgram from "./pages/admin/UploadProgram"; // New import
import ManageRunningClasses from "./pages/admin/ManageRunningClasses"; // New import
import UploadRunningClass from "./pages/admin/UploadRunningClass"; // New import
import ManageRegularEvents from "./pages/admin/ManageRegularEvents"; // New import
import UploadRegularEvent from "./pages/admin/UploadRegularEvent"; // New import
import ManageCamps from "./pages/admin/ManageCamps"; // New import
import UploadCamp from "./pages/admin/UploadCamp"; // New import
import ManageTrainingPrograms from "./pages/admin/ManageTrainingPrograms"; // New import
import UploadTrainingProgram from "./pages/admin/UploadTrainingProgram"; // New import
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { SessionProvider } from "./components/SessionProvider";
import React from "react";

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
              {/* Admin Routes */}
              <Route path="admin/blog-posts/new" element={<UploadBlogPost />} />
              <Route path="admin/blog-posts/:id/edit" element={<UploadBlogPost />} />
              <Route path="admin/manage-blog-posts" element={<ManageBlogPosts />} />
              <Route path="admin/programs/new" element={<UploadProgram />} /> {/* New */}
              <Route path="admin/programs/:id/edit" element={<UploadProgram />} /> {/* New */}
              <Route path="admin/manage-programs" element={<ManagePrograms />} /> {/* New */}
              <Route path="admin/running-classes/new" element={<UploadRunningClass />} /> {/* New */}
              <Route path="admin/running-classes/:id/edit" element={<UploadRunningClass />} /> {/* New */}
              <Route path="admin/manage-running-classes" element={<ManageRunningClasses />} /> {/* New */}
              <Route path="admin/regular-events/new" element={<UploadRegularEvent />} /> {/* New */}
              <Route path="admin/regular-events/:id/edit" element={<UploadRegularEvent />} /> {/* New */}
              <Route path="admin/manage-regular-events" element={<ManageRegularEvents />} /> {/* New */}
              <Route path="admin/camps/new" element={<UploadCamp />} /> {/* New */}
              <Route path="admin/camps/:id/edit" element={<UploadCamp />} /> {/* New */}
              <Route path="admin/manage-camps" element={<ManageCamps />} /> {/* New */}
              <Route path="admin/training-programs/new" element={<UploadTrainingProgram />} /> {/* New */}
              <Route path="admin/training-programs/:id/edit" element={<UploadTrainingProgram />} /> {/* New */}
              <Route path="admin/manage-training-programs" element={<ManageTrainingPrograms />} /> {/* New */}
              <Route path="content" element={<ContentList />} />
              <Route path="admin/manage-calendar" element={<ManageCalendar />} />
              <Route path="admin/manage-archives" element={<ManageArchives />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </React.Fragment>
  </QueryClientProvider>
);

export default App;