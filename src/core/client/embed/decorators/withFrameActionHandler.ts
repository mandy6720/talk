import { Decorator } from "./types";

const withFrameActionHandler = (id: string): Decorator => (pym) => {
  // Listen to frame actions.
  pym.onMessage("frameAction", (raw: string) => {
    const { action, target } = JSON.parse(raw);
    const frameID = `${id}_iframe_${target}`;
    switch (action) {
      case "show": {
        const iframe = document.getElementById(frameID);
        if (!iframe) {
          throw new Error(`Iframe ${frameID} not found`);
        }
        iframe.style.visibility = "visible";
        iframe.style.pointerEvents = "auto";
        break;
      }
      case "hide": {
        const iframe = document.getElementById(frameID);
        if (!iframe) {
          throw new Error(`Iframe ${frameID} not found`);
        }
        iframe.style.visibility = "hidden";
        iframe.style.pointerEvents = "none";
        break;
      }
      default:
        throw new Error(`Unknown frame action ${action}`);
    }
  });
};

export default withFrameActionHandler;
