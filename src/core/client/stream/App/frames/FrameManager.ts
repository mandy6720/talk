import { Child } from "pym.js";

import { areWeInIframe } from "coral-framework/utils";

import { FramesContext } from "./FramesContext";

type ReleaseRenderTarget = () => void;
export type FrameTarget = keyof FramesContext;

function getFrameWindow(name: string, source = window.parent): Window {
  if (!source) {
    throw new Error(`Parent window not available`);
  }
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < source.frames.length; i++) {
    try {
      if (source.frames[i].name === name) {
        return source.frames[i];
      }
    } catch {
      continue;
    }
  }
  throw new Error(`Frame ${name} not found`);
}

class FrameManager {
  private name: string;
  private target: string;
  private window: Window | null;
  private renderTargetCount: number;
  private pym?: Child;

  constructor(target: FrameTarget, pym?: Child) {
    this.target = target;
    this.name = `${window.name}_${target}`;
    this.window = null;
    this.renderTargetCount = 0;
    this.pym = pym;
  }
  public getWindow(): Window {
    if (!areWeInIframe()) {
      return window;
    }
    if (!this.pym) {
      throw new Error("Pym was not available");
    }
    if (!this.window) {
      this.window = getFrameWindow(this.name);
    }
    return this.window;
  }

  private incRenderTargetCount() {
    if (this.renderTargetCount === 0) {
      this.sendFrameAction("show");
    }
    this.renderTargetCount++;
  }

  private decRenderTargetCount() {
    this.renderTargetCount--;
    if (this.renderTargetCount === 0) {
      this.sendFrameAction("hide");
    }
  }

  private sendFrameAction(action: "show" | "hide") {
    if (!areWeInIframe()) {
      return;
    }
    if (!this.pym) {
      throw new Error("Pym was not available");
    }
    this.pym.sendMessage(
      "frameAction",
      JSON.stringify({
        action,
        target: this.target,
      })
    );
  }

  public acquireRenderTarget(): [HTMLElement, ReleaseRenderTarget] {
    const frameWindow = this.getWindow();
    this.incRenderTargetCount();
    const div = frameWindow.document.createElement("div");
    frameWindow.document.body.appendChild(div);
    return [
      div,
      () => {
        this.decRenderTargetCount();
        div.parentElement!.removeChild(div);
      },
    ];
  }
}

export default FrameManager;
