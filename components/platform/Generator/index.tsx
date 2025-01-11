"use client";

import { AppHeader } from "@/components/platform/AppHeader";
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
import { Reminders } from "../Reminders";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
const productHunt = true;

export default function AppPage({
  defaultPack,
}: {
  defaultPack?: (Pack & { photos: Photos[] }) | null;
}) {
  const t = useTranslations("generator");
  const { theme } = useTheme();
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
    "watching-horizon"
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
    return <Loading fullScreen={true} element="user" />;
  }

  const handleGet1 = async (url: string, startTime: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate/1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageURL: url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get description");
      }

      const data = await response.json();
      setPack(data.data.pack);

      // Now generate the image
      await handleGenerate2(data.data.pack.id, data.data.cost, startTime);
    } catch (error) {
      console.error("Error getting description:", error);
      toast({
        title: t("error"),
        description: t("failedToGetDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate2 = async (
    packId: number,
    cost: number,
    startTime: number
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate/2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packId,
          posture: selectedPosture,
          cost,
          background: background,
          startTime,
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
      toast({
        title: t("error"),
        description: t("failedToGenerateImage"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (startTime: number, url?: string) => {
    if (!pack) {
      await handleGet1(url || imageUrl!, startTime);
    } else {
      await handleGenerate2(pack.id, 0, startTime);
    }
  };
  const shareOnTwitter = () => {
    if (!generatedImage) return;
    sendGAEvent("event", "share_avatar", {
      avatarUrl: generatedImage[0],
    });
    const tweetText =
      "Check out my new AI-generated avatar! 🤖✨\n\n\nPlatform made by @mrloldev";
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(
      "https://faceless-avatar.com/pic/" +
        generatedImage[0].split("packs/")[1].split(".webp")[0]
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    try {
      sendGAEvent("event", "download_avatar", {
        avatarUrl: generatedImage[0],
      });
      const { url } = await downloadImageAsPng(generatedImage[0]);
      const a = document.createElement("a");
      a.href = url;
      a.download = "avatar.png";
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: t("imageDownloaded"),
        description: t("avatarDownloaded"),
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: t("error"),
        description: t("failedToDownloadImage"),
        variant: "destructive",
      });
    }
  };
  const copyImageUrl = () => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage[0]);
    toast({
      title: t("imageUrlCopied"),
      description: t("imageUrlCopiedDescription"),
    });
  };

  const copyImage = async () => {
    if (!generatedImage) return;
    try {
      sendGAEvent("event", "copy_avatar", {
        avatarUrl: generatedImage[0],
      });
      const { blob } = await downloadImageAsPng(generatedImage[0]);

      // Create ClipboardItem and write to clipboard
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);

      toast({
        title: t("imageCopied"),
        description: t("avatarCopied"),
      });
    } catch (error) {
      console.error("Error copying image:", error);
      toast({
        title: t("error"),
        description: t("failedToCopyImage"),
        variant: "destructive",
      });
    }
  };
  const removeBackground = async () => {
    if (!generatedImage) return;
    const response = await fetch(
      "/api/photos/" + generatedPhoto?.id + "/remove-bg",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      toast({
        title: t("error"),
        description: t("failedToRemoveBackground"),
        variant: "destructive",
      });
      return;
    }
    setGeneratedImage([data.bgRemovedImage]);
    setGeneratedPhoto(data.photoData);
    setCredits(credits - 1);
  };

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <Reminders />
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
          pack={pack}
        />

        <div className="flex flex-col items-center justify-center h-full w-[350px] gap-4">
          <div className="text-lg font-base w-fit">
            {t("yourGeneratedAvatar")}
          </div>
          {generatedImage && imageUrl && preview && !loading && (
            <div className="flex flex-col items-center h-full w-fit gap-4">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className="relative max-w-md aspect-square w-[350px]">
                    <Image
                      src={generatedImage[0]}
                      alt="Generated avatar"
                      fill
                      className="object-cover rounded-base border-2 border-border"
                    />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={copyImageUrl}
                    className="w-full cursor-pointer"
                  >
                    {t("copyImageUrl")}
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={copyImage}
                    className="w-full cursor-pointer"
                  >
                    {t("copyImage")}
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={downloadImage}
                    className="w-full cursor-pointer"
                  >
                    {t("downloadAsPng")}
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={shareOnTwitter}
                    className="w-full cursor-pointer"
                  >
                    {t("shareOnTwitter")}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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
                  await downloadImage();
                }}
              >
                {t("downloadAsPng")}
              </Button>
              <Button
                variant="neutral"
                className="w-full"
                onClick={() => {
                  shareOnTwitter();
                }}
              >
                {t("shareOnTwitter")}
                <svg
                  className="h-4 w-4 sm:h-6 sm:w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    className="fill-text dark:fill-darkText"
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
              </Button>
              <Button
                variant="neutral"
                className="w-full"
                onClick={removeBackground}
              >
                {t("removeBackground")}
              </Button>
              {productHunt && (
                <a
                  href="https://www.producthunt.com/posts/faceless-avatar?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-faceless&#0045;avatar"
                  target="_blank"
                >
                  <div suppressHydrationWarning>
                    <img
                      suppressHydrationWarning
                      src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=749370&theme=${theme}`}
                      alt="Faceless Avatar - Create stunning faceless avatar illustrations in seconds! | Product Hunt"
                      style={{ width: "250px", height: "54px" }}
                      width="250"
                      height="54"
                    />
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
