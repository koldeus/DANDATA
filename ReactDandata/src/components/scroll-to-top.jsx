import React from "react";
import "./scroll-to-top.css";

const GoTop = (props) => {
  return (
    <>
      <div className={`${props.showGoTop}`} onClick={props.scrollUp}>
        <button className={`goTop  ${props.theme}_Light-Btn`}>Up</button>
      </div>
    </>
  );
};
export default GoTop;
