"use client";

import { cn } from "../../lib/utils";
import BusinessNavOptions from "./navOptions/BusinessNavOptions";

export function MainNav({ className = '', ...props }) {
  return (
    <nav className={cn("", className)} {...props}>
      <BusinessNavOptions />
    </nav>
  );
}