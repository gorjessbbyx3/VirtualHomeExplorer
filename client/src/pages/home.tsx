import { useTourStore } from "@/store/tour-store";
import HeroSection from "@/components/hero-section";
import UploadSection from "@/components/upload-section";
import ProcessingSection from "@/components/processing-section";
import TourViewer from "@/components/tour-viewer";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";

export default function Home() {
  const { currentSection } = useTourStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">VirtualTour AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-neutral hover:text-primary transition-colors">Pricing</a>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentSection === 'home' && (
        <>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
        </>
      )}
      
      {currentSection === 'upload' && <UploadSection />}
      {currentSection === 'processing' && <ProcessingSection />}
      {currentSection === 'viewer' && <TourViewer />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-xl font-bold">VirtualTour AI</span>
              </div>
              <p className="text-gray-300 mb-4">Transform your property photos into immersive virtual tours with the power of AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VirtualTour AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
