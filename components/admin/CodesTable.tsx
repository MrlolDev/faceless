import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code } from "@/types/codes";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";

export default function CodesTable() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [showCode, setShowCode] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await fetch("/api/admin/codes");
        const data = await response.json();
        setCodes(data);
      } catch (error) {
        console.error("Error fetching codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const handleToggleActive = async (id: string) => {
    const response = await fetch(`/api/admin/codes`, {
      method: "PATCH",
      body: JSON.stringify({
        is_active: !codes.find((code) => code.id === id)?.is_active,
        id,
      }),
    });
    if (response.ok) {
      toast({
        title: "Success",
        description: "Code updated successfully",
      });
      setCodes((prev) =>
        prev.map((code) =>
          code.id === id ? { ...code, is_active: !code.is_active } : code
        )
      );
    }
  };

  if (loading) {
    return <Loading element="codes" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Uses</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell className="font-mono flex flex-row items-center gap-2">
              {showCode?.includes(code.id) ? (
                <>
                  {code.code}
                  <Button
                    onClick={() =>
                      setShowCode((prev) =>
                        prev ? prev.filter((id) => id !== code.id) : []
                      )
                    }
                    variant="reverse"
                    size="icon"
                  >
                    <EyeOffIcon className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  {Array(code.code.length).fill("*").join("")}
                  <Button
                    onClick={() => setShowCode((prev) => [...prev, code.id])}
                    variant="reverse"
                    size="icon"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </>
              )}
            </TableCell>
            <TableCell>{code.credits}</TableCell>
            <TableCell>
              {(code.usedBy || []).length} / {code.maxUses}
            </TableCell>
            <TableCell>
              {format(new Date(code.expires_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <Badge
                variant={code.is_active ? "default" : "neutral"}
                onClick={() => handleToggleActive(code.id)}
                className="cursor-pointer"
              >
                {code.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
