"use client";

import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import PhotoInput from "./PackCreation/input";
import PacksList from "@/components/platform/PacksList";
import Image from "next/image";
import { Photos, Pack } from "@/types/packs";

export default function AppPage() {
  const { user, signOut, credits } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleGenerate = async (imageUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageURL: imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.data.photos.map((photo: Photos) => photo.imgUrl));
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="packs">My Packs</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex flex-col gap-8">
            <PhotoInput
              onGenerate={handleGenerate}
              user={user}
              loading={loading}
            />

            {generatedImage && !loading && (
              <div className="flex flex-col items-center gap-4">
                <div className="text-lg font-base">Your generated avatar:</div>
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src={generatedImage[0]}
                    alt="Generated avatar"
                    fill
                    className="object-cover rounded-base border-2 border-border"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="packs">
            <PacksList userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
