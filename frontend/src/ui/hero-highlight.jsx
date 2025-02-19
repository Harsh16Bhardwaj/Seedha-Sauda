"use client";
import { cn } from "../lib/utils.jsx";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    (<div
      className={cn(
        "relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group",
        containerClassName
      )}
      onMouseMove={handleMouseMove}>
      <div
        className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800  pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }} />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>)
  );
};

export const Highlight = ({
  children,
  className
}) => {
  return (
    <motion.div
      initial={{
        backgroundSize: "0% 100%",
        backgroundImage: "linear-gradient(to right, #006D6A, #4B9F9C)", // Elegant dark teal gradient
      }}
      animate={{
        backgroundSize: "100% 100%",
        scaleX: [1, 1.02, 1], // Slight scale bounce to make it feel more human
      }}
      transition={{
        duration: 2,  // Slow down a bit for more organic feel
        ease: "easeInOut",  // Smoother transition with a more natural ease
        delay: 2,  // Slight randomness for the delay (can be array)
        repeat: 0,  // No repeat, only runs once
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline-block",
        position: "relative",
        padding:"2px",
        borderRadius:"5px",
      }}
      className={cn(
        `inline-block pb-1 px-1 rounded-lg`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};
