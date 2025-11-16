import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import RoomsPage from "./pages/RoomsPage";
import NotFound from "./pages/NotFound";
import MyBookings from "./pages/MyBookings"
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="rooms/single" element={<RoomsPage />} />
              <Route path="rooms/double" element={<RoomsPage />} />
              <Route path="my-bookings" element={<MyBookings />} />
            </Route>
            
            {/* Routes without Layout (if needed) */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            
            {/* Catch-all route for 404 - also wrapped in Layout */}
            <Route path="*" element={<Layout />}>
              <Route path="*" element={<NotFound />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
