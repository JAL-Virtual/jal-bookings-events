'use client';

import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownButtonProps {
  text: string;
  buttonId?: string;
  menuId?: string;
  children: React.ReactNode;
}

enum KEY_CODES {
  DOWN = "ArrowDown",
  UP = "ArrowUp",
  ESC = "Escape"
}

const CLOSED_FOCUS_ITEM_IDX = -1;

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  text, 
  children,
  buttonId = "dropdown", 
  menuId = "dropdown-menu"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusItemIdx, setFocusItemIdx] = useState(CLOSED_FOCUS_ITEM_IDX);
  const rootElemRef = useRef<HTMLDivElement | null>(null);
  const childRefs = useRef<Array<HTMLElement>>([]);
  const closeTimeout = useRef<number | null>(null);

  const keyDownListener = useCallback((evt: KeyboardEvent) => {
    switch (evt.key) {
      case KEY_CODES.DOWN:
        setFocusItemIdx((prevState) => {
          if (prevState < childRefs.current.length - 1) {
            return prevState + 1;
          }
          return 0;
        });
        break;

      case KEY_CODES.UP:
        setFocusItemIdx((prevState) => {
          if (prevState > 0) {
            return prevState - 1;
          }
          return childRefs.current.length - 1;
        });
        break;
      case KEY_CODES.ESC:
        setIsOpen(false);
        break;
    }
  }, []);

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusItemIdx(CLOSED_FOCUS_ITEM_IDX);
  };

  useEffect(() => {
    if (!childRefs.current[focusItemIdx]) {
      return;
    }
    childRefs.current[focusItemIdx].focus();
  }, [focusItemIdx]);

  useEffect(() => {
    if (!rootElemRef.current) {
      return;
    }

    const rootElem = rootElemRef.current;
    rootElem.addEventListener("keydown", keyDownListener);

    return () => {
      if (rootElem) {
        rootElem.removeEventListener("keydown", keyDownListener);
      }
    };
  }, [keyDownListener]);

  useEffect(() => {
    if (!isOpen && focusItemIdx !== CLOSED_FOCUS_ITEM_IDX) {
      return;
    }
    setFocusItemIdx(0);
  }, [isOpen, focusItemIdx]);

  return (
    <div
      ref={rootElemRef}
      onFocus={() => closeTimeout.current && clearTimeout(closeTimeout.current)}
      onBlur={() => closeTimeout.current = setTimeout(() => closeDropdown())}
      className="relative"
    >
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup={true}
        className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs leading-4">
            {text}
          </span>
          <span role="presentation">
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </div>
      </button>
      <ul
        id={menuId}
        role="menu"
        className={`${isOpen ? "block" : "hidden"} absolute min-w-full max-w-[15rem] md:max-w-[20rem] max-h-44 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded shadow-lg z-20 border border-gray-200 dark:border-gray-700`}
        aria-labelledby={buttonId}
      >
        {Children.map(children, (child, idx) => {
          if (!child) {
            return null;
          }

          return (
            <li
              role="menuitem"
              className="py-1 px-2 hover:bg-gray-200 hover:dark:bg-gray-700 truncate cursor-pointer"
              ref={(el: HTMLLIElement) => { childRefs.current[idx] = el; }}
              tabIndex={-1}
            >
              {child}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
