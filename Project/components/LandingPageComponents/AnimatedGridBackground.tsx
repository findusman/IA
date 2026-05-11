"use client";

import React from "react";

const AnimatedGridBackground: React.FC = () => (
  <div className="fixed inset-0 bg-linear-to-br from-black via-purple-950/20 to-black">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
  </div>
);

export default AnimatedGridBackground;
