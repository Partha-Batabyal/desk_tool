/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useEditorStore } from "../store";
import { AspectRatio } from "../types";
import {
  Undo,
  Redo,
  Layout,
  Grid,
  Trash2,
  Plus,
  HelpCircle,
  Monitor,
  Smartphone,
  Tv,
  Check,
  ChevronDown
} from "lucide-react";

export default function Toolbar() {
  const {
    aspectRatio,
    setAspectRatio,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    undo,
    redo,
    past,
    future,
    clearCanvas,
    addSection
  } = useEditorStore();

  const [ratioDropdownOpen, setRatioDropdownOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const ASPECT_RATIOS: { id: AspectRatio; name: string; description: string; icon: any }[] = [
    { id: "16:9", name: "16:9 Desktop", description: "Standard Full HD / 4K Desktop", icon: Monitor },
    { id: "21:9", name: "21:9 Ultra-Wide", description: "Panoramic Gaming Desktop", icon: Tv },
    { id: "9:16", name: "9:16 Mobile", description: "iPhone / Android Lockscreen", icon: Smartphone },
    { id: "4:3", name: "4:3 Tablet", description: "iPad / Tablet Wallpapers", icon: Monitor },
    { id: "1:1", name: "1:1 Square", description: "Avatar / Social Background", icon: Layout }
  ];

  const activeRatioInfo = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <header className="h-14 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md px-6 flex items-center justify-between select-none z-20">
      {/* Brand Logo & Descriptor */}
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-white rounded flex items-center justify-center transition-transform hover:rotate-3">
          <div className="w-3 h-3 border-2 border-black"></div>
        </div>
        <div>
          <h1 className="text-xs font-bold tracking-tight text-white leading-none uppercase">Wallpaper.Gen</h1>
          <p className="text-[9px] text-white/40 leading-none mt-1">Minimalist Wallpaper Designer</p>
        </div>
      </div>

      {/* Center Tool Items (Ratio, Add container, Grid, Undo/Redo) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Aspect Ratio Selector */}
        <div className="relative">
          <button
            id="aspect-ratio-btn"
            onClick={() => setRatioDropdownOpen(!ratioDropdownOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 h-8 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white transition-all cursor-pointer"
          >
            <activeRatioInfo.icon size={12} className="text-white/80" />
            <span className="text-[11px]">{activeRatioInfo.name}</span>
            <ChevronDown size={11} className="text-white/40" />
          </button>

          {ratioDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setRatioDropdownOpen(false)}
              ></div>
              <div className="absolute top-[36px] left-0 w-60 rounded bg-[#0A0A0A] border border-white/10 shadow-2xl p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                {ASPECT_RATIOS.map((ratio) => {
                  const Icon = ratio.icon;
                  const isSelected = ratio.id === aspectRatio;
                  return (
                    <button
                      key={ratio.id}
                      onClick={() => {
                        setAspectRatio(ratio.id);
                        setRatioDropdownOpen(false);
                      }}
                      className={`flex items-start w-full gap-3 p-2 rounded text-left transition-all cursor-pointer ${
                        isSelected ? "bg-white/10 text-white border-l-2 border-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={14} className={`mt-0.5 ${isSelected ? "text-white" : "text-white/40"}`} />
                      <div className="flex-1">
                        <div className="text-xs font-semibold flex items-center justify-between">
                          <span>{ratio.name}</span>
                          {isSelected && <Check size={11} className="text-white" />}
                        </div>
                        <div className="text-[9px] text-white/30 mt-0.5">{ratio.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-white/10"></div>

        {/* Action Tools: Undo / Redo */}
        <div className="flex items-center bg-white/5 p-0.5 rounded border border-white/10">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo (Ctrl+Z)"
            className="p-1 rounded hover:bg-white/5 hover:text-white text-white/40 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white/40 transition-all cursor-pointer"
          >
            <Undo size={13} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-1 rounded hover:bg-white/5 hover:text-white text-white/40 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white/40 transition-all cursor-pointer"
          >
            <Redo size={13} />
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-white/10"></div>

        {/* Add Layer Section Shortcut */}
        <button
          onClick={() => addSection()}
          className="flex items-center space-x-1 px-3 py-1.5 h-8 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded transition-colors cursor-pointer"
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span className="hidden sm:inline">Add Zone</span>
        </button>

        {/* Grid Snapping Settings */}
        <div className="flex items-center bg-white/5 px-0.5 rounded border border-white/10 h-8">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Hide/Show Grid Overlay"
            className={`p-1 rounded hover:bg-white/5 text-white/40 cursor-pointer ${
              showGrid ? "text-white bg-white/10" : ""
            }`}
          >
            <Grid size={13} />
          </button>
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            id="snap-btn"
            title="Toggle Magnet Grid Snapping"
            className={`text-[9.5px] px-2 py-1 font-bold uppercase tracking-wider rounded cursor-pointer ${
              snapToGrid ? "bg-white/15 text-white" : "text-white/40 hover:text-white/60"
            }`}
          >
            Snap
          </button>
        </div>
      </div>

      {/* Right Side Help & Utility Trigger */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
          title="Interactive Help"
        >
          <HelpCircle size={14} />
        </button>

        <button
          onClick={() => {
            clearCanvas();
          }}
          className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
          title="Clear Designer Canvas"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Help Dialog Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowHelp(false)}></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-lg w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150 shadow-2xl">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2 mb-3">
              <HelpCircle className="text-white" size={16} />
              Minimalist Wallpaper Studio Guide
            </h3>

            <div className="space-y-4 text-xs text-white/60 leading-relaxed overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div>
                <p className="font-semibold text-white mb-1">🎯 Design Concept</p>
                <p>
                  This tool helps you create distraction-free desktop or mobile backgrounds featuring pre-defined modular zones. These zones serve as placeholders for widgets, workspace overlays, icons, or visual notes while keeping the rest elegant and minimal.
                </p>
              </div>

              <div>
                <p className="font-semibold text-white mb-1">🎮 Canvas Editing Controls</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Add Zone</strong>: Add rectangular regions to isolate widget containers.</li>
                  <li><strong>Drag & Move</strong>: Drag anywhere inside a selected zone to move it.</li>
                  <li><strong>Resize</strong>: Scale zones dynamically with the 8 resizing anchors.</li>
                  <li><strong>Snap to Grid</strong>: Auto-snap layouts to clean coordinates (defined in toolbar).</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-white mb-1">🛠️ Advanced Layers & Templates</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Lock individual zones so you don't accidentally move them.</li>
                  <li>Apply gorgeous pre-made preset layouts via the left side template cards.</li>
                  <li>Custom overlay panels: Add modern Real-time clocks, Calendar widgets, quote cards, app mockups or customized text overlays.</li>
                </ul>
              </div>

              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="font-semibold text-white mb-1 tracking-tight">💾 Ultra-High Resolution Rendering</p>
                <p className="text-[11px] text-white/50">
                  When exporting, we generate the entire layout using pixel-perfect vectors. Outputs scale flawlessly to <strong>1080p</strong>, <strong>QHD (2K)</strong>, or <strong>4K UHD</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full bg-white hover:bg-neutral-200 cursor-pointer text-black font-bold py-2 rounded text-xs transition-colors"
            >
              Got it, let's design
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
