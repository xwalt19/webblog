import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

// Komponen placeholder untuk rute baru
const RelatedCoursesPage = () => <div className="container mx-auto py-10 text-center"><h1 className="text-4xl font-bold">Kursus Terkait</h1><p className="text-lg text-muted-foreground mt-4">Di sini akan ada informasi tentang kursus yang relevan dengan blog.</p></div>;
const AboutPage = () => <div className="container mx-auto py-10 text-center"><h1 className="text-4xl font-bold">Tentang Kami</h1><p className="text-lg text-muted-foreground mt-4">Informasi tentang Blog Kurusiu.</p></div>;


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
            <Route path="related-courses" element={<RelatedCoursesPage />} />
            <Route path="about" element={<AboutPage />} />
            {/* TAMBAHKAN SEMUA RUTE KUSTOM DI ATAS RUTE CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;