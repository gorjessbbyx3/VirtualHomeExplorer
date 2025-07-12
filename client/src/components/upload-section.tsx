import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTourStore } from "@/store/tour-store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadSection() {
  const { 
    uploadedFiles, 
    addUploadedFiles, 
    removeUploadedFile, 
    setCurrentSection,
    setCurrentTour,
    setIsUploading,
    isUploading
  } = useTourStore();
  
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [processingType, setProcessingType] = useState("standard");

  const createTourMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/tours", {
        title: `Virtual Tour ${new Date().toLocaleDateString()}`,
        status: "uploading"
      });
      return response.json();
    }
  });

  const uploadPhotosMutation = useMutation({
    mutationFn: async ({ tourId, files }: { tourId: number, files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });
      
      const response = await fetch(`/api/tours/${tourId}/photos`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    }
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      addUploadedFiles(files);
    }
  }, [addUploadedFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addUploadedFiles(files);
    }
  }, [addUploadedFiles]);

  const handleUploadStart = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one photo to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create tour
      const tour = await createTourMutation.mutateAsync();
      setCurrentTour(tour);
      
      // Upload photos
      await uploadPhotosMutation.mutateAsync({
        tourId: tour.id,
        files: uploadedFiles
      });
      
      toast({
        title: "Upload successful",
        description: `${uploadedFiles.length} photos uploaded successfully.`
      });
      
      setCurrentSection('processing');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Property Photos</h2>
          <p className="text-lg text-neutral">Drag and drop 10-50 high-quality photos of your property</p>
        </div>

        <Card 
          className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
            dragActive ? 'drag-active' : 'border-gray-300 hover:border-primary'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CardContent className="space-y-4">
            <div className="text-6xl text-gray-400">
              <CloudUpload className="mx-auto" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your photos here</h3>
              <p className="text-neutral">or <span className="text-primary font-medium">browse to upload</span></p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Supports: JPEG, PNG • Maximum: 50 files • Recommended: 10-30 photos</p>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              id="file-input"
              onChange={handleFileInput}
            />
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Uploaded Photos ({uploadedFiles.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add More
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedFile(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {file.name.substring(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Card className="mt-12 bg-gray-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Options</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                processingType === 'standard' ? 'bg-white border-primary' : 'hover:bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="processing-type" 
                  value="standard" 
                  checked={processingType === 'standard'}
                  onChange={(e) => setProcessingType(e.target.value)}
                  className="text-primary"
                />
                <div>
                  <div className="font-medium text-gray-900">Standard Processing</div>
                  <div className="text-sm text-neutral">Basic 3D tour generation (5-10 minutes)</div>
                </div>
              </label>
              <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                processingType === 'enhanced' ? 'bg-white border-primary' : 'hover:bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="processing-type" 
                  value="enhanced" 
                  checked={processingType === 'enhanced'}
                  onChange={(e) => setProcessingType(e.target.value)}
                  className="text-primary"
                />
                <div>
                  <div className="font-medium text-gray-900">Enhanced Processing</div>
                  <div className="text-sm text-neutral">High-quality NeRF rendering (15-30 minutes)</div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={handleUploadStart}
            disabled={isUploading || uploadedFiles.length === 0}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-5 w-5" />
                Generate Virtual Tour
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
