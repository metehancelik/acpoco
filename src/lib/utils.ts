import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWarehouseLocation(warehouse: string) {
  switch (warehouse) {
    case "US":
      return "Amerika";
    case "GB":
      return "İngiltere";
    case "DE":
      return "Almanya";
    case "shipEntegra":
      return "ShipEntegra";
    case "seller":
      return "Satıcı(Bana gelsin)";
    default:
      return "Bilinmiyor";
  }
}
