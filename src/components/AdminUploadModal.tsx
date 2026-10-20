import React, { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Cloud,
  Layers,
  Trash2,
  Plus,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import {
  AspectRatio,
  DominantColor,
  Pin,
  SchoolClass,
  SCHOOL_CLASSES,
} from "../types";
import { apiUrl } from "../api";
import { BrandLogo } from "./BrandLogo";

interface StagedItem {
  id: string;
  file?: File;
  previewUrl: string;
  imageBase64: string;
  title: string;
  description: string;
  category: SchoolClass;
  aspectRatio: AspectRatio;
  tags: string[];
  tagInput: string;
  dominantColors: DominantColor[];
  aestheticVibe: string;
  status: "pending" | "uploading" | "completed" | "error";
  errorMessage?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
}

interface AdminUploadModalProps {
  categories?: string[];
  adminToken?: string;
  onClose: () => void;
  onPublishPin?: (newPin: Pin) => void;
  onPublishBatch?: (newPins: Pin[]) => void;
}

const PUBLISH_CONCURRENCY = 3;

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  adminToken,
  onClose,
  onPublishPin,
  onPublishBatch,
}) => {
  // Staged images list for multiple grab-and-drop
  const [stagedItems, setStagedItems] = useState<StagedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Global defaults for new items
  const [batchClass, setBatchClass] = useState<SchoolClass>("Pry 4");

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Publishing / progress state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{
    current: number;
    total: number;
    message: string;
  } | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process dropped or selected files
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setGlobalError(null);
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (imageFiles.length === 0) {
        setGlobalError(
          "Please select valid image files (JPG, PNG, WebP, GIF).",
        );
        return;
      }

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Generate a clean title from file name (without extension, formatted)
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const cleanTitle = nameWithoutExt
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .trim();

          const newItem: StagedItem = {
            id: `staged-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            file,
            previewUrl: result,
            imageBase64: result,
            title: cleanTitle || `Visual Resource (${batchClass})`,
            description: `Educational & visual learning material for ${batchClass}.`,
            category: batchClass,
            aspectRatio: "2/3",
            tags: [
              batchClass.toLowerCase().replace(/\s+/g, ""),
              "education",
              "learning",
              "visual",
            ],
            tagInput: "",
            dominantColors: [
              { name: "Warm Terracotta", hex: "#C86D51" },
              { name: "Classic Charcoal", hex: "#2B2D42" },
            ],
            aestheticVibe: `${batchClass} Educational Resource`,
            status: "pending",
          };

          setStagedItems((prev) => {
            const next = [...prev, newItem];
            if (!selectedItemId) {
              setSelectedItemId(newItem.id);
            }
            return next;
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [batchClass, selectedItemId],
  );

  // Grab & Drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so same files can be re-selected if needed
      e.target.value = "";
    }
  };

  // Remove a staged item
  const handleRemoveItem = (idToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStagedItems((prev) => {
      const filtered = prev.filter((item) => item.id !== idToRemove);
      if (selectedItemId === idToRemove) {
        setSelectedItemId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // Clear all staged items
  const handleClearAll = () => {
    if (window.confirm("Clear all staged images?")) {
      setStagedItems([]);
      setSelectedItemId(null);
    }
  };

  // Apply class to ALL items in batch
  const handleApplyClassToAll = (targetClass: SchoolClass) => {
    setBatchClass(targetClass);
    setStagedItems((prev) =>
      prev.map((item) => ({
        ...item,
        category: targetClass,
        tags: Array.from(
          new Set([
            ...item.tags.filter(
              (t) =>
                !SCHOOL_CLASSES.some(
                  (c) => c.toLowerCase().replace(/\s+/g, "") === t,
                ),
            ),
            targetClass.toLowerCase().replace(/\s+/g, ""),
          ]),
        ),
      })),
    );
  };

  // Update field of selected item
  const updateSelectedItem = (updates: Partial<StagedItem>) => {
    if (!selectedItemId) return;
    setStagedItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemId ? { ...item, ...updates } : item,
      ),
    );
  };

  const currentSelectedItem =
    stagedItems.find((item) => item.id === selectedItemId) ||
    stagedItems[0] ||
    null;

  // Add tag to selected item
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      currentSelectedItem &&
      currentSelectedItem.tagInput.trim()
    ) {
      e.preventDefault();
      const cleaned = currentSelectedItem.tagInput
        .trim()
        .toLowerCase()
        .replace(/^#/, "");
      if (!currentSelectedItem.tags.includes(cleaned)) {
        updateSelectedItem({
          tags: [...currentSelectedItem.tags, cleaned],
          tagInput: "",
        });
      } else {
        updateSelectedItem({ tagInput: "" });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!currentSelectedItem) return;
    updateSelectedItem({
      tags: currentSelectedItem.tags.filter((t) => t !== tagToRemove),
    });
  };

  // AI Auto-Analyze selected image with Gemini
  const handleAiAutoAnalyze = async () => {
    if (!currentSelectedItem) return;
    setIsAnalyzingAi(true);
    setGlobalError(null);

    try {
      const response = await fetch(apiUrl("/api/ai/analyze-image"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: currentSelectedItem.imageBase64,
          mimeType: "image/jpeg",
          promptContext: `This is an educational visual resource for school students in Nigerian curriculum classes: ${currentSelectedItem.category}. Suggested subjects: Science, Mathematics, Geography, Arts, Biology, English.`,
        }),
      });

      if (!response.ok) {
        throw new Error("AI analysis service error");
      }

      const data = await response.json();

      updateSelectedItem({
        title: data.title || currentSelectedItem.title,
        description: data.description || currentSelectedItem.description,
        tags: Array.from(
          new Set([...currentSelectedItem.tags, ...(data.suggestedTags || [])]),
        ),
        dominantColors:
          Array.isArray(data.dominantColors) && data.dominantColors.length > 0
            ? data.dominantColors
            : currentSelectedItem.dominantColors,
        aestheticVibe: data.aestheticVibe || currentSelectedItem.aestheticVibe,
        aspectRatio: ["2/3", "1/1", "3/4", "16/9", "9/16"].includes(
          data.aspectRatio,
        )
          ? (data.aspectRatio as AspectRatio)
          : currentSelectedItem.aspectRatio,
      });
    } catch (err: any) {
      console.error(err);
      setGlobalError(
        "Gemini AI analysis could not complete for this item. You can edit details manually.",
      );
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Publish all staged images
  const handleBatchPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedItems.length === 0) {
      setGlobalError("Please grab and drop at least one image to upload.");
      return;
    }

    // Validate that all have titles
    const missingTitle = stagedItems.some((item) => !item.title.trim());
    if (missingTitle) {
      setGlobalError(
        "Please ensure all images have a title before publishing.",
      );
      return;
    }

    setIsPublishing(true);
    setGlobalError(null);
    const token =
      adminToken || localStorage.getItem("pinspire_admin_token") || "";
    const publishedPins: Pin[] = [];
    const totalItems = stagedItems.length;
    let nextItemIndex = 0;
    let settledItems = 0;
    setPublishProgress({
      current: 0,
      total: totalItems,
      message: `Publishing ${totalItems} images (${Math.min(PUBLISH_CONCURRENCY, totalItems)} at a time)...`,
    });

    const publishWorker = async () => {
      while (true) {
        const itemIndex = nextItemIndex++;
        if (itemIndex >= totalItems) return;

        const item = stagedItems[itemIndex];
        setStagedItems((prev) =>
          prev.map((staged) =>
            staged.id === item.id ? { ...staged, status: "uploading" } : staged,
          ),
        );

        try {
          const uploadRes = await fetch(apiUrl("/api/upload"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              imageBase64: item.imageBase64,
              title: item.title.trim(),
              description: item.description.trim(),
              category: item.category,
              tags: item.tags,
              aspectRatio: item.aspectRatio,
              dominantColor: item.dominantColors[0],
            }),
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json();
            throw new Error(errData.error || "Cloudinary upload failed");
          }

          const uploadData = await uploadRes.json();
          const finalUrl = uploadData.url;
          const publicId = uploadData.publicId;

          const newPinPayload: Pin = {
            id: `pin-${Date.now()}-${itemIndex}-${Math.random().toString(36).substr(2, 4)}`,
            title: item.title.trim(),
            description:
              item.description.trim() ||
              `Educational material for ${item.category}.`,
            imageUrl: finalUrl,
            cloudinaryPublicId: publicId,
            aspectRatio: item.aspectRatio,
            category: item.category,
            tags:
              item.tags.length > 0
                ? item.tags
                : [
                    item.category.toLowerCase().replace(/\s+/g, ""),
                    "education",
                  ],
            dominantColor: item.dominantColors[0] || {
              name: "Warm Neutral",
              hex: "#C86D51",
            },
            author: {
              name: "School Admin",
              handle: "@peterotunuya",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80",
              role: "admin",
            },
            curatedByAdmin: true,
            featured: true,
            savedCount: 0,
            likesCount: 0,
            likedByUser: false,
            createdAt: new Date().toISOString(),
            comments: [],
            aiAnalysis: {
              aestheticVibe:
                item.aestheticVibe || `${item.category} Visual Study`,
              suggestedTags: item.tags,
              dominantColors: item.dominantColors,
              recognizedSubjects: [item.title],
              category: item.category,
            },
          };

          const saveRes = await fetch(apiUrl("/api/pins"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(newPinPayload),
          });

          if (!saveRes.ok) {
            const saveErr = await saveRes.json();
            throw new Error(
              saveErr.error || "Failed to save pin to MongoDB Atlas",
            );
          }

          publishedPins.push(await saveRes.json());
          setStagedItems((prev) =>
            prev.map((staged) =>
              staged.id === item.id
                ? { ...staged, status: "completed", cloudinaryUrl: finalUrl }
                : staged,
            ),
          );
        } catch (err: any) {
          console.error(`Error uploading item "${item.title}":`, err);
          setStagedItems((prev) =>
            prev.map((staged) =>
              staged.id === item.id
                ? { ...staged, status: "error", errorMessage: err.message }
                : staged,
            ),
          );
        } finally {
          settledItems += 1;
          setPublishProgress({
            current: settledItems,
            total: totalItems,
            message: `Published ${settledItems} of ${totalItems} images...`,
          });
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(PUBLISH_CONCURRENCY, totalItems) }, () =>
        publishWorker(),
      ),
    );

    setIsPublishing(false);

    if (publishedPins.length > 0) {
      if (onPublishBatch) {
        onPublishBatch(publishedPins);
      } else if (onPublishPin) {
        publishedPins.forEach((pin) => onPublishPin(pin));
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-stone-50/70">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" showSubtitle={false} />
            <div className="border-l border-stone-300 pl-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">
                  Multi-Image Batch Upload Studio
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Grab &amp; drop multiple curriculum images (Pry 4 to SSS 3) to
                Cloudinary &amp; MongoDB Atlas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close upload studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Grab & Drop Zone (Supports multiple images dropped at once) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
              isDragOver
                ? "border-red-600 bg-red-50/70 scale-[1.01] shadow-lg ring-4 ring-red-500/20"
                : "border-stone-300 hover:border-stone-800 bg-stone-50/50 hover:bg-stone-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
                  isDragOver
                    ? "bg-red-600 text-white scale-110"
                    : "bg-white shadow-md text-stone-700"
                }`}
              >
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <p className="text-base font-bold text-stone-900">
                  {isDragOver
                    ? "Drop your images here now!"
                    : "Grab & Drop Multiple Images Here"}
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Drag and drop 1, 5, or 20+ images from your computer or{" "}
                  <span className="text-[#E60023] font-semibold underline underline-offset-2">
                    browse files
                  </span>
                  . Supports JPG, PNG, WebP &amp; GIF.
                </p>
              </div>

              {/* Class Dropdown & Bulk Action in Dropzone */}
              <div
                className="mt-2 flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-stone-200/80"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
                  <GraduationCap className="w-4 h-4 text-[#E60023]" />
                  <span className="text-xs font-semibold text-stone-700">
                    Dropdown Class Level:
                  </span>
                  <select
                    value={batchClass}
                    onChange={(e) =>
                      handleApplyClassToAll(e.target.value as SchoolClass)
                    }
                    className="text-xs font-bold bg-transparent text-stone-900 focus:outline-none cursor-pointer pr-1"
                  >
                    {SCHOOL_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {stagedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleApplyClassToAll(batchClass)}
                    className="px-3 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                  >
                    Apply "{batchClass}" to All ({stagedItems.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Staged Images Queue Bar */}
          {stagedItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-stone-600" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Staged Images Queue ({stagedItems.length})
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    (Click an image to customize its title or class)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Thumbnails Strip */}
              <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                {stagedItems.map((item, idx) => {
                  const isSelected = item.id === selectedItemId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`group relative shrink-0 w-24 sm:w-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? "border-[#E60023] ring-4 ring-red-500/20 shadow-md scale-[1.03]"
                          : "border-stone-200 hover:border-stone-400 bg-stone-100 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden bg-stone-200">
                        <img
                          src={item.previewUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Class Badge */}
                        <div className="absolute top-1 left-1">
                          <span className="px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold">
                            {item.category}
                          </span>
                        </div>

                        {/* Status Icon */}
                        {item.status === "completed" && (
                          <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        {item.status === "error" && (
                          <div className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-xs">
                            <AlertCircle className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {/* Remove hover button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveItem(item.id, e)}
                          className="absolute bottom-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-1.5 bg-white">
                        <p className="text-[10px] font-bold text-stone-900 truncate">
                          #{idx + 1} {item.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Individual Image Editor Panel for the Selected Staged Item */}
              {currentSelectedItem && (
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-xs font-bold">
                        Editing Item
                      </span>
                      <h4 className="text-sm font-bold text-stone-800 truncate max-w-sm">
                        {currentSelectedItem.title}
                      </h4>
                    </div>

                    {/* Gemini AI Auto-Analyze Button */}
                    <button
                      type="button"
                      onClick={handleAiAutoAnalyze}
                      disabled={isAnalyzingAi}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 hover:border-red-500 hover:text-[#E60023] text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 text-amber-500 ${isAnalyzingAi ? "animate-spin" : ""}`}
                      />
                      <span>
                        {isAnalyzingAi
                          ? "Analyzing with Gemini..."
                          : "AI Auto-Detect Details"}
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left: Preview thumbnail */}
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className="w-full max-w-[200px] aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-stone-900">
                        <img
                          src={currentSelectedItem.previewUrl}
                          alt={currentSelectedItem.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] text-stone-500 mt-2 font-medium">
                        Selected for {currentSelectedItem.category}
                      </span>
                    </div>

                    {/* Right: Form fields */}
                    <div className="md:col-span-8 space-y-3.5">
                      {/* Title & Class dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-stone-700">
                            Image Title *
                          </label>
                          <input
                            type="text"
                            value={currentSelectedItem.title}
                            onChange={(e) =>
                              updateSelectedItem({ title: e.target.value })
                            }
                            placeholder="e.g., Photosynthesis & Plant Leaf Diagram"
                            className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:outline-none font-medium"
                          />
                        </div>

                        {/* The Dropdown Content: Pry 4, Pry 5, Pry 6, JSS 1, JSS 2, JSS 3, SSS 1, SSS 2, SSS 3 */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-[#E60023]" />
                            <span>Class Dropdown *</span>
                          </label>
                          <select
                            value={currentSelectedItem.category}
                            onChange={(e) =>
                              updateSelectedItem({
                                category: e.target.value as SchoolClass,
                              })
                            }
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:outline-none font-bold text-stone-900 cursor-pointer"
                          >
                            {SCHOOL_CLASSES.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          Description &amp; Educational Notes
                        </label>
                        <textarea
                          rows={2}
                          value={currentSelectedItem.description}
                          onChange={(e) =>
                            updateSelectedItem({ description: e.target.value })
                          }
                          placeholder="Key takeaways, subject context, or learning summary..."
                          className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:outline-none font-medium resize-none"
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700">
                          Subject Tags
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {currentSelectedItem.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200/80 text-stone-800 text-[11px] font-semibold"
                            >
                              <span>#{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-rose-600 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={currentSelectedItem.tagInput}
                          onChange={(e) =>
                            updateSelectedItem({ tagInput: e.target.value })
                          }
                          onKeyDown={handleAddTag}
                          placeholder="Type tag (e.g. biology, fractions, chemistry) and press Enter..."
                          className="w-full px-3.5 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Publishing Progress Overlay */}
          {isPublishing && publishProgress && (
            <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-400 animate-pulse" />
                  {publishProgress.message}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {publishProgress.current} / {publishProgress.total} (
                  {Math.round(
                    (publishProgress.current / publishProgress.total) * 100,
                  )}
                  %)
                </span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${(publishProgress.current / publishProgress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-stone-400 text-right">
                Directly uploading to Cloudinary (cloud_name: jzqpqrtg) &amp;
                syncing to MongoDB Atlas...
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-stone-200/80 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            {stagedItems.length > 0 ? (
              <span>
                <strong>{stagedItems.length}</strong>{" "}
                {stagedItems.length === 1 ? "image" : "images"} ready to
                publish.
              </span>
            ) : (
              <span>
                Grab and drop images into the box above to get started.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleBatchPublish}
              disabled={isPublishing || stagedItems.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E60023] hover:bg-[#b6001c] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <Cloud className="w-4 h-4 animate-spin" />
                  <span>
                    Publishing {publishProgress?.current || 0} of{" "}
                    {stagedItems.length}...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    Publish{" "}
                    {stagedItems.length > 0
                      ? `${stagedItems.length} Images`
                      : "Images"}{" "}
                    to Cloudinary &amp; MongoDB
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
