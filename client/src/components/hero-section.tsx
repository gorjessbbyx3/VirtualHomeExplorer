import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { Play, Upload, Check, Camera } from "lucide-react";

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
                Upload Photos
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-8 py-4"
                onClick={() => setCurrentSection('broadcast')}
              >
                <Camera className="mr-2 h-5 w-5" />
                Live Capture
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4"
                onClick={() => setCurrentSection('viewer')}
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-purple-700 h-96 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Virtual Tour Preview</h3>
                <p className="text-blue-100">Upload photos to generate your interactive tour</p>
              </div>
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
