/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Toolbar from "./components/Toolbar";
import SidebarLeft from "./components/SidebarLeft";
import CanvasArea from "./components/CanvasArea";
import SidebarRight from "./components/SidebarRight";
import ExportDeck from "./components/ExportDeck";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#000000] text-[#E0E0E0] overflow-hidden font-sans select-none">
      {/* Top Toolbar Navigation Header */}
      <Toolbar />

      {/* Main Figma-Like Multi-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Control Center: Templates, Canvas Setup, Layout Layers */}
        <SidebarLeft />

        {/* Central Interactive Design Stage Canvas View */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden">
          <CanvasArea />
          
          {/* Floating High Quality Export Deck */}
          <ExportDeck />
        </div>

        {/* Right Properties Adjuster Inspector Panel */}
        <SidebarRight />
      </div>
    </div>
  );
}
