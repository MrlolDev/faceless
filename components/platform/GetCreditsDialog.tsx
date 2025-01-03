import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@next/third-parties/google";
import Link from "next/link";

export function GetCreditsDialog() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleClaimCode = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const response = await fetch("/api/codes/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim code");
      }

      toast({
        title: "Success!",
        description: `You've received ${data.credits} credits!`,
      });
      sendGAEvent("event", "claim_code", {
        credits: data.credits,
      });
      setCode("");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to claim code",
        variant: "destructive",
      });
      setError("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Need more credits?</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p>You can get more credits in two ways:</p>
              <ol className="list-decimal ml-4">
                <li>
                  <Link
                    href="/app/credits"
                    className="text-main hover:underline"
                  >
                    Purchase credits
                  </Link>{" "}
                  with various payment options
                </li>
                <li>Contact me for free credits through:</li>
              </ol>
            </div>
            <div className="flex gap-2 mt-0 mb-2">
              <a
                href="https://twitter.com/mrloldev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-main hover:underline"
              >
                Twitter
              </a>
              <span>•</span>
              <a
                href="mailto:leo@turing.sh"
                className="text-main hover:underline"
              >
                Email
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com/in/leonardo-ollero"
                target="_blank"
                rel="noopener noreferrer"
                className="text-main hover:underline"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <p>Or redeem a code:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={code}
                  className={cn(error && "border-red-500")}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button onClick={handleClaimCode} disabled={loading || !code}>
                  {loading ? "Claiming..." : "Claim"}
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
