"use client";

import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import PhotoInput from "./input";
import Image from "next/image";
import { Photos, Pack, PostureType, Background } from "@/types/packs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { downloadImageAsPng } from "@/lib/img-utils";
import Rating from "../Rating";
import Loading from "@/components/Loading";
import { sendGAEvent } from "@next/third-parties/google";

export default function AppPage({
  defaultPack,
}: {
  defaultPack?: (Pack & { photos: Photos[] }) | null;
}) {
  const { user, signOut, credits, setCredits } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string[] | null>(
    defaultPack?.photos.map((photo) => photo.imgUrl) || null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [generatedPhoto, setGeneratedPhoto] = useState<Photos | null>(
    defaultPack?.photos[0] || null
  );
  const [selectedPosture, setSelectedPosture] = useState<PostureType | null>(
    "looking-forward"
  );
  const [background, setBackground] = useState<Background | null>({
    type: "solid",
    colors: ["yellow"],
  });
  const [pack, setPack] = useState<Pack | null>(defaultPack || null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    defaultPack?.originPhoto || null
  );
  const [preview, setPreview] = useState<string | null>(
    defaultPack?.originPhoto || null
  );
  const [faceDetected, setFaceDetected] = useState<boolean | null>(
    defaultPack ? true : false
  );

  if (!user) {
    return <Loading element="user" />;
  }

  const handleGenerate = async (url?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageURL: url || imageUrl,
          posture: selectedPosture,
          background: background,
          packId: pack?.id || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setPack(data.data.pack);
      setGeneratedImage(data.data.photos.map((photo: Photos) => photo.imgUrl));
      setGeneratedPhoto(data.data.photos[0]);
      setCredits(data.data.actualCredits);
      sendGAEvent("event", "generate_avatar", {
        backgroundColor: background?.colors[0],
        backgroundType: background?.type,
        posture: selectedPosture,
        credits: data.data.actualCredits,
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start gap-24 w-full justify-center">
        <PhotoInput
          onGenerate={handleGenerate}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          user={user}
          loading={loading}
          onPostureChange={setSelectedPosture}
          selectedPosture={selectedPosture || "looking-forward"}
          background={background}
          setBackground={setBackground}
          setPreview={setPreview}
          preview={preview}
          setFaceDetected={setFaceDetected}
          faceDetected={faceDetected}
          setPack={setPack}
          credits={credits}
        />

        <div className="flex flex-col items-center justify-center h-full w-[350px] gap-4">
          <div className="text-lg font-base w-fit">Your generated avatar:</div>
          {generatedImage && imageUrl && preview && !loading && (
            <div className="flex flex-col items-center h-full w-fit gap-4">
              <div className="relative max-w-md aspect-square w-[350px]">
                <Image
                  src={generatedImage[0]}
                  alt="Generated avatar"
                  fill
                  className="object-cover rounded-base border-2 border-border"
                />
              </div>
              <Rating
                photo={generatedPhoto}
                updatePhoto={(photo) => {
                  setGeneratedPhoto(photo);
                }}
              />
              <Button
                variant="neutral"
                className="w-full"
                onClick={async () => {
                  try {
                    const blob = await downloadImageAsPng(generatedImage[0]);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "avatar.png";
                    a.click();
                    toast({
                      title: "Image downloaded",
                      description: "Your avatar has been downloaded",
                    });
                  } catch (error) {
                    console.error("Error downloading image:", error);
                    toast({
                      title: "Error",
                      description: "Failed to download image",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Download as PNG
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
