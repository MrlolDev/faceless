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
        <DialogDescription className="flex flex-col gap-2">
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
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
