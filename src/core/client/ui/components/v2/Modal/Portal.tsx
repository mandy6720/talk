import { FunctionComponent, useEffect, useState } from "react";
import ReactDOM from "react-dom";

function appendDivNode() {
  const div = document.createElement("div");
  document.body.append(div);
  div.setAttribute("data-portal", "modal");
  return div;
}

/**
 * useDOMNode is a React hook that returns a DOM node
 * to be used as a portal for the modal.
 *
 * @param open whether the modal is open or not.
 */
function useDOMNode(open: boolean) {
  const [modalDOMNode, setModalDOMNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) {
      const node = appendDivNode();
      setModalDOMNode(node);
      return () => {
        node.parentElement!.removeChild(node);
        setModalDOMNode(null);
      };
    }
    return;
  }, [open]);
  return modalDOMNode;
}

const Portal: FunctionComponent = ({ children }) => {
  const modalDOMNode = useDOMNode(Boolean(open));
  if (modalDOMNode) {
    return ReactDOM.createPortal(children, modalDOMNode);
  }
  return null;
};

export default Portal;
