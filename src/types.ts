/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AspectRatio = "16:9" | "9:16" | "21:9" | "4:3" | "1:1";

export interface AspectRatioOption {
  id: AspectRatio;
  name: string;
  width: number;
  height: number;
  icon: string;
}

export type FillType = "solid" | "gradient" | "image";
export type BorderStyle = "solid" | "dashed" | "dotted" | "double";
export type OverlayType = "none" | "time-date" | "quote" | "icons" | "custom-text";

export interface Section {
  id: string;
  name: string;
  x: number; // Absolute coordinate on 1920x1080 reference canvas (re-mapped on render)
  y: number;
  width: number;
  height: number;
  
  // Styling
  borderRadius: number;
  opacity: number; // 0 to 100
  fillType: FillType;
  fillColor: string;
  fillGradient: {
    type: "linear" | "radial";
    angle: number;
    colors: string[]; // [startColor, endColor]
  };
  fillImageUrl: string | null;
  
  // Borders
  borderWidth: number;
  borderStyle: BorderStyle;
  borderColor: string;
  
  // Shadows
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number; // 0 to 100
  
  // Interaction & Visibility
  isLocked: boolean;
  visible: boolean;
  
  // Content Overlay
  overlayType: OverlayType;
  overlayText: string;
  overlayTextColor: string;
  overlayFontSize: number;
}

export interface BackgroundSettings {
  fillType: FillType;
  solidColor: string;
  gradient: {
    type: "linear" | "radial";
    angle: number;
    colors: string[];
  };
  imageUrl: string | null;
  imageBlur: number; // 0 to 40 px
  imageOpacity: number; // 0 to 100
  imageScale: number; // 100 to 200 %
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: "minimalist" | "productivity" | "artistic" | "clean";
  background: BackgroundSettings;
  sections: Section[];
}
