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
import { useTranslations } from "next-intl";
import Loading from "@/components/Loading";

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
  pack: Pack | null;
}

const cropToSquare = (
  source: HTMLImageElement | HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const size = Math.min(source.width, source.height);
  const x = (source.width - size) / 2;
  const y = (source.height - size) / 2;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(
    source,
    x,
    y,
    size,
    size, // Source coordinates
    0,
    0,
    size,
    size // Destination coordinates
  );
  return canvas;
};

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
}: PhotoInputProps) {
  const [isWebcam, setIsWebcam] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const t = useTranslations("generator");
  const [isWebcamLoading, setIsWebcamLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        cropToSquare(img, canvas);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setImageUrl(null);
            setPreview(url);
            setFaceDetected(true); // Always set to true
            setPack(null);
          }
        }, "image/jpeg");
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const startWebcam = async () => {
    try {
      // If already active, stop webcam
      if (isWebcam && streamRef.current) {
        stopWebcam();
        return;
      }

      // Set loading and webcam states
      setIsWebcamLoading(true);
      setIsWebcam(true);
      setImageUrl(null);
      setFaceDetected(null);
      setPack(null);
      setPreview(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1080 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setIsWebcam(false);
      toast({
        title: t("webcamError"),
        description: t("pleaseAllowCameraAccess"),
        variant: "destructive",
      });
    } finally {
      setIsWebcamLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) {
      console.log("Video not ready:", videoRef.current);
      toast({
        title: t("error"),
        description: t("pleaseWaitForCameraToLoad"),
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw the current frame from video to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreview(url);
            setImageUrl(null);
            setPack(null);
            stopWebcam();
            setFaceDetected(true); // Always set to true
          } else {
            throw new Error("Failed to create blob from canvas");
          }
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast({
        title: t("error"),
        description: t("failedToCapturePhoto"),
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcam(false);
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
        title: t("insufficientCredits"),
        description: t("youNeedAtLeastOneCreditToGenerateAnAvatar"),
        action: (
          <Button variant="default" onClick={() => setShowCreditsDialog(true)}>
            {t("getCredits")}
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
          title: t("failedToUploadImage"),
          description: t("pleaseTryAgain"),
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
          {t("uploadPhoto")}
        </Button>
        <Button onClick={startWebcam} variant="neutral" className="w-full">
          <Camera className="w-4 h-4" />
          {t("useWebcam")}
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
            {isWebcamLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loading element="webcam" size="large" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Button variant="neutral" size="icon" onClick={stopWebcam}>
                <X className="w-4 h-4" />
              </Button>
            </div>
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
            {t("noPhotoSelected")}
          </div>
        )}
      </div>
      {preview && faceDetected === false && (
        <div className="text-red-500 text-sm">
          {t("noFaceDetectedInTheImage")}
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
              ? t("uploading")
              : loading
              ? t("generating")
              : t("generateAvatar")}
          </Button>
        </div>
      )}
      {isWebcam && (
        <Button onClick={capturePhoto} className="w-full">
          {t("takePhoto")}
        </Button>
      )}
      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <GetCreditsDialog />
      </Dialog>
    </div>
  );
}
