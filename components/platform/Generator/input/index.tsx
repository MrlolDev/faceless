"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import * as faceapi from "face-api.js";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { PostureType, Background, Pack } from "@/types/packs";
import PostureSelector from "./PostureSelector";
import BackgroundSelector from "./BackgroundSelector";
import { Dialog } from "@/components/ui/dialog";
import { GetCreditsDialog } from "@/components/platform/GetCreditsDialog";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface PhotoInputProps {
  onGenerate: (url?: string) => void;
  user: User;
  loading: boolean;
  onPostureChange?: (posture: PostureType) => void;
  selectedPosture?: PostureType;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  background: Background | null;
  setBackground: (background: Background) => void;
  setPreview: (url: string | null) => void;
  preview: string | null;
  setFaceDetected: (faceDetected: boolean | null) => void;
  faceDetected: boolean | null;
  credits: number;
  setPack: (pack: Pack | null) => void;
  setCaptchaToken: (token: string | null) => void;
  captchaToken: string | null;
  pack: Pack | null;
}

export default function PhotoInput({
  onGenerate,
  loading,
  onPostureChange,
  selectedPosture,
  imageUrl,
  setImageUrl,
  background,
  setBackground,
  setPreview,
  preview,
  setFaceDetected,
  faceDetected,
  setPack,
  pack,
  credits,
  captchaToken,
  setCaptchaToken,
}: PhotoInputProps) {
  const [isWebcam, setIsWebcam] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const ref = useRef<TurnstileInstance | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };
    loadModels();
  }, []);

  const detectFace = async (element: HTMLImageElement | HTMLVideoElement) => {
    if (!modelsLoaded) return;

    try {
      const detections = await faceapi.detectAllFaces(
        element,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaceDetected(detections.length > 0);
      if (detections.length > 0) {
        if (detections.length > 1) {
          toast({
            title: "Multiple faces detected",
            description: "Please ensure only one face is in the image",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Face detected",
            description: "The face has been detected in the image",
          });
        }
      } else {
        toast({
          title: "No face detected",
          description: "Please ensure a face is in the image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
      setFaceDetected(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(null);
      setPreview(url);
      setFaceDetected(null);
      setPack(null);
      // Create new image for face detection
      const img = new Image();
      img.src = url;
      img.onload = () => detectFace(img);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
      setImageUrl(null);
      setFaceDetected(null);
      setIsWebcam(true);
      setPack(null);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          new File([blob], "webcam-capture.jpg", {
            type: "image/jpeg",
          });
          const url = URL.createObjectURL(blob);
          setPreview(url);
          setImageUrl(url);
          setPack(null);
          stopWebcam();

          // Create new image for face detection
          const img = new Image();
          img.src = url;
          img.onload = () => detectFace(img);
        }
      }, "image/jpeg");
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcam(false);
    setImageUrl(null);
    setPack(null);
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setImageUrl(null);
    setFaceDetected(null);
    setPack(null);
  };

  const handleGenerate = async () => {
    if (credits < 1) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 1 credit to generate an avatar",
        action: (
          <Button variant="default" onClick={() => setShowCreditsDialog(true)}>
            Get Credits
          </Button>
        ),
      });
      return;
    }

    if (preview && faceDetected) {
      try {
        // First fetch the blob from the preview URL
        if (!imageUrl || !pack) {
          const res = await fetch(preview);
          const blob = await res.blob();

          // Create a FormData object to send the file
          const formData = new FormData();
          formData.append("file", blob, "photo.jpg");
          formData.append("captchaToken", captchaToken!);

          // Upload to Supabase storage
          setIsUploading(true);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadRes.json();
          setIsUploading(false);
          setImageUrl(url);
          onGenerate(url);
        } else {
          onGenerate();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-fit justify-center items-center">
      <div className="flex gap-2 w-full justify-between">
        <Button
          onClick={() => document.getElementById("photo-input")?.click()}
          variant="neutral"
          className="w-full"
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </Button>
        <Button onClick={startWebcam} variant="neutral" className="w-full">
          <Camera className="w-4 h-4" />
          Use Webcam
        </Button>
        <input
          type="file"
          id="photo-input"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div
        className={`relative aspect-square max-w-md mx-auto border-2 rounded-base overflow-hidden h-full w-80 ${
          preview && faceDetected === false
            ? "border-red-500"
            : preview && faceDetected
            ? "border-green-500"
            : "border-border"
        }`}
      >
        {isWebcam ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </>
        ) : preview ? (
          <>
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              variant="neutral"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearPreview}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text font-base">
            No photo selected
          </div>
        )}
      </div>
      {preview && faceDetected === false && (
        <div className="text-red-500 text-sm">
          No face detected in the image
        </div>
      )}
      {preview && faceDetected && (
        <div className="flex flex-col gap-4 w-full">
          <PostureSelector
            value={selectedPosture || "watching-horizon"}
            onChange={(posture) => onPostureChange?.(posture)}
            disabled={loading || isUploading}
          />
          <BackgroundSelector
            value={background || { type: "solid", colors: ["yellow"] }}
            onChange={setBackground}
            disabled={loading || isUploading}
          />
          <Button
            onClick={handleGenerate}
            className="w-full z-100"
            disabled={loading || isUploading}
          >
            {isUploading
              ? "Uploading..."
              : loading
              ? "Generating..."
              : "Generate Avatar"}
          </Button>
          <Turnstile
            ref={ref}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY! as string}
            onSuccess={(token: string) => setCaptchaToken(token)}
            onError={() => {
              toast({
                title: "Error with security check",
                description: "Please try again or refresh the page",
                variant: "destructive",
              });
            }}
            className="mb-4"
            onExpire={() => ref.current?.reset()}
          />
        </div>
      )}
      {isWebcam && (
        <Button onClick={capturePhoto} className="w-full">
          Take Photo
        </Button>
      )}
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <GetCreditsDialog />
      </Dialog>
    </div>
  );
}
