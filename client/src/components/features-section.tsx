import { Card, CardContent } from "@/components/ui/card";
import { Brain, Box, Route, Smartphone, Share, Clock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Room Recognition",
    description: "Advanced computer vision automatically identifies and categorizes rooms from your photos with 95%+ accuracy."
  },
  {
    icon: Box,
    title: "3D Reconstruction", 
    description: "Transform 2D photos into immersive 3D spaces using depth estimation and neural rendering technology."
  },
  {
    icon: Route,
    title: "Smart Navigation",
    description: "Automatically creates smooth room-to-room transitions and intuitive navigation controls."
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Tours work perfectly on any device with touch controls, pinch-to-zoom, and optimized performance."
  },
  {
    icon: Share,
    title: "Easy Sharing",
    description: "Share tours instantly with secure links, embed codes, or download assets for your website."
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Get your virtual tour ready in minutes, not hours. Our optimized AI pipeline ensures quick turnaround."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful AI-Driven Features</h2>
          <p className="text-xl text-neutral max-w-3xl mx-auto">Everything you need to create stunning virtual tours from ordinary photos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-neutral">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
