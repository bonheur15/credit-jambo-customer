import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Palette } from "lucide-react";
import { useEffect, useRef, useState, type JSX } from "react";

export default function Header() {
  return <FloatingThemeToggle />;
}

function FloatingThemeToggle() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };
  const handleToggleClick = () => {
    if (isOpen) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsOpen(false);
    } else {
      handleMouseEnter();
    }
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <ModeToggle />
        </div>
      </div>

      <button
        onClick={handleToggleClick}
        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle theme settings panel"
      >
        <Palette className="h-6 w-6" />
      </button>
    </div>
  );
}
