import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { initThreeViewer } from "@/lib/three-viewer";
import { ChevronLeft, ChevronRight, Expand, Share, Settings, Link, Download, Code } from "lucide-react";

export default function TourViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    rooms, 
    currentRoomIndex, 
    nextRoom, 
    previousRoom, 
    goToRoom,
    currentTour 
  } = useTourStore();

  useEffect(() => {
    if (canvasRef.current && rooms.length > 0) {
      const cleanup = initThreeViewer(canvasRef.current, rooms);
      return cleanup;
    }
  }, [rooms]);

  useEffect(() => {
    if (canvasRef.current && (canvasRef.current as any).switchRoom) {
      (canvasRef.current as any).switchRoom(currentRoomIndex);
    }
  }, [currentRoomIndex]);

  const currentRoom = rooms[currentRoomIndex];

  const handleFullscreen = () => {
    if (canvasRef.current) {
      canvasRef.current.requestFullscreen();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Virtual Tour',
        text: 'Check out this amazing virtual tour!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Virtual Tour Generated Successfully!</h2>
          <p className="text-lg text-gray-300">Navigate through your property using the controls below</p>
        </div>

        <Card className="bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative tour-viewer" style={{ height: '600px' }}>
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
              style={{ cursor: 'grab' }}
            />
            
            {/* Tour Navigation Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="glass-morphism px-6 py-4 rounded-full flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-primary p-2"
                  onClick={previousRoom}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-white font-medium min-w-[120px] text-center">
                  {currentRoom?.name || 'Loading...'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-primary p-2"
                  onClick={nextRoom}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Room Selector */}
            <div className="absolute top-6 left-6">
              <div className="glass-morphism px-4 py-3 rounded-xl">
                <select 
                  className="bg-transparent text-white border-none outline-none cursor-pointer"
                  value={currentRoomIndex}
                  onChange={(e) => goToRoom(Number(e.target.value))}
                >
                  {rooms.map((room, index) => (
                    <option key={room.id} value={index} className="text-black">
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tour Controls */}
            <div className="absolute top-6 right-6">
              <div className="glass-morphism px-4 py-3 rounded-xl flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-primary p-2"
                  onClick={handleFullscreen}
                  title="Fullscreen"
                >
                  <Expand className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-primary p-2"
                  onClick={handleShare}
                  title="Share Tour"
                >
                  <Share className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-primary p-2"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Room Minimap */}
            <div className="absolute bottom-6 right-6">
              <div className="glass-morphism p-4 rounded-xl w-48">
                <h4 className="text-white text-sm font-medium mb-3">Floor Plan</h4>
                <div className="relative bg-gray-800 rounded-lg p-3 h-32">
                  {/* Dynamic floor plan representation based on actual rooms */}
                  {rooms.map((room, index) => {
                    const positions = [
                      { top: '8px', left: '8px', width: '32px', height: '24px' },
                      { top: '8px', right: '8px', width: '24px', height: '24px' },
                      { bottom: '8px', left: '8px', width: '24px', height: '32px' },
                      { bottom: '8px', right: '8px', width: '16px', height: '16px' }
                    ];
                    const pos = positions[index % positions.length];
                    
                    return (
                      <div 
                        key={room.id}
                        className={`absolute rounded-sm cursor-pointer transition-colors ${
                          currentRoomIndex === index ? 'bg-primary' : 'bg-gray-400'
                        } opacity-80 hover:opacity-100`}
                        style={{
                          ...pos
                        }}
                        title={room.name}
                        onClick={() => goToRoom(index)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tour Information Panel */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tour Information</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-neutral mb-1">Tour Created</div>
                  <div className="font-medium text-gray-900">
                    {currentTour?.createdAt ? new Date(currentTour.createdAt).toLocaleDateString() : 'Today'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral mb-1">Total Rooms</div>
                  <div className="font-medium text-gray-900">{rooms.length} Rooms Detected</div>
                </div>
                <div>
                  <div className="text-sm text-neutral mb-1">Processing Status</div>
                  <div className="font-medium text-gray-900">
                    {currentTour?.status === 'completed' ? 'Completed' : 'Processing'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral mb-1">Photos Processed</div>
                  <div className="font-medium text-accent">
                    {currentTour?.processedPhotos || 0} / {currentTour?.totalPhotos || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Tour</h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={handleShare}>
                  <Link className="mr-2 h-4 w-4" />
                  Copy Tour Link
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Assets
                </Button>
                <Button variant="outline" className="w-full">
                  <Code className="mr-2 h-4 w-4" />
                  Embed Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
