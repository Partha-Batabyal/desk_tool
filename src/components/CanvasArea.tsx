/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { useEditorStore } from "../store";
import { Section } from "../types";
import { Lock, EyeOff, Move, Maximize2 } from "lucide-react";

export default function CanvasArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 450 });

  // Load editor state from store
  const {
    canvasDimension,
    background,
    showGrid,
    gridSize,
    snapToGrid,
    sections,
    selectedSectionId,
    selectSection,
    updateSection,
    recordHistory
  } = useEditorStore();

  // ResizeObserver to automatically recalculate Zoom Scale factor
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width: width || 800, height: height || 450 });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute zoom so that canvas fits inside container with standard padding
  const padding = 48;
  const zoomX = (containerSize.width - padding) / canvasDimension.width;
  const zoomY = (containerSize.height - padding) / canvasDimension.height;
  const zoom = Math.max(0.1, Math.min(zoomX, zoomY, 1.2)); // Cap zoom max at 1.2 so it doesn't get ridiculously large

  const renderWidth = canvasDimension.width * zoom;
  const renderHeight = canvasDimension.height * zoom;

  // Track dragging / resizing states
  const [dragAction, setDragAction] = useState<{
    id: string;
    type: "move" | "resize";
    handle?: string;
    startX: number;
    startY: number;
    startSecX: number;
    startSecY: number;
    startSecW: number;
    startSecH: number;
  } | null>(null);

  // For clock widget
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If we click the bare canvas backdrop, deselect
    if (e.target === canvasRef.current || (e.target as HTMLElement).id === "grid-overlay" || (e.target as HTMLElement).id === "canvas-image-bg") {
      selectSection(null);
    }
  };

  const handleSectionMouseDown = (e: React.MouseEvent, sec: Section) => {
    e.stopPropagation();
    selectSection(sec.id);
    
    if (sec.isLocked || !sec.visible) return;
    
    // Save history point before mutation
    recordHistory();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Canvas space client mouse coordinates
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    setDragAction({
      id: sec.id,
      type: "move",
      startX: mouseX,
      startY: mouseY,
      startSecX: sec.x,
      startSecY: sec.y,
      startSecW: sec.width,
      startSecH: sec.height
    });
  };

  const handleHandleMouseDown = (e: React.MouseEvent, sec: Section, handle: string) => {
    e.stopPropagation();
    if (sec.isLocked || !sec.visible) return;

    recordHistory();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    setDragAction({
      id: sec.id,
      type: "resize",
      handle,
      startX: mouseX,
      startY: mouseY,
      startSecX: sec.x,
      startSecY: sec.y,
      startSecW: sec.width,
      startSecH: sec.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragAction) return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentMouseX = (e.clientX - rect.left) / zoom;
      const currentMouseY = (e.clientY - rect.top) / zoom;

      const deltaX = currentMouseX - dragAction.startX;
      const deltaY = currentMouseY - dragAction.startY;

      const sec = sections.find(s => s.id === dragAction.id);
      if (!sec) return;

      const snap = (v: number) => {
        if (!snapToGrid) return Math.round(v);
        return Math.round(v / gridSize) * gridSize;
      };

      if (dragAction.type === "move") {
        let nextX = dragAction.startSecX + deltaX;
        let nextY = dragAction.startSecY + deltaY;

        // Constraint boundaries (staying fully inside coordinates unless deliberate override)
        nextX = Math.max(0, Math.min(nextX, canvasDimension.width - sec.width));
        nextY = Math.max(0, Math.min(nextY, canvasDimension.height - sec.height));

        updateSection(sec.id, {
          x: snap(nextX),
          y: snap(nextY)
        });
      } else if (dragAction.type === "resize" && dragAction.handle) {
        const h = dragAction.handle;
        let newX = dragAction.startSecX;
        let newY = dragAction.startSecY;
        let newW = dragAction.startSecW;
        let newH = dragAction.startSecH;

        // Handle scaling calculations
        if (h.includes("e")) {
          newW = Math.max(50, dragAction.startSecW + deltaX);
        }
        if (h.includes("s")) {
          newH = Math.max(50, dragAction.startSecH + deltaY);
        }
        if (h.includes("w")) {
          const candidateW = dragAction.startSecW - deltaX;
          if (candidateW >= 50) {
            newX = dragAction.startSecX + deltaX;
            newW = candidateW;
          }
        }
        if (h.includes("n")) {
          const candidateH = dragAction.startSecH - deltaY;
          if (candidateH >= 50) {
            newY = dragAction.startSecY + deltaY;
            newH = candidateH;
          }
        }

        // Apply grid boundaries checks
        updateSection(sec.id, {
          x: snap(newX),
          y: snap(newY),
          width: snap(newW),
          height: snap(newH)
        });
      }
    };

    const handleMouseUp = () => {
      if (dragAction) {
        setDragAction(null);
      }
    };

    if (dragAction) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragAction, zoom, sections, snapToGrid, gridSize, canvasDimension, updateSection]);

  // CSS for background elements
  const getCanvasBackgroundStyles = (): React.CSSProperties => {
    switch (background.fillType) {
      case "gradient":
        const { colors, angle, type } = background.gradient;
        const gradString = type === "linear"
          ? `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`
          : `radial-gradient(circle, ${colors[0]}, ${colors[1]})`;
        return { background: gradString };
      case "image":
        return {
          backgroundColor: "#111827", // Loading fallback
        };
      case "solid":
      default:
        return { backgroundColor: background.solidColor };
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 h-full overflow-hidden bg-black flex items-center justify-center p-6 border-r border-white/10"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }}
    >
      {/* Dynamic Grid Snap Indicator / Workspace Help */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center space-x-3 text-[10px] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-white/50">
        <span className="flex items-center">
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${snapToGrid ? "bg-white animate-pulse" : "bg-neutral-600"}`}></span>
          {snapToGrid ? `Snap active (${gridSize}px)` : "Free layout hover"}
        </span>
        <span className="text-white/20">|</span>
        <span>Zoom {Math.round(zoom * 100)}%</span>
        <span className="text-white/20">|</span>
        <span>HD / 4K Scalable Vector Output</span>
      </div>

      {/* Render Canvas Scale Holder wrapper */}
      <div
        style={{ width: renderWidth, height: renderHeight }}
        className="relative flex items-center justify-center transition-all duration-150"
      >
        <div
          ref={canvasRef}
          id="wallpaper-main-canvas"
          onMouseDown={handleCanvasMouseDown}
          style={{
            width: canvasDimension.width,
            height: canvasDimension.height,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            ...getCanvasBackgroundStyles()
          }}
          className="shadow-2xl overflow-hidden select-none relative"
        >
          {/* Custom background image with optional high performance filter effects */}
          {background.fillType === "image" && background.imageUrl && (
            <img
              id="canvas-image-bg"
              src={background.imageUrl}
              alt="Wallpaper overlay"
              referrerPolicy="no-referrer"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${background.imageScale}%`,
                height: "100%",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
                filter: `blur(${background.imageBlur}px)`,
                opacity: background.imageOpacity / 100,
                pointerEvents: "auto"
              }}
            />
          )}

          {/* Dotted Grid Overlay inside scaled view */}
          {showGrid && (
            <div
              id="grid-overlay"
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: `radial-gradient(circle, white 2px, transparent 1px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`
              }}
            ></div>
          )}

          {/* Core Interactive Sections (Cards) */}
          {sections.map((sec) => {
            if (!sec.visible) return null;

            const isSelected = sec.id === selectedSectionId;
            const hasImageUrl = sec.fillType === "image" && sec.fillImageUrl;

            // Section inline styling
            const sectionStyle: React.CSSProperties = {
              position: "absolute",
              left: `${sec.x}px`,
              top: `${sec.y}px`,
              width: `${sec.width}px`,
              height: `${sec.height}px`,
              borderRadius: `${sec.borderRadius}px`,
              opacity: sec.opacity / 100,
              border: sec.borderWidth > 0 ? `${sec.borderWidth}px ${sec.borderStyle} ${sec.borderColor}` : "none",
              boxShadow: sec.shadowBlur > 0
                ? `${sec.shadowOffsetX}px ${sec.shadowOffsetY}px ${sec.shadowBlur}px 0px ${sec.shadowColor}${Math.round(sec.shadowOpacity * 2.55).toString(16).padStart(2, '0')}`
                : "none",
              cursor: sec.isLocked ? "not-allowed" : "move"
            };

            // Section background filling
            if (sec.fillType === "solid") {
              sectionStyle.backgroundColor = sec.fillColor;
            } else if (sec.fillType === "gradient" && sec.fillGradient) {
              const { type, angle, colors } = sec.fillGradient;
              sectionStyle.background = type === "linear"
                ? `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`
                : `radial-gradient(circle, ${colors[0]}, ${colors[1]})`;
            }

            // Glassmorphism default visual representation if translucent with white border
            const isGlass = sec.opacity < 100 && sec.fillColor.toLowerCase().includes("#ffffff");

            return (
              <div
                key={sec.id}
                id={`widget-section-${sec.id}`}
                style={sectionStyle}
                onMouseDown={(e) => handleSectionMouseDown(e, sec)}
                className={`group flex flex-col justify-between overflow-hidden p-6 transition-shadow ${
                  isGlass ? "backdrop-blur-md" : ""
                } ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-black/20" : ""}`}
              >
                {/* Image loader within bounds */}
                {hasImageUrl && (
                  <img
                    src={sec.fillImageUrl!}
                    alt="Section bg"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                  />
                )}

                {/* Main Content Overlay Section */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center">
                  {sec.overlayType === "time-date" && (
                    <div className="flex flex-col items-center justify-center gap-1.5 drop-shadow-sm select-none">
                      <div
                        className="font-bold tracking-tight leading-none tabular-nums"
                        style={{
                          color: sec.overlayTextColor,
                          fontSize: `${sec.overlayFontSize + 18}px`
                        }}
                      >
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className="text-xs uppercase tracking-widest font-semibold opacity-75"
                        style={{ color: sec.overlayTextColor }}
                      >
                        {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  )}

                  {sec.overlayType === "quote" && (
                    <div className="max-w-[85%] italic text-center text-pretty font-light">
                      <QuoteSvg color={sec.overlayTextColor} />
                      <p
                        className="leading-relaxed mb-2"
                        style={{
                          color: sec.overlayTextColor,
                          fontSize: `${sec.overlayFontSize}px`
                        }}
                      >
                        "{sec.overlayText || "Keep your goals in sight & your workspace clean."}"
                      </p>
                    </div>
                  )}

                  {sec.overlayType === "icons" && (
                    <div className="grid grid-cols-4 gap-6 p-4">
                      {["Safari", "Spotify", "Terminal", "Figma", "Mail", "Notes", "Xcode", "Calendar"].map((app, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 text-center">
                          <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center border border-white/5 shadow-sm text-gray-500">
                            <span className="text-[10px] font-mono font-bold text-gray-400">{app[0]}</span>
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: sec.overlayTextColor }}>
                            {app}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.overlayType === "custom-text" && (
                    <p
                      className="whitespace-pre-line leading-relaxed font-mono font-medium max-w-[90%] text-left"
                      style={{
                        color: sec.overlayTextColor,
                        fontSize: `${sec.overlayFontSize}px`
                      }}
                    >
                      {sec.overlayText || "Write custom reminders or notes here."}
                    </p>
                  )}
                </div>

                {/* Lock or Status Indicator inside Widget */}
                {sec.isLocked && (
                  <div className="absolute top-3 left-3 bg-red-600/95 text-white/95 rounded-full p-1 border border-white/10 shadow-sm z-30 flex items-center justify-center">
                    <Lock size={12} className="stroke-[2.5]" />
                  </div>
                )}

                {/* Interactive Selection Guide Resizers (Shown when selected & unlocked inside scale canvas) */}
                {isSelected && !sec.isLocked && (
                  <>
                    {/* Outline indicator around bounds of element */}
                    <div className="absolute inset-0 border-2 border-white pointer-events-none rounded-[inherit]"></div>
                    
                    {/* Resize anchors on 8 directional nodes: nw, n, ne, e, se, s, sw, w */}
                    {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => {
                      let handleStyle: React.CSSProperties = {
                        position: "absolute",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #000000",
                        borderRadius: "2px",
                        zIndex: 40,
                        cursor: `${h}-resize`
                      };

                      if (h.includes("n")) handleStyle.top = "-6px";
                      if (h.includes("s")) handleStyle.bottom = "-6px";
                      if (h.includes("w")) handleStyle.left = "-6px";
                      if (h.includes("e")) handleStyle.right = "-6px";

                      if (h === "n" || h === "s") handleStyle.left = "calc(50% - 6px)";
                      if (h === "w" || h === "e") handleStyle.top = "calc(50% - 6px)";

                      return (
                        <div
                          key={h}
                          style={handleStyle}
                          onMouseDown={(e) => handleHandleMouseDown(e, sec, h)}
                          className="hover:scale-125 transition-transform"
                        />
                      );
                    })}
                  </>
                )}

                {/* Show red boundary on locked highlight hover */}
                {isSelected && sec.isLocked && (
                  <div className="absolute inset-0 border-2 border-red-500/60 pointer-events-none rounded-[inherit]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Inline svg quote icon helper
function QuoteSvg({ color }: { color: string }) {
  return (
    <svg className="w-5 h-5 mx-auto mb-2 opacity-40 inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 11H5.5C4.67 11 4 10.33 4 9.5V6C4 5.17 4.67 4.5 5.5 4.5H9C9.83 4.5 10.5 5.17 10.5 6V11.5C10.5 14.53 8.03 17 5 17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 11H15.5C14.67 11 14 10.33 14 9.5V6C14 5.17 14.67 4.5 15.5 4.5H19C19.83 4.5 20.5 5.17 20.5 6V11.5C20.5 14.53 18.03 17 15 17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
