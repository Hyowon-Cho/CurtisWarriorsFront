import React from "react";
import { CSSTransition } from "react-transition-group";
import "../../styles/transitions.css"; // Create this file under "styles" folder

const TransitionWrapper = ({ inProp, children }) => {
  return (
    <CSSTransition in={inProp} timeout={300} classNames="fade">
      {children}
    </CSSTransition>
  );
};

export default TransitionWrapper;