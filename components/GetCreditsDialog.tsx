import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GetCreditsDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Need more credits?</DialogTitle>
        <DialogDescription>
          To get more credits, please contact MrLolDev on Twitter at{" "}
          <a
            href="https://twitter.com/mrloldev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @mrloldev
          </a>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
