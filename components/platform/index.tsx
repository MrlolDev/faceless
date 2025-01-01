"use client";

import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import PhotoInput from "./PackCreation/input";
import PacksList from "@/components/platform/PacksList";
import Image from "next/image";
import { Photos, Pack, PostureType, Background } from "@/types/packs";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { downloadImageAsPng } from "@/lib/img-utils";

export default function AppPage({
  defaultPack,
}: {
  defaultPack?: Pack | null;
}) {
  const { user, signOut, credits } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [generatedPhotoId, setGeneratedPhotoId] = useState<number | null>(null);
  const [selectedPosture, setSelectedPosture] = useState<PostureType | null>(
    "looking-forward"
  );
  const [background, setBackground] = useState<Background | null>({
    type: "solid",
    colors: ["yellow"],
  });
  const [pack, setPack] = useState<Pack | null>(defaultPack || null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tab, setTab] = useState<"generate" | "packs">("generate");

  if (!user) {
    return <div>Loading...</div>;
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
      setGeneratedPhotoId(data.data.photos[0].id);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!generatedPhotoId) return;

    try {
      const response = await fetch(`/api/photos/${generatedPhotoId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate photo");
      }

      toast({
        title: "Photo rated",
        description:
          rating > 0 ? "Thanks for the like!" : "Thanks for the feedback!",
      });
    } catch (error) {
      console.error("Error rating photo:", error);
      toast({
        title: "Error",
        description: "Failed to rate photo",
        variant: "destructive",
      });
    }
  };
  const handleOpenPack = (pack: Pack & { photos: Photos[] }) => {
    setImageUrl(pack.originPhoto);
    setPack(pack);
    setGeneratedImage(pack.photos.map((photo: Photos) => photo.imgUrl));
    setTab("generate");
  };

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <TooltipProvider>
        <main className="container mx-auto px-4 py-8">
          <Tabs
            defaultValue="generate"
            className="w-full "
            value={tab}
            onValueChange={(value) => setTab(value as "generate" | "packs")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="packs">My Packs</TabsTrigger>
            </TabsList>

            <TabsContent
              value="generate"
              className="flex flex-row items-start gap-8"
            >
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
              />

              <div className="flex flex-col items-center h-full w-full gap-4">
                <div className="text-lg font-base">Your generated avatar:</div>
                {generatedImage && !loading && (
                  <div className="flex flex-col items-center h-full w-fit gap-4">
                    <div className="relative max-w-md aspect-square w-[350px]">
                      <Image
                        src={generatedImage[0]}
                        alt="Generated avatar"
                        fill
                        className="object-cover rounded-base border-2 border-border"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="neutral"
                        size="icon"
                        onClick={() => handleRate(1)}
                        className="hover:text-yellow-500"
                        aria-label="Love avatar"
                        title="Love avatar"
                      >
                        <Star className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="neutral"
                        size="icon"
                        onClick={() => handleRate(1)}
                        className="hover:text-green-500"
                        aria-label="Like avatar"
                        title="Like avatar"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="neutral"
                        size="icon"
                        onClick={() => handleRate(-1)}
                        className="hover:text-red-500"
                        aria-label="Dislike avatar"
                        title="Dislike avatar"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="neutral"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const blob = await downloadImageAsPng(
                            generatedImage[0]
                          );
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
            </TabsContent>

            <TabsContent value="packs">
              <PacksList userId={user.id} onOpenPack={handleOpenPack} />
            </TabsContent>
          </Tabs>
        </main>
      </TooltipProvider>
    </div>
  );
}
