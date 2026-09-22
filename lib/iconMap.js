// lib/iconMap.js
// Maps database icon strings (lowercase, camelCase, PascalCase, kebab-case)
// to Lucide React icon components.

import {
  UtensilsCrossed,
  Plane,
  Cpu,
  Shirt,
  HeartPulse,
  Wrench,
  Sparkles,
  Tag,
  Gift,
  ShoppingBag,
  Building2,
  Stethoscope,
  Activity,
  Car,
  Coffee,
  Film,
  Music,
  BookOpen,
  Compass,
  Smile,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const ICON_REGISTRY = {
  // Restaurants / Food
  utensilscrossed: UtensilsCrossed,
  utensils: UtensilsCrossed,
  restaurant: UtensilsCrossed,
  food: UtensilsCrossed,
  coffee: Coffee,

  // Travel / Tourism
  plane: Plane,
  travel: Plane,
  tourism: Plane,
  compass: Compass,
  car: Car,

  // Electronics / Tech
  cpu: Cpu,
  electronics: Cpu,
  tech: Cpu,
  zap: Zap,

  // Fashion / Shopping
  shirt: Shirt,
  fashion: Shirt,
  shoppingbag: ShoppingBag,
  gift: Gift,
  tag: Tag,

  // Health / Medical
  heartpulse: HeartPulse,
  heart: HeartPulse,
  health: HeartPulse,
  medical: Stethoscope,
  stethoscope: Stethoscope,
  activity: Activity,

  // Services / Maintenance
  wrench: Wrench,
  services: Wrench,
  building: Building2,
  building2: Building2,

  // Entertainment / Misc
  sparkles: Sparkles,
  film: Film,
  music: Music,
  book: BookOpen,
  smile: Smile,
  shield: ShieldCheck,
};

/**
 * Resolve an icon string from database into a Lucide component
 * @param {string|Function} iconName
 * @returns {React.ComponentType}
 */
export function getCategoryIcon(iconName) {
  if (!iconName) return Sparkles;
  if (typeof iconName === 'function') return iconName;

  // Clean string: lowercase, remove dashes and underscores
  const cleanKey = iconName.toString().toLowerCase().replace(/[-_\s]/g, '');

  return ICON_REGISTRY[cleanKey] || Sparkles;
}

export default getCategoryIcon;
