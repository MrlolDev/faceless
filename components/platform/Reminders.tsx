import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Twitter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const REMINDER_MESSAGES = [
  {
    type: "twitter",
    message: "Like what you see? Follow us on Twitter for updates!",
    action: {
      text: "Follow @mrloldev",
      url: "https://twitter.com/mrloldev",
    },
  },
  /*
  {
    type: "producthunt",
    message: "Support us by voting on Product Hunt!",
    action: {
      text: "Vote on Product Hunt",
      url: "https://www.producthunt.com/posts/faceless-avatar",
    },
  },
  */
];

export function Reminders() {
  const [showReminder, setShowReminder] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [reminder, setReminder] = useState(REMINDER_MESSAGES[0]);
  const pathname = usePathname();

  const handleHideReminder = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowReminder(false);
      setIsExiting(false);
    }, 300); // Match this with animation duration
  };

  useEffect(() => {
    // Only show on app routes
    if (!pathname.startsWith("/app")) return;

    const intervalId = setInterval(() => {
      const availableReminders = REMINDER_MESSAGES.filter((reminder) => {
        const hasShownKey = `reminder-shown-${reminder.type}`;
        const shownTime = localStorage.getItem(hasShownKey);
        return !shownTime || Date.now() - Number(shownTime) > 600000;
      });

      const randomReminder =
        availableReminders[
          Math.floor(Math.random() * availableReminders.length)
        ];
      if (!randomReminder) return;

      // Check if already shown
      const hasShownKey = `reminder-shown-${randomReminder.type}`;
      const shownTime = localStorage.getItem(hasShownKey);
      if (shownTime && Date.now() - Number(shownTime) < 600000) return;

      // Show reminder and update storage
      setReminder(randomReminder);
      setShowReminder(true);
      localStorage.setItem(hasShownKey, Date.now().toString());

      // Hide after 8 seconds
      setTimeout(() => {
        handleHideReminder();
      }, 8000);
    }, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [pathname]);

  if (!showReminder) return null;

  return (
    <Alert
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[80vw] flex items-center gap-4 ${
        isExiting
          ? "animate-[fadeOut_300ms_ease-in-out_forwards]"
          : "animate-[fadeIn_300ms_ease-in-out]"
      }`}
    >
      <AlertDescription className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-2">
          {reminder.type === "twitter" && <Twitter className="h-4 w-4" />}
          {reminder.message}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="neutral"
            size="sm"
            className="ml-2"
            onClick={() => {
              window.open(reminder.action.url, "_blank");
              handleHideReminder();
            }}
          >
            {reminder.action.text}
          </Button>
          <Button variant="neutral" size="sm" onClick={handleHideReminder}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
