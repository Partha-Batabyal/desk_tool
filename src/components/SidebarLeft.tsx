/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useEditorStore } from "../store";
import { PRESET_TEMPLATES } from "../templates";
import { FillType, Section } from "../types";
import {
  Sparkles,
  Layers,
  Sliders,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Image as ImageIcon,
  Palette,
  LayoutGrid
} from "lucide-react";

export default function SidebarLeft() {
  const {
    background,
    updateBackground,
    updateBackgroundGradient,
    sections,
    selectedSectionId,
    selectSection,
    updateSection,
    deleteSection,
    duplicateSection,
    bringToFront,
    sendToBack,
    moveLayerUp,
    moveLayerDown,
    loadTemplate
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<"templates" | "background" | "layers">("templates");

  // Stock imagery configuration
  const SAMPLE_BG_IMAGES = [
    {
      name: "Minimalist Sand Curves",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Calm Cyber Ocean",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Abstract Neon Shapes",
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Serene Cosmic Dust",
      url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateBackground({
          fillType: "image",
          imageUrl: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="w-64 h-full bg-[#0A0A0A]/40 backdrop-blur-xl border-r border-white/10 flex flex-col select-none z-10 overflow-hidden">
      {/* Sidebar Section Navigation Header */}
      <div className="grid grid-cols-3 border-b border-white/10 bg-black/40 h-12 p-1 gap-1">
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center justify-center gap-1 rounded text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-all ${
            activeTab === "templates"
              ? "bg-white/10 text-white border border-white/10 font-bold"
              : "text-white/40 hover:text-white"
          }`}
        >
          <Sparkles size={11} className={activeTab === "templates" ? "text-white" : ""} />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab("background")}
          className={`flex items-center justify-center gap-1 rounded text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-all ${
            activeTab === "background"
              ? "bg-white/10 text-white border border-white/10 font-bold"
              : "text-white/40 hover:text-white"
          }`}
        >
          <Palette size={11} className={activeTab === "background" ? "text-white" : ""} />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex items-center justify-center gap-1 rounded text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-all ${
            activeTab === "layers"
              ? "bg-white/10 text-white border border-white/10 font-bold"
              : "text-white/40 hover:text-white"
          }`}
        >
          <Layers size={11} className={activeTab === "layers" ? "text-white" : ""} />
          <span>Layers</span>
        </button>
      </div>

      {/* Main Tab Render Container */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {/* TAB 1: PRESET DESIGNER TEMPLATES */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Sparkles size={10} className="text-white/60" />
                Workspace Presets
              </h3>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Load high fidelity minimalist grids and card overlays to start designing quickly.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  className="w-full text-left bg-white/5 border border-white/10 rounded p-3 transition-all group hover:bg-white/10 hover:border-white/20 cursor-pointer block relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white tracking-tight group-hover:text-white transition-colors">
                      {tpl.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    {tpl.description}
                  </p>
                  
                  {/* Miniature decorative border indicator */}
                  <div className="absolute right-0 bottom-0 w-8 h-[2px] bg-white/25"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WALLPAPER CANVAS BACKGROUNDS */}
        {activeTab === "background" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest font-mono">
                Wallpaper Background
              </h3>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Configure your overall workspace environment and canvas texture.
              </p>
            </div>

            {/* Fill Type Selector */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded border border-white/10">
              {(["solid", "gradient", "image"] as FillType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => updateBackground({ fillType: type })}
                  className={`text-[9px] uppercase font-bold tracking-wider py-1.5 rounded transition-all cursor-pointer ${
                    background.fillType === type
                      ? "bg-white/15 text-white border border-white/10"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Solid Fill Configuration */}
            {background.fillType === "solid" && (
              <div className="space-y-3 bg-white/5 p-3 rounded border border-white/10">
                <label className="text-[10px] font-semibold text-white/60 uppercase block font-mono">Solid Color</label>
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded border border-white/10 shrink-0 cursor-pointer overflow-hidden">
                    <input
                      type="color"
                      value={background.solidColor}
                      onChange={(e) => updateBackground({ solidColor: e.target.value })}
                      className="absolute inset-0 w-full h-full scale-150 cursor-pointer p-0 border-0 bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={background.solidColor}
                    onChange={(e) => updateBackground({ solidColor: e.target.value })}
                    className="flex-1 bg-[#0A0A0A] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            )}

            {/* Gradient Fill Configuration */}
            {background.fillType === "gradient" && (
              <div className="space-y-3 bg-white/5 p-3 rounded border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-white/60 uppercase font-mono">Gradient Setup</label>
                  <select
                    value={background.gradient.type}
                    onChange={(e) => updateBackgroundGradient({ type: e.target.value as "linear" | "radial" })}
                    className="bg-[#0A0A0A] border border-white/10 text-[9px] text-white/80 rounded px-1.5 py-0.5 outline-none"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {/* Split Color Pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40 block">Start Color</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={background.gradient.colors[0]}
                        onChange={(e) => {
                          const currentcolors = [...background.gradient.colors];
                          currentcolors[0] = e.target.value;
                          updateBackgroundGradient({ colors: currentcolors });
                        }}
                        className="w-6 h-6 rounded border border-white/10 p-0 overflow-hidden cursor-pointer bg-transparent"
                      />
                      <span className="text-[9px] font-mono uppercase text-white/60">
                        {background.gradient.colors[0]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40 block">End Color</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={background.gradient.colors[1]}
                        onChange={(e) => {
                          const currentcolors = [...background.gradient.colors];
                          currentcolors[1] = e.target.value;
                          updateBackgroundGradient({ colors: currentcolors });
                        }}
                        className="w-6 h-6 rounded border border-white/10 p-0 overflow-hidden cursor-pointer bg-transparent"
                      />
                      <span className="text-[9px] font-mono uppercase text-white/60">
                        {background.gradient.colors[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gradient Angle Slider if Linear */}
                {background.gradient.type === "linear" && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-white/45">
                      <span>Angle</span>
                      <span className="font-mono text-white">{background.gradient.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={background.gradient.angle}
                      onChange={(e) => updateBackgroundGradient({ angle: parseInt(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Image Fill Configuration */}
            {background.fillType === "image" && (
              <div className="space-y-3.5 bg-white/5 p-3 rounded border border-white/10">
                <label className="text-[10px] font-semibold text-white/60 uppercase block font-mono">Stock Curations</label>
                
                {/* Predefined Quality Landscapes */}
                <div className="grid grid-cols-2 gap-1.5">
                  {SAMPLE_BG_IMAGES.map((img) => (
                    <button
                      key={img.name}
                      onClick={() => updateBackground({ imageUrl: img.url })}
                      className="h-10 rounded border border-white/10 overflow-hidden relative cursor-pointer group active:scale-95 transition-all text-left"
                    >
                      <img src={img.url} alt={img.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-1 text-center group-hover:bg-black/70 transition-all">
                        <span className="text-[8px] font-bold tracking-tight text-white/80 leading-none truncate">{img.name.replace("Minimalist ", "")}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 text-[9px] text-white/30 justify-center">
                  <div className="h-px bg-white/5 flex-grow"></div>
                  <span>OR</span>
                  <div className="h-px bg-white/5 flex-grow"></div>
                </div>

                {/* File Uploader */}
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 block">Upload Wallpaper</span>
                  <label className="flex items-center justify-center border border-dashed border-white/10 hover:border-white/25 hover:bg-white/5 rounded p-3 transition-all cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-white/40" size={13} />
                      <span className="text-[10px] font-medium text-white/60">Choose file...</span>
                    </div>
                  </label>
                </div>

                {/* Filter sliders on wallpapers - Blur, Scale, opacity */}
                {background.imageUrl && (
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/45">
                        <span>Background Blur</span>
                        <span className="font-mono text-white">{background.imageBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={background.imageBlur}
                        onChange={(e) => updateBackground({ imageBlur: parseInt(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/45">
                        <span>Wallpaper Scale</span>
                        <span className="font-mono text-white">{background.imageScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="200"
                        value={background.imageScale}
                        onChange={(e) => updateBackground({ imageScale: parseInt(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded appearance-none cursor-ew-resize accent-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/45">
                        <span>Opacity</span>
                        <span className="font-mono text-white">{background.imageOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={background.imageOpacity}
                        onChange={(e) => updateBackground({ imageOpacity: parseInt(e.target.value) })}
                        className="w-full h-1 bg-[#1A1A1A] rounded appearance-none cursor-ew-resize accent-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LAYER MANAGEMENT */}
        {activeTab === "layers" && (
          <div className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Layers size={11} className="text-white/60" />
                  Wallpaper Layers
                </h3>
                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                  Reorder, lock, and manage widget containment zones.
                </p>
              </div>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-8 bg-white/5 rounded border border-dashed border-white/10">
                <LayoutGrid className="mx-auto text-white/20 mb-2" size={20} />
                <p className="text-xs text-white/40">No custom layers yet.</p>
                <p className="text-[9px] text-white/30 mt-1">Click "Add Zone" inside topbar to start layering.</p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                {/* Render layers in reverse order so items on TOP (end of list) appear first in Sidebar lists */}
                {[...sections].reverse().map((sec) => {
                  const isSelected = sec.id === selectedSectionId;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => selectSection(sec.id)}
                      className={`flex items-center justify-between p-2 rounded border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-white/5 border-white/5 hover:border-white/10 text-white/70"
                      }`}
                    >
                      <div className="flex items-center gap-2 max-w-[60%]">
                        <span className="text-[11px] font-medium truncate leading-none">
                          {sec.name}
                        </span>
                      </div>

                      {/* Controls Area */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Visibility toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSection(sec.id, { visible: !sec.visible });
                          }}
                          className={`p-1 hover:bg-white/5 rounded cursor-pointer ${
                            sec.visible ? "text-white" : "text-white/20"
                          }`}
                        >
                          {sec.visible ? <Eye size={12} /> : <EyeOff size={11} />}
                        </button>

                        {/* Lock toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSection(sec.id, { isLocked: !sec.isLocked });
                          }}
                          className={`p-1 hover:bg-white/5 rounded cursor-pointer ${
                            sec.isLocked ? "text-white" : "text-white/20"
                          }`}
                        >
                          {sec.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>

                        {/* Order adjustment actions */}
                        <div className="flex flex-col leading-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerUp(sec.id);
                            }}
                            className="p-0.5 hover:bg-white/5 rounded text-white/30 hover:text-white"
                            title="Move Up"
                          >
                            <ChevronUp size={10} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerDown(sec.id);
                            }}
                            className="p-0.5 hover:bg-white/5 rounded text-white/30 hover:text-white"
                            title="Move Down"
                          >
                            <ChevronDown size={10} />
                          </button>
                        </div>

                        {/* Quick Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(sec.id);
                          }}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded cursor-pointer shrink-0"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
