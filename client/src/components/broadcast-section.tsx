import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTourStore } from "@/store/tour-store";
import { Camera, StopCircle, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BroadcastSection() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addUploadedFiles, setCurrentSection } = useTourStore();
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Use back camera on mobile
        },
        audio: false
      });
      
      setMediaStream(stream);
      setIsStreaming(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      toast({
        title: "Camera Started",
        description: "Ready to capture photos for your virtual tour",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsStreaming(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      toast({
        title: "Camera Stopped",
        description: "Camera has been disconnected",
      });
    }
  }, [mediaStream, toast]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob and add to captured images
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImages(prev => [...prev, imageUrl]);
        
        // Convert blob to File and add to tour store
        const file = new File([blob], `captured-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        addUploadedFiles([file]);
        
        toast({
          title: "Photo Captured",
          description: "Image added to your virtual tour collection",
        });
      }
    }, 'image/jpeg', 0.9);
  }, [addUploadedFiles, toast]);

  const clearCaptured = useCallback(() => {
    // Revoke object URLs to free memory
    capturedImages.forEach(url => URL.revokeObjectURL(url));
    setCapturedImages([]);
    
    toast({
      title: "Images Cleared",
      description: "All captured images have been removed",
    });
  }, [capturedImages, toast]);

  const processImages = useCallback(() => {
    if (capturedImages.length === 0) {
      toast({
        title: "No Images",
        description: "Capture some photos first",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentSection('processing');
    toast({
      title: "Processing Started",
      description: `Processing ${capturedImages.length} captured images`,
    });
  }, [capturedImages.length, setCurrentSection, toast]);

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Photo Capture</h2>
          <p className="text-lg text-gray-600">Use your camera to capture photos directly for your virtual tour</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Feed */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video">
                {isStreaming ? (
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera not active</p>
                    </div>
                  </div>
                )}
                
                {/* Capture overlay */}
                {isStreaming && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      size="lg"
                      onClick={capturePhoto}
                      className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 p-0"
                    >
                      <Camera className="w-8 h-8" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Camera controls */}
              <div className="p-4 space-y-4">
                <div className="flex gap-4">
                  {!isStreaming ? (
                    <Button onClick={startCamera} className="flex-1">
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="destructive" className="flex-1">
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 text-center">
                  {capturedImages.length} photos captured
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Captured Images */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Captured Photos</h3>
                {capturedImages.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCaptured}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {capturedImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No photos captured yet</p>
                  <p className="text-sm">Start your camera and capture images</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {capturedImages.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`Captured ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={processImages} className="w-full" size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Process {capturedImages.length} Photos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}