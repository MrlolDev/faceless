"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CodesForm() {
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState(1);
  const [maxUses, setMaxUses] = useState(1);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) {
      toast({
        title: "Error",
        description: "Please select an expiry date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          credits,
          maxUses,
          expires_at: expiryDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create code");
      }

      toast({
        title: "Success",
        description: "Code created successfully",
      });

      // Reset form
      setCode("");
      setCredits(1);
      setMaxUses(1);
      setExpiryDate(undefined);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1"
          required
        />
        <Button type="button" onClick={generateRandomCode}>
          Generate Random
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Credits</label>
          <Input
            type="number"
            step={1}
            min={1}
            value={credits || ""}
            onChange={(e) =>
              setCredits(e.target.value ? parseInt(e.target.value) : 1)
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Uses</label>
          <Input
            type="number"
            step={1}
            min={1}
            value={maxUses || ""}
            onChange={(e) =>
              setMaxUses(e.target.value ? parseInt(e.target.value) : 1)
            }
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Expiry Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="neutral"
              className={cn(
                "w-full justify-start text-left font-normal",
                !expiryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={expiryDate}
              onSelect={setExpiryDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Code"}
      </Button>
    </form>
  );
}
