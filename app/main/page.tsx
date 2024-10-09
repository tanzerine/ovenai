    'use client'

    import React, { useState, useEffect,useRef } from 'react'
    import { useUser } from "@clerk/nextjs"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Divide, Upload as UploadIcon } from 'lucide-react';
    import { supabase } from '../../lib/supabase'
    import { useSearchParams } from 'next/navigation';
    import Image from 'next/image';





    /this is not important/;
    /1--6/

    export default function Home() {
      const { isSignedIn, user } = useUser();
      const searchParams = useSearchParams();
      const [prompt, setPrompt] = useState('')
      const [size, setSize] = useState<string>("1024")
      const [format, setFormat] = useState<string>("PNG")  
      const [isGenerating, setIsGenerating] = useState(false)
      const [isRemovingBackground, setIsRemovingBackground] = useState(false)
      const [error, setError] = useState('')
      const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
      const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
      const [showOriginal, setShowOriginal] = useState(true)
      const [points, setPoints] = useState<number | null>(null)
      const [imageFile, setImageFile] = useState<File | null>(null);
      const [isDragging, setIsDragging] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);


    const fetchPoints = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single()
  
        if (error) {
          console.error("Error fetching user points:", error)
          setPoints(200) // Default to 200 if there's an error
        } else {
          setPoints(data?.points ?? 200)
        }
      }
    }
  
    useEffect(() => {
      const success = searchParams.get('success');
      if (success === 'true') {
        fetchPoints();
      }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
  
    useEffect(() => {
      fetchPoints()
    }, [user])
  
    const updateUserPoints = async (newPoints: number) => {
      if (user) {
        try {
          const { error } = await supabase
            .from('user_points')
            .upsert({ user_id: user.id, points: newPoints })
            .select()
    
          if (error) throw error;
    
          setPoints(newPoints)
        } catch (error) {
          console.error("Error updating user points:", error)
          setError("Failed to update points. Please try again.")
        }
      }
    }
  
    useEffect(() => {
      fetchPoints()
    }, [user])

      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          setImageFile(files[0]);
          console.log("File selected:", files[0].name);
        }
      };
    
      const handleDrag = (e: React.DragEvent<HTMLDivElement>, isDragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isDragging);
      };
    
      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          setImageFile(files[0]);
          console.log("File dropped:", files[0].name);
        }
      };
    
  const deleteImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log("Image deleted");
  };


      const generateIcon = async () => {
        if (!isSignedIn) {
          setError('Please sign in to generate icons');
          return;
        }
      
        if (points === null || points < 50) {
          setError('Not enough points. Please purchase more points.');
          return;
        }
      
        setIsGenerating(true);
        setIsLoading(true);
        setIsImageLoaded(false);
        setError('');
        setOriginalImageUrl(null);
        setRemovedBgImageUrl(null);
        setShowOriginal(true);
      
        try {
          const newPoints = points - 50;
          setPoints(newPoints); // Update points locally first
      
          console.log('Sending generate request with prompt:', `UNGDUNG ${prompt}`);
          console.log('Image file:', imageFile);
    
      
          const formData = new FormData();
          formData.append('prompt', `UNGDUNG ${prompt}`); // Add the prefix here
          formData.append('size', size);
          if (imageFile) {
            formData.append('image', imageFile);
          }
      
          const response = await fetch('/api/generate', {
            method: 'POST',
            body: formData,
          });
      
          const data = await response.json();
          console.log('Received response from generate API:', data);
      
          if (response.ok && data.success && data.predictionId) {
            await updateUserPoints(newPoints);
            console.log('Starting poll for result with predictionId:', data.predictionId);
            await pollForResult(data.predictionId);
          } else {
            throw new Error(data.error || 'Failed to generate icon or get prediction ID');
          }
        } catch (err) {
          console.error('Error in generateIcon:', err);
          setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
          setPoints(points); // Revert points if there's an error
          setIsLoading(false);
          setIsGenerating(false);
        }
      };

      const pollForResult = async (predictionId: string) => {
        const maxAttempts = 60 // 60 * 5 seconds = 5 minutes max wait time
        let attempts = 0
      
        const checkResult = async () => {
          if (attempts >= maxAttempts) {
            setError('Generation timed out. Please try again.')
            return
          }
      
          attempts++
      
          try {
            console.log(`Checking prediction (Attempt ${attempts}):`, predictionId)
      
            if (!predictionId) {
              throw new Error('Prediction ID is missing')
            }
      
            const response = await fetch(`/api/check-prediction?id=${predictionId}`)
            const data = await response.json()
      
            console.log('Received check-prediction response:', data)
      
            if (data.status === 'completed') {
              if (Array.isArray(data.imageUrl) && data.imageUrl.length > 0) {
                setOriginalImageUrl(data.imageUrl[0]);
                console.log('Image generation completed. URL:', data.imageUrl[0]);
              } else if (typeof data.imageUrl === 'string') {
                setOriginalImageUrl(data.imageUrl);
                console.log('Image generation completed. URL:', data.imageUrl);
              } else {
                setError('Invalid image URL format received from the API');
                setIsLoading(false);
                setIsGenerating(false);
              }
            } else if (data.status === 'failed') {
              setError('Failed to generate icon. Please try again.')
              setIsLoading(false);
              setIsGenerating(false);
            } else {
              console.log('Generation still in progress. Checking again in 5 seconds.')
              setTimeout(checkResult, 5000)
            }
          } catch (error) {
            console.error('Error checking prediction:', error)
            setError('Failed to check generation status. Please try again.')
          }
        }
      
        await checkResult()
      }

      
      const removeBackground = async () => {
        if (!originalImageUrl) {
          setError('No image to remove background from')
          return
        }

        if (points === null || points < 100) {
          setError('Not enough points. Please purchase more points.')
          return
        }

        setIsRemovingBackground(true)
        setError('')

        try {
          const newPoints = points - 100
          setPoints(newPoints) // Update points locally first

          const response = await fetch('/api/remove-background', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: originalImageUrl }),
          })

          const data = await response.json()

          if (response.ok && data.success) {
            setRemovedBgImageUrl(data.removed_bg_image_url)
            setShowOriginal(false)
            await updateUserPoints(newPoints) // Update points in Clerk
          } else {
            throw new Error(data.error || 'Failed to remove background')
          }
        } catch (err) {
          console.error('Error:', err)
          setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
          setPoints(points) // Revert points if there's an error
        } finally {
          setIsRemovingBackground(false)
        }
      }

      const downloadImage = async () => {
        if (!originalImageUrl && !removedBgImageUrl) {
          setError('No image available to download')
          return
        }
      
        try {
          const imageUrl = showOriginal ? originalImageUrl : removedBgImageUrl
          if (!imageUrl) {
            setError('Image URL is not available')
            return
          }
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = showOriginal ? 'original-icon.png' : 'background-removed-icon.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        } catch (err) {
          console.error('Error downloading image:', err)
          setError('Failed to download image')
        }
      }


      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start relative p-4 md:p-0">
        <header className="absolute inset-x-0 top-0 z-50">
          {/* Header content */}
        </header>
      
        <div className="w-full max-w-[1300px] py-10 md:py-20 flex flex-col items-center justify-center relative z-10">
          <div className="w-full bg-white rounded-[20px] flex flex-col md:flex-row border">
            {/* Input Section */}
            <div className="flex-1 px-5 md:px-10 py-7 md:py-14 flex flex-col justify-start items-center">
              <div className="w-full max-w-[590px]">
                <div className="font-clash-grotesk text-[#0c0c0c] text-xl md:text-[26.14px] font-medium leading-tight md:leading-[30.80px] mb-5">Input</div>
                <div className="w-full h-px bg-[#ebebeb] mb-5"></div>
                <div className="w-full px-3 pt-3 pb-[11.29px] bg-[#f7fcff] rounded-[10px] border border-[#5b8fde]/50 mb-5">
                  <p className="text-[#5b8fde] text-s md:text-s font-medium leading-tight">Every prompt should start with &apos;3d icon of&apos; Be sure to include it</p>
                </div>
                
                <div className="mb-7">
                <label htmlFor="prompt" className="text-black text-base font-medium leading-tight block mb-3">Prompt</label>
                <Input
                  id="prompt"
                  className="w-full h-10 bg-[#bbbbbb]/20 rounded-[10px] border-[#888888]/10 text-base text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="3d icon of..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-black/50 text-sm font-medium leading-tight mt-3">
                  Prompt must start with &apos;3d icon of&apos; in order to use the model properly. Shorter prompt could enhance the quality.
                </p>
              </div>

              <div className="mb-7 w-full">
        <label htmlFor="image" className="text-black text-base font-medium leading-tight block mb-3">Image File</label>
        <div
          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer relative ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {imageFile ? (
            <>
              <p className="text-sm text-gray-600">{imageFile.name}</p>
              <button
                className="absolute top-2 right-2 px-2 py-1 bg-gray-300 text-white rounded-md hover:bg-red-600 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteImage();
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop an image here, or click to select
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <p className="text-black/50 text-sm font-medium leading-tight mt-3">
          Upload an image file for image-to-image generation. Leave empty for text-to-image mode.
        </p>
      </div>

  {/* Size Dropdown */}
  <div className="mb-7">
        <label htmlFor="size" className="text-black text-s font-medium leading-tight block mb-3">Size</label>
        <div className="relative">
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full h-10 bg-[#bbbbbb]/20 rounded-[10px] border-[#888888]/10 appearance-none px-3 text-gray-500 text-s border focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors focus:border-blue-500 outline-none"
          >
            <option value="1024">1024</option>
            <option value="512">512</option>
            <option value="256">256</option>
          </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
    <p className="text-black/50 text-sm font-medium leading-tight mt-3">
      Size of the generated image in text-to-image mode. Only provides 256,512,1024
    </p>
  </div>


                {/* Format Dropdown */}
                <div className="mb-7">
        <label htmlFor="format" className="text-black text-s font-medium leading-tight block mb-3">Format</label>
        <div className="relative">
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full h-10 bg-[#bbbbbb]/20 rounded-[10px] border-[#888888]/10 appearance-none px-3 text-gray-500 text-s border shadow-sm transition-colors focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="WEBP">WEBP</option>
          </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-black/50 text-sm font-medium leading-tight mt-3">
                    Format of the output images.
                  </p>
                </div>

                <Button 
                  className="w-full md:w-[171px] h-10 bg-[#3384ff] text-s font-bold rounded-[10px] text-white"
                  onClick={generateIcon}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Run'}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full md:w-px h-px md:h-full bg-[#ebebeb] my-5 md:my-0"></div>

       {/* Output Section */}
       <div className="flex-1 p-5 md:p-[30px] md:py-14 flex flex-col justify-start items-start">
      <div className="w-full pr-0 md:pr-5">
        <h5 className="font-clash-grotesk text-[#0c0c0c] text-xl md:text-[26.47px] font-medium leading-tight md:leading-[30.80px] mb-5">Output</h5>
        <div className="w-full h-px bg-[#ebebeb] mb-5"></div>
        {error && <p className="text-red-500 text-s font-medium mb-5">{error}</p>}
        {!originalImageUrl && !isLoading && (
          <p className="text-black/50 text-s font-medium leading-tight mb-5">Press Run to see the results!</p>
        )}
        <div className="w-full h-[300px] md:h-[570px] flex justify-center items-center mb-5 bg-[#BBBBBB31] relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {((showOriginal && originalImageUrl) || (!showOriginal && removedBgImageUrl)) && (
            <Image 
              src={showOriginal ? originalImageUrl! : removedBgImageUrl!}
              alt="Generated Icon"
              fill
              style={{ objectFit: 'contain' }}
              className={`max-w-full max-h-full transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadingComplete={() => {
                setIsImageLoaded(true);
                setIsLoading(false);
                setIsGenerating(false);
              }}
              onError={() => {
                setError('Failed to load the image. Please try again.');
                console.error('Image load error. URL:', showOriginal ? originalImageUrl : removedBgImageUrl);
                setIsLoading(false);
                setIsGenerating(false);
              }}
            />
          )}
        </div>
        <div className="w-full pt-[3px] flex flex-col md:flex-row justify-center items-center gap-2.5">
          <Button 
            className="w-full md:w-[280px] bg-[#333333] text-white font-bold"
            onClick={downloadImage}
            disabled={!originalImageUrl && !removedBgImageUrl}
          >
            Download
          </Button>
          <Button 
            className="w-full md:w-[280px] bg-[#e3e3e3] text-[#4a4a4a] font-bold"
            onClick={removeBackground}
            disabled={!originalImageUrl || isRemovingBackground}
          >
            {isRemovingBackground ? 'Removing...' : 'Remove Background'}
          </Button>
        </div>
      </div>
    </div>
    </div>
    </div>
</div>
    );
  }
