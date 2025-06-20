
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-20">
        <HeroSection />
        
        {/* Auth CTA Section */}
        {!loading && !user && (
          <section className="py-16 bg-purple-accent">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of users creating amazing workflows with VisualFlow
              </p>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-accent border-2 border-white hover:bg-gray-100 text-lg px-8 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </section>
        )}

        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
