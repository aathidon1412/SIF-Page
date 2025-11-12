import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState, useEffect } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  let [isPaused, setIsPaused] = useState(false);

  // Auto-rotate through cards
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setHoveredIndex(prevIndex => {
        if (prevIndex === null) return 0;
        return (prevIndex + 1) % items.length;
      });
    }, 2000); // Change card every 2 seconds

    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => {
            setHoveredIndex(idx);
            setIsPaused(true);
          }}
          onMouseLeave={() => {
            setIsPaused(false);
          }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full rounded-3xl bg-blue-900/30 ring-1 ring-blue-300/30"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-blue-950 border border-blue-200 group-hover:border-blue-300 relative z-20 transition-colors shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "mt-4 font-bold tracking-wide text-white",
        className
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-6 text-sm leading-relaxed tracking-wide text-white",
        className
      )}
    >
      {children}
    </p>
  );
};
