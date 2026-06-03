/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useEditorStore } from "../store";
import { Download, Monitor, Check, Sparkles } from "lucide-react";

export default function ExportDeck() {
  const { canvasDimension, background, sections } = useEditorStore();
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"png" | "jpg">("png");
  const [selectedRes, setSelectedRes] = useState<"1080p" | "1440p" | "4K">("1080p");

  const resolutionSet = {
    "1080p": { name: "Full HD (1080p)", w: 1920, h: 1080 },
    "1440p": { name: "2K Quad HD (1440p)", w: 2560, h: 1440 },
    "4K": { name: "4K UHD (2160p)", w: 3840, h: 2160 }
  };

  const getTargetDimensions = () => {
    // Determine scale proportional to selected Aspect Ratio
    const refW = canvasDimension.width;
    const refH = canvasDimension.height;
    const ratio = refW / refH;

    let targetW = 1920;
    if (selectedRes === "1440p") targetW = 2560;
    if (selectedRes === "4K") targetW = 3840;

    const targetH = Math.round(targetW / ratio);
    return { w: targetW, h: targetH };
  };

  const { w: exportW, h: exportH } = getTargetDimensions();

  // Draw-and-export routine
  const handleExport = async () => {
    setExporting(true);
    // Allow thread to yield for loaders
    await new Promise((r) => setTimeout(r, 400));

    try {
      const canvas = document.createElement("canvas");
      canvas.width = exportW;
      canvas.height = exportH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D context");

      const refWidth = canvasDimension.width;
      const scale = exportW / refWidth;

      // 1. Wallpaper Background filling
      if (background.fillType === "solid") {
        ctx.fillStyle = background.solidColor;
        ctx.fillRect(0, 0, exportW, exportH);
      } else if (background.fillType === "gradient") {
        const { colors, type, angle } = background.gradient;
        let grad;
        if (type === "linear") {
          const rad = (angle * Math.PI) / 180;
          const x1 = exportW / 2 - Math.cos(rad) * exportW / 2;
          const y1 = exportH / 2 - Math.sin(rad) * exportH / 2;
          const x2 = exportW / 2 + Math.cos(rad) * exportW / 2;
          const y2 = exportH / 2 + Math.sin(rad) * exportH / 2;
          grad = ctx.createLinearGradient(x1, y1, x2, y2);
        } else {
          grad = ctx.createRadialGradient(
            exportW / 2,
            exportH / 2,
            0,
            exportW / 2,
            exportH / 2,
            Math.max(exportW, exportH) / 2
          );
        }
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, exportW, exportH);
      } else if (background.fillType === "image" && background.imageUrl) {
        // Loads image inside canvas
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background.imageUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue scaling nonetheless
        });

        ctx.save();
        if (background.imageBlur > 0) {
          ctx.filter = `blur(${background.imageBlur * scale}px)`;
        }
        ctx.globalAlpha = background.imageOpacity / 100;
        
        const scaleFactor = background.imageScale / 100;
        const dw = exportW * scaleFactor;
        const dh = exportH * scaleFactor;
        ctx.drawImage(img, (exportW - dw) / 2, (exportH - dh) / 2, dw, dh);
        ctx.restore();
      }

      // 2. Draw sections cards
      for (const sec of sections) {
        if (!sec.visible) continue;

        ctx.save();
        
        const sx = sec.x * scale;
        const sy = sec.y * scale;
        const sw = sec.width * scale;
        const sh = sec.height * scale;
        const sradius = sec.borderRadius * scale;

        // Apply alpha
        ctx.globalAlpha = sec.opacity / 100;

        // Setup drop-shadow if specified
        if (sec.shadowBlur > 0) {
          ctx.shadowColor = `${sec.shadowColor}${Math.round(sec.shadowOpacity * 2.55).toString(16).padStart(2, '0')}`;
          ctx.shadowBlur = sec.shadowBlur * scale;
          ctx.shadowOffsetX = sec.shadowOffsetX * scale;
          ctx.shadowOffsetY = sec.shadowOffsetY * scale;
        }

        // Clip container path to rounded rectangle shape
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(sx, sy, sw, sh, sradius);
        } else {
          // Manual render rounded rect
          ctx.beginPath();
          ctx.moveTo(sx + sradius, sy);
          ctx.lineTo(sx + sw - sradius, sy);
          ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + sradius);
          ctx.lineTo(sx + sw, sy + sh - sradius);
          ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - sradius, sy + sh);
          ctx.lineTo(sx + sradius, sy + sh);
          ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - sradius);
          ctx.lineTo(sx, sy + sradius);
          ctx.quadraticCurveTo(sx, sy, sx + sradius, sy);
          ctx.closePath();
        }
        
        // Fill section color or gradient
        if (sec.fillType === "solid") {
          ctx.fillStyle = sec.fillColor;
          ctx.fill();
        } else if (sec.fillType === "gradient" && sec.fillGradient) {
          const { colors, type, angle } = sec.fillGradient;
          let secGrad;
          if (type === "linear") {
            const rad = (angle * Math.PI) / 180;
            const x1 = sx + sw/2 - Math.cos(rad) * sw/2;
            const y1 = sy + sh/2 - Math.sin(rad) * sh/2;
            const x2 = sx + sw/2 + Math.cos(rad) * sw/2;
            const y2 = sy + sh/2 + Math.sin(rad) * sh/2;
            secGrad = ctx.createLinearGradient(x1, y1, x2, y2);
          } else {
            secGrad = ctx.createRadialGradient(
              sx + sw/2,
              sy + sh/2,
              0,
              sx + sw/2,
              sy + sh/2,
              Math.max(sw, sh)/2
            );
          }
          secGrad.addColorStop(0, colors[0]);
          secGrad.addColorStop(1, colors[1]);
          ctx.fillStyle = secGrad;
          ctx.fill();
        } else if (sec.fillType === "image" && sec.fillImageUrl) {
          ctx.fill(); // Fill solid black base beforehand
          const frameImg = new Image();
          frameImg.crossOrigin = "anonymous";
          frameImg.src = sec.fillImageUrl;
          await new Promise((resolve) => {
            frameImg.onload = resolve;
            frameImg.onerror = resolve;
          });
          ctx.drawImage(frameImg, sx, sy, sw, sh);
        }

        ctx.restore(); // Drop active clip bounds

        // 3. Draw borders
        if (sec.borderWidth > 0) {
          ctx.save();
          ctx.globalAlpha = sec.opacity / 100;
          ctx.strokeStyle = sec.borderColor;
          ctx.lineWidth = sec.borderWidth * scale;

          if (sec.borderStyle === "dashed") {
            ctx.setLineDash([12 * scale, 6 * scale]);
          } else if (sec.borderStyle === "dotted") {
            ctx.setLineDash([3 * scale, 3 * scale]);
          } else {
            ctx.setLineDash([]);
          }

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(sx, sy, sw, sh, sradius);
          } else {
            ctx.arc(sx + sradius, sy + sradius, sradius, Math.PI, 1.5 * Math.PI);
            ctx.arc(sx + sw - sradius, sy + sradius, sradius, 1.5 * Math.PI, 2 * Math.PI);
            ctx.arc(sx + sw - sradius, sy + sh - sradius, sradius, 0, 0.5 * Math.PI);
            ctx.arc(sx + sradius, sy + sh - sradius, sradius, 0.5 * Math.PI, Math.PI);
            ctx.closePath();
          }
          ctx.stroke();
          ctx.restore();
        }

        // 4. Draw texts contents
        if (sec.overlayType !== "none") {
          ctx.save();
          ctx.globalAlpha = sec.opacity / 100;
          ctx.fillStyle = sec.overlayTextColor;

          const baseFontSize = sec.overlayFontSize * scale;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const cx = sx + sw/2;
          const cy = sy + sh/2;

          if (sec.overlayType === "time-date") {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
            
            ctx.font = `bold ${baseFontSize + 20 * scale}px system-ui, -apple-system, sans-serif`;
            ctx.fillText(timeStr, cx, cy - 14 * scale);

            ctx.font = `bold ${10 * scale}px system-ui, -apple-system, sans-serif`;
            ctx.fillText(dateStr, cx, cy + 30 * scale);
          } else if (sec.overlayType === "quote") {
            const quote = sec.overlayText || "Keep your goals in sight & your workspace clean.";
            ctx.font = `italic 300 ${baseFontSize}px Georgia, serif`;
            wrapText(ctx, `"${quote}"`, cx, cy, sw * 0.82, baseFontSize * 1.35);
          } else if (sec.overlayType === "custom-text") {
            const linesText = sec.overlayText || "Write custom reminders or notes here.";
            ctx.font = `500 ${baseFontSize}px monospace, SFMono-Regular, Fira Code`;
            wrapText(ctx, linesText, cx, cy, sw * 0.9, baseFontSize * 1.35);
          } else if (sec.overlayType === "icons") {
            ctx.font = `500 ${baseFontSize}px system-ui, sans-serif`;
            ctx.fillText("[ Micro Apps Installed ]", cx, cy);
          }
          ctx.restore();
        }
      }

      // Convert and download
      const mime = selectedFormat === "jpg" ? "image/jpeg" : "image/png";
      const u = canvas.toDataURL(mime, 0.95);
      
      const dlLink = document.createElement("a");
      dlLink.download = `Wallpaper_${exportW}x${exportH}_${Date.now()}.${selectedFormat}`;
      dlLink.href = u;
      dlLink.click();

    } catch (err) {
      console.error(err);
      alert("An error occurred during wallpaper exports. Please retry.");
    } finally {
      setExporting(false);
    }
  };

  // Helper Wrap text canvas function
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) => {
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxW && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = test;
      }
    }
    lines.push(line);

    let startY = y - ((lines.length - 1) * lineH) / 2;
    for (const l of lines) {
      ctx.fillText(l.trim(), x, startY);
      startY += lineH;
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[500px] px-4 select-none">
      <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded p-4 flex items-center justify-between gap-4 shadow-2xl">
        {/* Settings options: resolution scaling */}
        <div className="flex flex-col gap-1.5 grow max-w-[60%]">
          <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-semibold uppercase tracking-widest font-mono">
            <Sparkles size={11} className="text-white" />
            <span>Generate Export Set</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Selection toggle */}
            <div className="flex items-center bg-black/40 p-0.5 rounded border border-white/10 shrink-0">
              {(["png", "jpg"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded cursor-pointer transition-all ${
                    selectedFormat === fmt ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Resolution dropdown slider bar */}
            <div className="flex items-center bg-black/40 p-0.5 rounded border border-white/10 grow">
              {(["1080p", "1440p", "4K"] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setSelectedRes(res)}
                  className={`text-[9px] font-bold px-2.5 py-1.5 rounded cursor-pointer text-center grow transition-all ${
                    selectedRes === res
                      ? "bg-white/15 text-white border border-white/10 font-bold"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="h-10 px-5 rounded bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 disabled:opacity-40 select-none grow shrink-0 justify-center transition-colors shadow-lg"
        >
          {exporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Rendering...</span>
            </>
          ) : (
            <>
              <Download size={13} className="stroke-[2.5]" />
              <span>Export {exportW}x{exportH}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
