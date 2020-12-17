import React, { FunctionComponent, useContext, useMemo } from "react";
import ReactDOM from "react-dom";

import { ErrorBoundary } from "coral-framework/components";
import { useEffectAtUnmount } from "coral-framework/hooks";
import { PropTypesOf } from "coral-framework/types";
import { FramesContext } from "coral-stream/App/frames";
import { Modal } from "coral-ui/components/v2";

type Props = Omit<PropTypesOf<typeof Modal>, "ref" | "PortalElement">;

const Portal: FunctionComponent = ({ children }) => {
  const { modal } = useContext(FramesContext);
  const [targetNode, releaseTargetNode] = useMemo(
    () => modal.acquireRenderTarget(),
    [modal]
  );
  useEffectAtUnmount(() => {
    releaseTargetNode();
  });
  return ReactDOM.createPortal(children, targetNode);
};

const StreamModal: FunctionComponent<Props> = (props) => (
  <ErrorBoundary errorContent={null}>
    <Modal {...props} PortalElement={<Portal />}>
      {props.children}
    </Modal>
  </ErrorBoundary>
);

export default StreamModal;
