import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * Collapsible section for sidebar groups.
 * children are list items (NavLink or NavItem)
 */
export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <span className="truncate">{title}</span>
        {open ? <ChevronDownIcon className="h-4 w-4 text-gray-500" /> : <ChevronRightIcon className="h-4 w-4 text-gray-500" />}
      </button>

      <div className={`mt-2 px-1 transition-max-h overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}
