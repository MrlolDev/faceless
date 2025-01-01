import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
  element?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = "medium", element = "" }) => {
  const dimensions = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${dimensions[size]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-main`}
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
