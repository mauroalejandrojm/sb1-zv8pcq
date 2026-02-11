import React from "react";

const LiquidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-5 overflow-hidden">
      <div className="liquid-bg" />
    </div>
  );
};

export default LiquidBackground;