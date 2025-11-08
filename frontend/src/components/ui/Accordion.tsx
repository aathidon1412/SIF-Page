import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from '../icons';
import { cn } from '../../lib/utils';

interface AccordionItemProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ trigger, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800/50 last:border-b-0">
      <h3 className="w-full">
        <button
          onClick={onClick}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-slate-800 dark:text-slate-100"
        >
          <span>{trigger}</span>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </h3>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="pb-4 pt-0 text-slate-600 dark:text-slate-400">
            {children}
        </div>
      </div>
    </div>
  );
};


interface AccordionProps {
  items: {
    trigger: string;
    content: string;
  }[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-2">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          trigger={item.trigger}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        >
          <p>{item.content}</p>
        </AccordionItem>
      ))}
    </div>
  );
};
