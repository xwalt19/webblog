import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import BlogPage from "./pages/Blog";       // Import halaman Blog
import AboutPage from "./pages/About";     // Import halaman Tentang Kami
import Archives from "./pages/Archives";   // Import halaman Archives
import RegularEventsClasses from "./pages/info/RegularEventsClasses"; // Import sub-halaman
import Camps from "./pages/info/Camps";     // Import sub-halaman
import Training from "./pages/info/Training"; // Import sub-halaman
import ContactUs from "./pages/ContactUs"; // Import halaman Contact Us
import Partners from "./pages/Partners";   // Import halaman Partners
import Info from "./pages/Info";           // Import halaman Info baru
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="blog" element={<BlogPage />} />       {/* Rute untuk halaman Blog */}
            <Route path="about" element={<AboutPage />} />     {/* Rute untuk halaman Tentang Kami */}
            <Route path="archives" element={<Archives />} />   {/* Rute untuk halaman Archives */}
            <Route path="info/regular-events-classes" element={<RegularEventsClasses />} /> {/* Rute sub-halaman */}
            <Route path="info/camps" element={<Camps />} />     {/* Rute sub-halaman */}
            <Route path="info/training" element={<Training />} /> {/* Rute sub-halaman */}
            <Route path="contact-us" element={<ContactUs />} /> {/* Rute untuk halaman Contact Us */}
            <Route path="partners" element={<Partners />} />   {/* Rute untuk halaman Partners */}
            <Route path="info" element={<Info />} />           {/* Rute untuk halaman Info baru */}
            {/* TAMBAHKAN SEMUA RUTE KUSTOM DI ATAS RUTE CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;