import { useState } from 'react';
import type { ReactNode, FC } from 'react';
import { ChevronDownIcon } from '../icons';
import { cn } from '../../lib/utils';

interface AccordionItemProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: FC<AccordionItemProps> = ({ trigger, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-blue-200/30 last:border-b-0">
      <h3 className="w-full">
        <button
          onClick={onClick}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-white hover:text-yellow-300 transition-colors duration-200"
        >
          <span>{trigger}</span>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-200 text-yellow-300",
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
        <div className="pb-4 pt-0 text-blue-100">
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

export const Accordion: FC<AccordionProps> = ({ items }) => {
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
