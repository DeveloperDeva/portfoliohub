import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface UsePreviewNavigationOptions {
  itemCount: number;
}

export const usePreviewNavigation = ({ itemCount }: UsePreviewNavigationOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Sync with URL on mount
  useEffect(() => {
    const previewParam = searchParams.get("preview");
    if (previewParam !== null) {
      const index = parseInt(previewParam, 10);
      if (!isNaN(index) && index >= 0 && index < itemCount) {
        setSelectedIndex(index);
      }
    }
  }, [searchParams, itemCount]);

  // Open preview and update URL
  const openPreview = useCallback((index: number) => {
    setSelectedIndex(index);
    setSearchParams({ preview: index.toString() }, { replace: true });
  }, [setSearchParams]);

  // Close preview and remove URL param
  const closePreview = useCallback(() => {
    setSelectedIndex(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Navigate to next item
  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % itemCount;
    openPreview(nextIndex);
  }, [selectedIndex, itemCount, openPreview]);

  // Navigate to previous item
  const goToPrev = useCallback(() => {
    if (selectedIndex === null) return;
    const prevIndex = selectedIndex === 0 ? itemCount - 1 : selectedIndex - 1;
    openPreview(prevIndex);
  }, [selectedIndex, itemCount, openPreview]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closePreview();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closePreview, goToNext, goToPrev]);

  return {
    selectedIndex,
    isOpen: selectedIndex !== null,
    openPreview,
    closePreview,
    goToNext,
    goToPrev,
  };
};
