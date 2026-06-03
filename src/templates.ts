/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetTemplate } from "./types";

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "minimalist-default",
    name: "Minimalist Slate (Default)",
    description: "Classic distraction-free black background with a clean light-gray widget frame in the top-right corner.",
    category: "minimalist",
    background: {
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
    },
    sections: [
      {
        id: "default-rectangle",
        name: "Top-Right Widget Zone",
        x: 1080,
        y: 80,
        width: 768,
        height: 270,
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
      }
    ]
  },
  {
    id: "notion-workspace",
    name: "Productive Bento Grid",
    description: "Multi-zone layout styled with Notion-like colors for organization, task-tracking, and quick calendar setups.",
    category: "productivity",
    background: {
      fillType: "gradient",
      solidColor: "#09090b",
      gradient: {
        type: "linear",
        angle: 135,
        colors: ["#18181b", "#09090b"]
      },
      imageUrl: null,
      imageBlur: 10,
      imageOpacity: 100,
      imageScale: 100
    },
    sections: [
      {
        id: "bento-time",
        name: "Focal Timeboard",
        x: 80,
        y: 80,
        width: 650,
        height: 380,
        borderRadius: 32,
        opacity: 95,
        fillType: "gradient",
        fillColor: "#1d4ed8",
        fillGradient: {
          type: "linear",
          angle: 45,
          colors: ["#2563eb", "#1d4ed8"]
        },
        fillImageUrl: null,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#3b82f6",
        shadowColor: "#2563eb",
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 8,
        shadowOpacity: 15,
        isLocked: false,
        visible: true,
        overlayType: "time-date",
        overlayText: "",
        overlayTextColor: "#ffffff",
        overlayFontSize: 28
      },
      {
        id: "bento-inspiration",
        name: "Quote of the Day",
        x: 80,
        y: 490,
        width: 650,
        height: 510,
        borderRadius: 32,
        opacity: 80,
        fillType: "solid",
        fillColor: "#1e1e24",
        fillGradient: {
          type: "linear",
          angle: 45,
          colors: ["#3b82f6", "#8b5cf6"]
        },
        fillImageUrl: null,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#2e2e38",
        shadowColor: "#000000",
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
        shadowOpacity: 25,
        isLocked: false,
        visible: true,
        overlayType: "quote",
        overlayText: "The only limit to our realization of tomorrow will be our doubts of today.",
        overlayTextColor: "#94a3b8",
        overlayFontSize: 18
      },
      {
        id: "bento-apps",
        name: "Widget Overlay Zone",
        x: 770,
        y: 80,
        width: 1070,
        height: 920,
        borderRadius: 40,
        opacity: 60,
        fillType: "solid",
        fillColor: "#18181b",
        fillGradient: {
          type: "linear",
          angle: 45,
          colors: ["#3b82f6", "#8b5cf6"]
        },
        fillImageUrl: null,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#27272a",
        shadowColor: "#000000",
        shadowBlur: 40,
        shadowOffsetX: 0,
        shadowOffsetY: 12,
        shadowOpacity: 30,
        isLocked: false,
        visible: true,
        overlayType: "custom-text",
        overlayText: "PRIMARY WORKPLACE INTEGRATIONS\n\n- Drag window layers right here\n- Place active terminals & widgets inside borders\n- Setup widgets like Discord/Slack overlay",
        overlayTextColor: "#e4e4e7",
        overlayFontSize: 18
      }
    ]
  },
  {
    id: "glassmorphism-sunset",
    name: "Vibrant Cyber Glass",
    description: "An incredibly trendy neon/glassmorphic combination with dynamic blurred backdrops.",
    category: "artistic",
    background: {
      fillType: "gradient",
      solidColor: "#000000",
      gradient: {
        type: "radial",
        angle: 45,
        colors: ["#4c1d95", "#03001e"]
      },
      imageUrl: null,
      imageBlur: 0,
      imageOpacity: 100,
      imageScale: 100
    },
    sections: [
      {
        id: "glass-1",
        name: "Neon Glass Pane Left",
        x: 100,
        y: 150,
        width: 800,
        height: 780,
        borderRadius: 24,
        opacity: 20,
        fillType: "gradient",
        fillColor: "#ffffff",
        fillGradient: {
          type: "linear",
          angle: 135,
          colors: ["#ffffff", "#f5d0fe"]
        },
        fillImageUrl: null,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#ffffff40",
        shadowColor: "#d946ef",
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
        shadowOpacity: 25,
        isLocked: false,
        visible: true,
        overlayType: "custom-text",
        overlayText: "GLASS CONTAINER Alpha",
        overlayTextColor: "#f5d0fe",
        overlayFontSize: 20
      },
      {
        id: "glass-2",
        name: "Neon Glass Pane Right",
        x: 960,
        y: 150,
        width: 860,
        height: 780,
        borderRadius: 24,
        opacity: 20,
        fillType: "gradient",
        fillColor: "#ffffff",
        fillGradient: {
          type: "linear",
          angle: 315,
          colors: ["#ffffff", "#a5f3fc"]
        },
        fillImageUrl: null,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#ffffff40",
        shadowColor: "#06b6d4",
        shadowBlur: 30,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
        shadowOpacity: 25,
        isLocked: false,
        visible: true,
        overlayType: "time-date",
        overlayText: "",
        overlayTextColor: "#a5f3fc",
        overlayFontSize: 24
      }
    ]
  },
  {
    id: "zen-studio",
    name: "Zen Sanctuary",
    description: "An elegant warm-palette design featuring isolated card overlays for quiet, focused writing and minimal visual distraction.",
    category: "clean",
    background: {
      fillType: "gradient",
      solidColor: "#1c1917",
      gradient: {
        type: "linear",
        angle: 45,
        colors: ["#1c1917", "#0c0a09"]
      },
      imageUrl: null,
      imageBlur: 10,
      imageOpacity: 100,
      imageScale: 100
    },
    sections: [
      {
        id: "zen-center",
        name: "Main Sanctuary Box",
        x: 480,
        y: 240,
        width: 960,
        height: 600,
        borderRadius: 48,
        opacity: 85,
        fillType: "solid",
        fillColor: "#1c1917",
        fillGradient: {
          type: "linear",
          angle: 45,
          colors: ["#e2e8f0", "#ffffff"]
        },
        fillImageUrl: null,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#292524",
        shadowColor: "#000000",
        shadowBlur: 50,
        shadowOffsetX: 0,
        shadowOffsetY: 20,
        shadowOpacity: 50,
        isLocked: false,
        visible: true,
        overlayType: "quote",
        overlayText: "Simplicity is the ultimate sophistication.",
        overlayTextColor: "#e7e5e4",
        overlayFontSize: 22
      }
    ]
  }
];
