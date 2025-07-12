import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";

const steps = [
  {
    number: 1,
    title: "Upload Photos",
    description: "Drag and drop 10-50 property photos taken with any camera or smartphone."
  },
  {
    number: 2,
    title: "AI Processing", 
    description: "Our AI analyzes images, detects rooms, estimates depth, and reconstructs 3D scenes."
  },
  {
    number: 3,
    title: "Tour Generation",
    description: "Automatic assembly of immersive virtual tour with smooth navigation controls."
  },
  {
    number: 4,
    title: "Share & Embed",
    description: "Get shareable links, embed codes, and downloadable assets for your listings."
  }
];

export default function HowItWorksSection() {
  const { setCurrentSection } = useTourStore();

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-neutral max-w-3xl mx-auto">From photos to virtual tour in just a few simple steps</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-neutral">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => setCurrentSection('upload')}
          >
            Try It Now
          </Button>
        </div>
      </div>
    </section>
  );
}
