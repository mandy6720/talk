import pym from "pym.js";

import { CleanupCallback, Decorator } from "./decorators";
import {
  FrameControl,
  FrameControlConfig,
  FrameControlFactory,
} from "./FrameControl";

export const defaultPymControlFactory: FrameControlFactory = (config) =>
  new PymFrameControl(config);

export default class PymFrameControl implements FrameControl {
  private readonly id: string;
  private readonly url: string;
  private readonly title: string;
  private readonly decorators: ReadonlyArray<Decorator>;

  public rendered = false;

  private parent: pym.Parent | null;
  private cleanups: CleanupCallback[] | null;

  constructor(config: FrameControlConfig) {
    this.id = config.id;
    this.url = config.url;
    this.title = config.title;
    this.decorators = config.decorators;
  }

  public render() {
    if (this.rendered) {
      // The instance has already been removed.
      return;
    }

    const name = `${this.id}_iframe`;
    const modalName = `${name}_modal`;
    const footerName = `${name}_footer`;

    const iframeModal = document.createElement("iframe");
    iframeModal.src = this.url + "&modal=true";
    iframeModal.id = modalName;
    iframeModal.name = modalName;
    (iframeModal as any).allowTransparency = "true";
    iframeModal.style.zIndex = "999999";
    iframeModal.style.position = "fixed";
    iframeModal.style.left = "0px";
    iframeModal.style.top = "0px";
    iframeModal.style.width = "100%";
    iframeModal.style.height = "100%";
    iframeModal.style.visibility = "hidden";
    iframeModal.style.pointerEvents = "none";
    iframeModal.frameBorder = "0";

    document.body.appendChild(iframeModal);

    const iframeFooter = document.createElement("iframe");
    iframeFooter.src = this.url + "&footer=true";
    iframeFooter.id = footerName;
    iframeFooter.name = footerName;
    (iframeFooter as any).allowTransparency = "true";
    iframeFooter.style.position = "fixed";
    iframeFooter.style.zIndex = "999999";
    iframeFooter.style.left = "0px";
    iframeFooter.style.bottom = "0px";
    iframeFooter.style.width = "100%";
    iframeFooter.style.height = "100px";
    iframeFooter.style.pointerEvents = "none";
    iframeFooter.frameBorder = "0";

    document.body.appendChild(iframeFooter);

    // Create the new pym.Parent that when created will create the iFrame.
    const parent = new pym.Parent(this.id, this.url, {
      title: this.title,
      id: name,
      name,
    });

    // Run all the decorators on the parent, and capture any cleanup functions.
    const cleanups = this.decorators
      .map((enhance) => enhance(parent))
      .filter((cb) => !!cb) as CleanupCallback[];

    this.rendered = true;
    this.parent = parent;
    this.cleanups = cleanups;
  }

  public sendMessage(id: string, message = "") {
    if (!this.rendered || !this.parent) {
      throw new Error("not mounted");
    }

    this.parent.sendMessage(id, message);
  }

  public remove() {
    if (!this.rendered || !this.parent || !this.cleanups) {
      throw new Error("not mounted");
    }

    this.cleanups.forEach((cb) => cb());
    this.cleanups = null;

    this.parent.remove();
    this.parent = null;

    this.rendered = false;
  }
}
