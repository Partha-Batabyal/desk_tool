/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useEditorStore } from "../store";
import { BorderStyle, FillType, OverlayType } from "../types";
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  Settings2,
  Maximize2,
  Hash,
  Square,
  Type,
  Maximize,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export default function SidebarRight() {
  const {
    sections,
    selectedSectionId,
    updateSection,
    duplicateSection,
    deleteSection,
    recordHistory
  } = useEditorStore();

  const selectedSec = sections.find((sec) => sec.id === selectedSectionId);

  const handleGeometryChange = (key: "x" | "y" | "width" | "height", value: string) => {
    if (!selectedSec) return;
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      updateSection(selectedSec.id, { [key]: Math.max(0, parsed) });
    }
  };

  const handleSectionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSec) return;
    const file = e.target.files?.[0];
    if (!file) return;

    recordHistory();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateSection(selectedSec.id, {
          fillType: "image",
          fillImageUrl: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!selectedSec) {
    return (
      <aside className="w-64 h-full bg-[#0A0A0A]/40 backdrop-blur-xl border-l border-white/10 flex flex-col items-center justify-center text-center p-6 select-none z-10">
        <div className="bg-white/5 w-11 h-11 rounded border border-white/10 flex items-center justify-center text-white/40 mb-3">
          <Settings2 size={16} />
        </div>
        <h4 className="text-[10px] font-semibold text-white/45 uppercase tracking-widest font-mono">Inspect Zones</h4>
        <p className="text-[10px] text-white/40 max-w-[180px] leading-relaxed mt-1.5">
          Select or click on any rectangular zone inside the canvas to customize its layout, overlays, shadows, borders, and widget content.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-full bg-[#0A0A0A]/40 backdrop-blur-xl border-l border-white/10 flex flex-col select-none overflow-y-auto custom-scrollbar z-10">
      
      {/* Target Inspector Header */}
      <div className="p-3 border-b border-white/10 h-12 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-1.5">
          <Square size={12} className="text-white/60" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Zone Parameters</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateSection(selectedSec.id)}
            title="Duplicate Layer"
            className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded cursor-pointer transition-colors"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => {
              deleteSection(selectedSec.id);
            }}
            title="Delete Layer"
            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4 text-xs">
        
        {/* SECTION 1: ZONE IDENTITY & GENERAL */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono block">Identity</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={selectedSec.name}
              onChange={(e) => updateSection(selectedSec.id, { name: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-white/30"
            />
            {/* Lock Action Inside Inspector */}
            <button
              onClick={() => updateSection(selectedSec.id, { isLocked: !selectedSec.isLocked })}
              className={`p-1.5 rounded border transition-all cursor-pointer ${
                selectedSec.isLocked
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
              }`}
              title={selectedSec.isLocked ? "Unlock Position" : "Lock Position"}
            >
              {selectedSec.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
          </div>
        </div>

        {/* SECTION 2: DIMENSION GEOMETRY (PX SPECIFIC) */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono block">Geometry Dimensions</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                <Hash size={8} /> Pos X
              </span>
              <input
                type="number"
                value={selectedSec.x}
                onChange={(e) => handleGeometryChange("x", e.target.value)}
                disabled={selectedSec.isLocked}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 font-mono text-[11px] text-white disabled:opacity-45"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                <Hash size={8} /> Pos Y
              </span>
              <input
                type="number"
                value={selectedSec.y}
                onChange={(e) => handleGeometryChange("y", e.target.value)}
                disabled={selectedSec.isLocked}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 font-mono text-[11px] text-white disabled:opacity-45"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                <Maximize size={8} /> Width px
              </span>
              <input
                type="number"
                value={selectedSec.width}
                onChange={(e) => handleGeometryChange("width", e.target.value)}
                disabled={selectedSec.isLocked}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 font-mono text-[11px] text-white disabled:opacity-45"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                <Maximize2 size={8} /> Height px
              </span>
              <input
                type="number"
                value={selectedSec.height}
                onChange={(e) => handleGeometryChange("height", e.target.value)}
                disabled={selectedSec.isLocked}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 font-mono text-[11px] text-white disabled:opacity-45"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE visual APPEARANCE / CORNERS / opacity */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono block">Appearance</label>

          {/* Rounded corners */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/45">
              <span>Rounded Corners</span>
              <span className="font-mono text-white">{selectedSec.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="128"
              value={selectedSec.borderRadius}
              onChange={(e) => updateSection(selectedSec.id, { borderRadius: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
            />
          </div>

          {/* Opacity Layout */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/45">
              <span>Fill Opacity</span>
              <span className="font-mono text-white">{selectedSec.opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedSec.opacity}
              onChange={(e) => updateSection(selectedSec.id, { opacity: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
            />
          </div>

          {/* Section Fill Type Selection */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-white/40 font-mono uppercase block">Fill Style</span>
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded border border-white/10">
              {(["solid", "gradient", "image"] as FillType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => updateSection(selectedSec.id, { fillType: type })}
                  className={`text-[9px] uppercase font-bold py-1 rounded cursor-pointer transition-all ${
                    selectedSec.fillType === type
                      ? "bg-white/15 text-white border border-white/10"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Solid Color Config */}
          {selectedSec.fillType === "solid" && (
            <div className="space-y-2 bg-white/5 p-2 rounded border border-white/10">
              <span className="text-[9px] text-white/40 block font-mono uppercase">Select Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedSec.fillColor}
                  onChange={(e) => updateSection(selectedSec.id, { fillColor: e.target.value })}
                  className="w-6 h-6 rounded border border-white/10 p-0 overflow-hidden bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSec.fillColor}
                  onChange={(e) => updateSection(selectedSec.id, { fillColor: e.target.value })}
                  className="flex-1 bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 font-mono text-[10px] uppercase text-white"
                />
              </div>
            </div>
          )}

          {/* Gradient Setup */}
          {selectedSec.fillType === "gradient" && selectedSec.fillGradient && (
            <div className="space-y-3 bg-white/5 p-3 rounded border border-white/10">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white/40 font-mono uppercase">Gradient Type</span>
                <select
                  value={selectedSec.fillGradient.type}
                  onChange={(e) => {
                    updateSection(selectedSec.id, {
                      fillGradient: {
                        ...selectedSec.fillGradient!,
                        type: e.target.value as "linear" | "radial"
                      }
                    });
                  }}
                  className="bg-[#0A0A0A] border border-white/10 text-[9px] text-white rounded px-1.5 py-0.5"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 block">Start</span>
                  <input
                    type="color"
                    value={selectedSec.fillGradient.colors[0]}
                    onChange={(e) => {
                      const colors = [...selectedSec.fillGradient!.colors];
                      colors[0] = e.target.value;
                      updateSection(selectedSec.id, {
                        fillGradient: { ...selectedSec.fillGradient!, colors }
                      });
                    }}
                    className="w-full h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 block">End</span>
                  <input
                    type="color"
                    value={selectedSec.fillGradient.colors[1]}
                    onChange={(e) => {
                      const colors = [...selectedSec.fillGradient!.colors];
                      colors[1] = e.target.value;
                      updateSection(selectedSec.id, {
                        fillGradient: { ...selectedSec.fillGradient!, colors }
                      });
                    }}
                    className="w-full h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              {selectedSec.fillGradient.type === "linear" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/45">
                    <span>Angle</span>
                    <span className="font-mono text-white">{selectedSec.fillGradient.angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedSec.fillGradient.angle}
                    onChange={(e) => {
                      updateSection(selectedSec.id, {
                        fillGradient: {
                          ...selectedSec.fillGradient!,
                          angle: parseInt(e.target.value)
                        }
                      });
                    }}
                    className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* Image Upload Area inside specific widget container */}
          {selectedSec.fillType === "image" && (
            <div className="space-y-2 bg-white/5 p-2 rounded border border-white/10">
              <span className="text-[9px] text-white/40 block font-mono uppercase">Zone Frame Image</span>
              <label className="flex flex-col items-center justify-center p-2.5 border border-dashed border-white/10 hover:border-white/20 rounded cursor-pointer text-center hover:bg-white/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSectionImageUpload}
                  className="hidden"
                />
                <span className="text-[10px] font-medium text-white/60">Choose file...</span>
              </label>

              {selectedSec.fillImageUrl && (
                <div className="relative pt-1.5 border-t border-white/10">
                  <button
                    onClick={() => updateSection(selectedSec.id, { fillImageUrl: null })}
                    className="w-full py-1 text-[9px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/15 rounded transition-colors"
                  >
                    Remove frame image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 4: STYLISH BORDERS CONFIG */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono block">Border & Outlines</label>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 block font-mono">Weight</span>
              <input
                type="number"
                min="0"
                max="16"
                value={selectedSec.borderWidth}
                onChange={(e) => updateSection(selectedSec.id, { borderWidth: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 font-mono text-[10px] text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 block font-mono">Style</span>
              <select
                value={selectedSec.borderStyle}
                onChange={(e) => updateSection(selectedSec.id, { borderStyle: e.target.value as BorderStyle })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 text-[10px] text-white outline-none"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
          </div>

          {selectedSec.borderWidth > 0 && (
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
              <input
                type="color"
                value={selectedSec.borderColor}
                onChange={(e) => updateSection(selectedSec.id, { borderColor: e.target.value })}
                className="w-6 h-6 rounded border border-white/10 p-0 overflow-hidden bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedSec.borderColor}
                onChange={(e) => updateSection(selectedSec.id, { borderColor: e.target.value })}
                className="flex-1 bg-transparent font-mono text-[10px] uppercase text-white/60 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* SECTION 5: ADVANCED SHADOWS / DROPSHADOWS */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono block">Drop Shadow</label>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/45">
              <span>Shadow Blur</span>
              <span className="font-mono text-white">{selectedSec.shadowBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={selectedSec.shadowBlur}
              onChange={(e) => updateSection(selectedSec.id, { shadowBlur: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 font-mono">Offset X</span>
              <input
                type="number"
                value={selectedSec.shadowOffsetX}
                onChange={(e) => updateSection(selectedSec.id, { shadowOffsetX: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1 font-mono text-[10px] text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-white/40 font-mono">Offset Y</span>
              <input
                type="number"
                value={selectedSec.shadowOffsetY}
                onChange={(e) => updateSection(selectedSec.id, { shadowOffsetY: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1 font-mono text-[10px] text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/45">
              <span>Shadow Opacity</span>
              <span className="font-mono text-white">{selectedSec.shadowOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedSec.shadowOpacity}
              onChange={(e) => updateSection(selectedSec.id, { shadowOpacity: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
            <input
              type="color"
              value={selectedSec.shadowColor}
              onChange={(e) => updateSection(selectedSec.id, { shadowColor: e.target.value })}
              className="w-6 h-6 rounded border border-white/10 p-0 bg-transparent cursor-pointer shrink-0"
            />
            <span className="text-[10px] text-white/60 uppercase font-mono">
              Color: {selectedSec.shadowColor}
            </span>
          </div>
        </div>

        {/* SECTION 6: CONTENT WIDGET OVERLAY (ULTIMATE LEVEL PREVIEW) */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest font-mono flex items-center gap-1.5 block">
            <Sparkles size={10} className="text-white/60" />
            Widget Overlays
          </label>

          <div className="space-y-1.5">
            <span className="text-[9px] text-white/40 font-mono uppercase block">Active Overlay</span>
            <select
              value={selectedSec.overlayType}
              onChange={(e) => updateSection(selectedSec.id, { overlayType: e.target.value as OverlayType })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded p-2 text-[10px] text-white outline-none"
            >
              <option value="none">Empty Box (Clean Slate)</option>
              <option value="time-date">Integrated Desk Clock Widget</option>
              <option value="quote">Minimalist Quote Card overlay</option>
              <option value="icons">Icon Area placeholder</option>
              <option value="custom-text">Custom Text Memo box</option>
            </select>
          </div>

          {/* Interactive typography controls for texts overlay widgets */}
          {selectedSec.overlayType !== "none" && (
            <div className="space-y-3 bg-white/5 p-2.5 rounded border border-white/10">
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/40 font-mono uppercase">Text Color</span>
                <input
                  type="color"
                  value={selectedSec.overlayTextColor}
                  onChange={(e) => updateSection(selectedSec.id, { overlayTextColor: e.target.value })}
                  className="w-5 h-5 rounded border border-white/10 p-0 overflow-hidden bg-transparent cursor-pointer"
                />
              </div>

              {/* Font Sizing */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/45">
                  <span>Font Sizing</span>
                  <span className="font-mono text-white">{selectedSec.overlayFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="64"
                  value={selectedSec.overlayFontSize}
                  onChange={(e) => updateSection(selectedSec.id, { overlayFontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
                />
              </div>

              {/* Extra text area if editable widget */}
              {(selectedSec.overlayType === "quote" || selectedSec.overlayType === "custom-text") && (
                <div className="space-y-1 border-t border-white/10 pt-2">
                  <span className="text-[9px] text-white/40 font-mono uppercase block">Custom Text</span>
                  <textarea
                    rows={3}
                    value={selectedSec.overlayText}
                    onChange={(e) => updateSection(selectedSec.id, { overlayText: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 text-[10px] text-white rounded p-1.5 font-mono focus:outline-none focus:border-white/20 custom-scrollbar resize-none"
                    placeholder="Enter widget content lines..."
                  />
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
