import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import FrameManager from "./FrameManager";

export interface FramesContext {
  modal: FrameManager;
  footer: FrameManager;
}

export const FramesContext = React.createContext<FramesContext>(null as any);

export const FramesContextProvider: FunctionComponent = (props) => {
  const { pym } = useCoralContext();
  const value = useMemo(
    () => ({
      modal: new FrameManager("modal", pym),
      footer: new FrameManager("footer", pym),
    }),
    [pym]
  );
  return <FramesContext.Provider value={value} {...props} />;
};
