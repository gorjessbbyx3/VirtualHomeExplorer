import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTourStore } from "@/store/tour-store";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Circle } from "lucide-react";

const processingSteps = [
  {
    key: "analysis",
    title: "Image Analysis & Room Detection",
    description: "Analyzing photos and identifying room types using computer vision"
  },
  {
    key: "depth",
    title: "Depth Estimation & 3D Reconstruction", 
    description: "Creating depth maps and building 3D scene geometry"
  },
  {
    key: "assembly",
    title: "Tour Assembly & Navigation Setup",
    description: "Creating room transitions and navigation controls"
  }
];



export default function ProcessingSection() {
  const { currentTour, setCurrentSection, setRooms } = useTourStore();

  const { data: tour, isLoading } = useQuery({
    queryKey: ['/api/tours', currentTour?.id],
    enabled: !!currentTour?.id,
    refetchInterval: 2000,
  });

  const { data: rooms } = useQuery({
    queryKey: ['/api/tours', currentTour?.id, 'rooms'],
    enabled: !!currentTour?.id && tour?.status === 'processing',
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (tour?.status === 'completed') {
      if (rooms) {
        setRooms(rooms);
      }
      setTimeout(() => {
        setCurrentSection('viewer');
      }, 1000);
    }
  }, [tour?.status, rooms, setCurrentSection, setRooms]);

  if (isLoading || !tour) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const getStepStatus = (stepKey: string) => {
    if (tour.status === 'completed') return 'completed';
    if (tour.processingStep === stepKey) return 'active';
    
    const stepOrder = ['analysis', 'depth', 'assembly'];
    const currentIndex = stepOrder.indexOf(tour.processingStep);
    const stepIndex = stepOrder.indexOf(stepKey);
    
    return stepIndex < currentIndex ? 'completed' : 'pending';
  };

  const getProgressPercentage = (stepKey: string) => {
    const stepOrder = ['analysis', 'depth', 'assembly'];
    const stepIndex = stepOrder.indexOf(stepKey);
    const currentIndex = stepOrder.indexOf(tour.processingStep);
    
    if (stepIndex < currentIndex) return 100;
    if (stepIndex === currentIndex) {
      // Simulate progress based on processed photos
      const progress = Math.min((tour.processedPhotos / tour.totalPhotos) * 100, 95);
      return progress;
    }
    return 0;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI is Processing Your Photos</h2>
          <p className="text-lg text-neutral">Our advanced AI is analyzing your images and creating your virtual tour</p>
        </div>

        <div className="space-y-8">
          {processingSteps.map((step, index) => {
            const status = getStepStatus(step.key);
            const progress = getProgressPercentage(step.key);
            
            return (
              <Card key={step.key} className="bg-gray-50">
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    status === 'completed' ? 'bg-accent text-white' :
                    status === 'active' ? 'bg-primary text-white animate-pulse-slow' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    <span>{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-neutral text-sm">{step.description}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full upload-progress"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {status === 'completed' && <CheckCircle className="text-accent h-6 w-6" />}
                    {status === 'active' && <Clock className="text-primary h-6 w-6 animate-spin" />}
                    {status === 'pending' && <Circle className="text-gray-400 h-6 w-6" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(rooms && rooms.length > 0) && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Detected Rooms</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <Card key={room.id} className="room-card">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{room.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{room.name}</span>
                      <span className="text-sm text-accent">{room.photoCount} photos</span>
                    </div>
                    <div className="text-xs text-neutral mt-1">
                      Confidence: {room.confidence}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-neutral">
            Estimated completion time: <span className="font-semibold text-primary">
              {tour.processingStep === 'analysis' ? '4 minutes' :
               tour.processingStep === 'depth' ? '2 minutes' :
               tour.processingStep === 'assembly' ? '1 minute' : 'Almost done'}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
