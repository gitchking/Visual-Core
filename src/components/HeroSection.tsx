
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Workflow, 
  BarChart3, 
  Users, 
  Zap,
  ChevronDown
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        {/* Hero Content */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 mb-6 sm:mb-8">
            <Zap className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-purple-600">Premium Productivity Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight">
            Transform Your
            <span className="block text-gradient-purple">Workflow</span>
            Into Visual Magic
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Turn simple to-dos into stunning visual flowcharts. Visualize your data with beautiful charts. 
            Collaborate in rich community discussions. All in one premium platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button 
              size="lg" 
              className="bg-purple-accent hover:bg-purple-accent/90 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl brutalist-shadow hover-lift group neo-brutal-purple"
            >
              Start Creating For Free
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Feature Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-slide-up px-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 hover-lift">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Workflow className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Visual Workflows</h3>
              <p className="text-xs sm:text-sm text-gray-600">Convert to-dos into interactive node-based flowcharts</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 hover-lift" style={{animationDelay: '0.1s'}}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Data Visualization</h3>
              <p className="text-xs sm:text-sm text-gray-600">Beautiful charts and analytics for your productivity</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 hover-lift" style={{animationDelay: '0.2s'}}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Community Hub</h3>
              <p className="text-xs sm:text-sm text-gray-600">Rich discussions with advanced editing tools</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-200 hover-lift" style={{animationDelay: '0.3s'}}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Content Studio</h3>
              <p className="text-xs sm:text-sm text-gray-600">Create and publish announcements with ease</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
