/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { Section, BackgroundSettings, AspectRatio, PresetTemplate } from "./types";

interface CanvasDimension {
  width: number;
  height: number;
}

interface StateSnapshot {
  sections: Section[];
  background: BackgroundSettings;
}

interface EditorStore {
  // Canvas Configuration
  aspectRatio: AspectRatio;
  canvasDimension: CanvasDimension; // 1920x1080 reference coordinates mapping
  zoom: number; // calculated scale representation
  
  // Background config
  background: BackgroundSettings;
  
  // Grid config
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  
  // Selections
  sections: Section[];
  selectedSectionId: string | null;
  
  // Undo/Redo Stacks
  past: StateSnapshot[];
  future: StateSnapshot[];
  
  // Actions
  setAspectRatio: (ratio: AspectRatio) => void;
  updateBackground: (bg: Partial<BackgroundSettings>) => void;
  updateBackgroundGradient: (gradient: Partial<BackgroundSettings["gradient"]>) => void;
  
  // Grid Actions
  setShowGrid: (show: boolean) => void;
  setGridSize: (size: number) => void;
  setSnapToGrid: (snap: boolean) => void;
  
  // Section CRUD & Layering
  addSection: (section?: Partial<Section>) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  selectSection: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  recordHistory: () => void;
  
  // Layout Controls
  loadTemplate: (template: PresetTemplate) => void;
  clearCanvas: () => void;
}

// Map Aspect Ratio Names to Coordinates (Fixed height/width references)
const RATIO_COORDINATES: Record<AspectRatio, CanvasDimension> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "21:9": { width: 2560, height: 1080 },
  "4:3": { width: 1440, height: 1080 },
  "1:1": { width: 1440, height: 1440 }
};

const initialBackground: BackgroundSettings = {
  fillType: "solid",
  solidColor: "#000000",
  gradient: {
    type: "linear",
    angle: 135,
    colors: ["#111827", "#030712"]
  },
  imageUrl: null,
  imageBlur: 0,
  imageOpacity: 100,
  imageScale: 100
};

// Initial Default Section (per instructions: One light gray rectangle positioned top-right, size 40% w, 25% h)
const createDefaultSection = (): Section => ({
  id: "default-rectangle",
  name: "Top-Right Widget Zone",
  x: 1080, // (1920 * 0.56 approx) - creates starting x that results in top-right position
  y: 80,
  width: 768, // 40% of 1920
  height: 270, // 25% of 1080
  borderRadius: 24,
  opacity: 90,
  fillType: "solid",
  fillColor: "#e2e8f0",
  fillGradient: {
    type: "linear",
    angle: 45,
    colors: ["#ffffff", "#e2e8f0"]
  },
  fillImageUrl: null,
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "#ffffff",
  shadowColor: "#000000",
  shadowBlur: 20,
  shadowOffsetX: 0,
  shadowOffsetY: 8,
  shadowOpacity: 35,
  isLocked: false,
  visible: true,
  overlayType: "time-date",
  overlayText: "",
  overlayTextColor: "#1e293b",
  overlayFontSize: 24
});

