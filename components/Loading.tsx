import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
  fullScreen?: boolean;
  element?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  element = "",
  fullScreen = false,
}) => {
  const dimensions = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : ""
      }`}
    >
      <div
        className={`${dimensions[size]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-main dark:text-white`}
        style={{
          animation: "spin 1s linear infinite",
        }}
        role="status"
      >
        <span className="sr-only">
          Loading{element ? ` ${element}` : ""}...
        </span>
      </div>
    </div>
  );
};

export default Loading;
