import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import UploadContent from "./pages/UploadContent";
import ContentList from "./pages/ContentList";
import MigrateBlogPosts from "./pages/MigrateBlogPosts";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Import halaman Login
import { SessionProvider } from "./components/SessionProvider"; // Import SessionProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider> {/* Wrap the entire app with SessionProvider */}
          <Routes>
            <Route path="/login" element={<Login />} /> {/* Add login route outside Layout */}
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
              <Route path="upload-content" element={<UploadContent />} />
              <Route path="content" element={<ContentList />} />
              <Route path="migrate-blog-posts" element={<MigrateBlogPosts />} />
              {/* TAMBAHKAN SEMUA RUTE KUSTOM DI ATAS RUTE CATCH-ALL "*" */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;