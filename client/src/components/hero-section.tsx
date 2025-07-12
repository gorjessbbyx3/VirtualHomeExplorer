import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { Play, Upload, Check } from "lucide-react";

export default function HeroSection() {
  const { setCurrentSection } = useTourStore();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Photos into
              <span className="text-primary"> Immersive Virtual Tours</span>
            </h1>
            <p className="text-xl text-neutral mb-8 leading-relaxed">
              Upload 10-50 property photos and our AI instantly creates stunning 3D virtual tours. 
              No special equipment needed—just your regular camera photos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-blue-700 text-lg px-8 py-4"
                onClick={() => setCurrentSection('upload')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Create Virtual Tour
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center mt-8 space-x-6">
              <div className="flex items-center text-sm text-neutral">
                <Check className="mr-2 h-4 w-4 text-accent" />
                No 3D camera required
              </div>
              <div className="flex items-center text-sm text-neutral">
                <Check className="mr-2 h-4 w-4 text-accent" />
                AI-powered processing
              </div>
              <div className="flex items-center text-sm text-neutral">
                <Check className="mr-2 h-4 w-4 text-accent" />
                Ready in minutes
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern living room virtual tour preview" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="glass-morphism px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Interactive 360° View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
