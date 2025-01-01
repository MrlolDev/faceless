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

export function GetCreditsDialog() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
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
      setCode("");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to claim code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Need more credits?</DialogTitle>
        <DialogDescription className="flex flex-col gap-4">
          <div>
            To get more credits (free of charge), please contact me through:
          </div>
          <div className="flex gap-2">
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
                onChange={(e) => setCode(e.target.value)}
              />
              <Button onClick={handleClaimCode} disabled={loading || !code}>
                {loading ? "Claiming..." : "Claim"}
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