export const useEditorStore = create<EditorStore>((set, get) => ({
  aspectRatio: "16:9",
  canvasDimension: RATIO_COORDINATES["16:9"],
  zoom: 1,
  
  background: initialBackground,
  
  showGrid: false,
  gridSize: 40,
  snapToGrid: true,
  
  sections: [createDefaultSection()],
  selectedSectionId: "default-rectangle",
  
  past: [],
  future: [],
  
  recordHistory: () => {
    const { sections, background, past } = get();
    // Save stringified snapshots to avoid deep mutations
    const snapshot: StateSnapshot = JSON.parse(JSON.stringify({ sections, background }));
    
    // Limit history length to 50 steps
    const newPast = [...past, snapshot].slice(-50);
    set({ past: newPast, future: [] });
  },
  
  setAspectRatio: (ratio: AspectRatio) => {
    get().recordHistory();
    const dimensions = RATIO_COORDINATES[ratio];
    
    // Adjust sections to fit within new canvas dimensions proportionally
    const prevDimensions = get().canvasDimension;
    const scaleX = dimensions.width / prevDimensions.width;
    const scaleY = dimensions.height / prevDimensions.height;
    
    const updatedSections = get().sections.map(sec => {
      let newX = Math.round(sec.x * scaleX);
      let newY = Math.round(sec.y * scaleY);
      let newW = Math.round(sec.width * scaleX);
      let newH = Math.round(sec.height * scaleY);
      
      // Boundaries check
      if (newX + newW > dimensions.width) newW = dimensions.width - newX;
      if (newY + newH > dimensions.height) newH = dimensions.height - newY;
      
      return {
        ...sec,
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: Math.max(50, newW),
        height: Math.max(50, newH)
      };
    });
    
    set({
      aspectRatio: ratio,
      canvasDimension: dimensions,
      sections: updatedSections
    });
  },
  
  updateBackground: (bg: Partial<BackgroundSettings>) => {
    get().recordHistory();
    set((state) => ({
      background: { ...state.background, ...bg }
    }));
  },
  
  updateBackgroundGradient: (grad: Partial<BackgroundSettings["gradient"]>) => {
    get().recordHistory();
    set((state) => ({
      background: {
        ...state.background,
        gradient: { ...state.background.gradient, ...grad }
      }
    }));
  },
  
  setShowGrid: (show) => set({ showGrid: show }),
  setGridSize: (size) => set({ gridSize: size }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  
  addSection: (customSection) => {
    get().recordHistory();
    const { sections, canvasDimension } = get();
    
    const newId = `section-${Date.now()}`;
    const defaultSec: Section = {
      id: newId,
      name: `Container Zone ${sections.length + 1}`,
      x: Math.round((canvasDimension.width - 500) / 2),
      y: Math.round((canvasDimension.height - 300) / 2),
      width: 500,
      height: 300,
      borderRadius: 16,
      opacity: 80,
      fillType: "solid",
      fillColor: "#ffffff",
      fillGradient: {
        type: "linear",
        angle: 135,
        colors: ["#ffffff", "#e2e8f0"]
      },
      fillImageUrl: null,
      borderWidth: 0,
      borderStyle: "solid",
      borderColor: "#cbd5e1",
      shadowColor: "#000000",
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowOpacity: 20,
      isLocked: false,
      visible: true,
      overlayType: "none",
      overlayText: "Container Area",
      overlayTextColor: "#334155",
      overlayFontSize: 24,
      ...customSection
    };
    
    set({
      sections: [...sections, defaultSec],
      selectedSectionId: newId
    });
  },
  
  updateSection: (id, updates) => {
    // Only record history for major modifications (not raw real-time drag/rescaling updates to avoid clogging).
    // The canvas slider logic can prompt recordHistory before they touch or on mouse-up.
    set((state) => ({
      sections: state.sections.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    }));
  },
  
  deleteSection: (id) => {
    get().recordHistory();
    const { sections, selectedSectionId } = get();
    set({
      sections: sections.filter((sec) => sec.id !== id),
      selectedSectionId: selectedSectionId === id ? null : selectedSectionId
    });
  },
  
  duplicateSection: (id) => {
    get().recordHistory();
    const { sections, canvasDimension } = get();
    const target = sections.find((sec) => sec.id === id);
    if (!target) return;
    
    const newId = `section-${Date.now()}`;
    const offset = 40; // shift slightly to make duplicate obvious
    const newX = Math.min(target.x + offset, canvasDimension.width - target.width);
    const newY = Math.min(target.y + offset, canvasDimension.height - target.height);
    
    const duplicated: Section = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      name: `${target.name} Copy`,
      x: newX,
      y: newY,
      isLocked: false // unlock by default
    };
    
    set({
      sections: [...sections, duplicated],
      selectedSectionId: newId
    });
  },
  
  selectSection: (id) => set({ selectedSectionId: id }),
  
  bringToFront: (id) => {
    get().recordHistory();
    const { sections } = get();
    const targetIdx = sections.findIndex((sec) => sec.id === id);
    if (targetIdx === -1) return;
    
    const rest = sections.filter((sec) => sec.id !== id);
    const target = sections[targetIdx];
    
    set({ sections: [...rest, target] });
  },
  
  sendToBack: (id) => {
    get().recordHistory();
    const { sections } = get();
    const targetIdx = sections.findIndex((sec) => sec.id === id);
    if (targetIdx === -1) return;
    
    const rest = sections.filter((sec) => sec.id !== id);
    const target = sections[targetIdx];
    
    set({ sections: [target, ...rest] });
  },
  
  moveLayerUp: (id) => {
    get().recordHistory();
    const { sections } = get();
    const idx = sections.findIndex((sec) => sec.id === id);
    if (idx === -1 || idx === sections.length - 1) return;
    
    const newSections = [...sections];
    // Swap
    const temp = newSections[idx];
    newSections[idx] = newSections[idx + 1];
    newSections[idx + 1] = temp;
    
    set({ sections: newSections });
  },
  
  moveLayerDown: (id) => {
    get().recordHistory();
    const { sections } = get();
    const idx = sections.findIndex((sec) => sec.id === id);
    if (idx === -1 || idx === 0) return;
    
    const newSections = [...sections];
    // Swap
    const temp = newSections[idx];
    newSections[idx] = newSections[idx - 1];
    newSections[idx - 1] = temp;
    
    set({ sections: newSections });
  },
  
  undo: () => {
    const { past, future, sections, background } = get();
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    const currentSnapshot: StateSnapshot = {
      sections: JSON.parse(JSON.stringify(sections)),
      background: JSON.parse(JSON.stringify(background))
    };
    
    set({
      sections: previous.sections,
      background: previous.background,
      past: newPast,
      future: [currentSnapshot, ...future]
    });
  },
  
  redo: () => {
    const { past, future, sections, background } = get();
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    const currentSnapshot: StateSnapshot = {
      sections: JSON.parse(JSON.stringify(sections)),
      background: JSON.parse(JSON.stringify(background))
    };
    
    set({
      sections: next.sections,
      background: next.background,
      past: [...past, currentSnapshot],
      future: newFuture
    });
  },
  
  loadTemplate: (template) => {
    get().recordHistory();
    set({
      background: JSON.parse(JSON.stringify(template.background)),
      sections: JSON.parse(JSON.stringify(template.sections)),
      selectedSectionId: template.sections.length > 0 ? template.sections[0].id : null
    });
  },
  
  clearCanvas: () => {
    get().recordHistory();
    set({
      sections: [],
      selectedSectionId: null
    });
  }
}));
