import {
  AudioLines,
  Baby,
  BadgeCheck,
  Calendar,
  Ear,
  Flower2,
  HeartHandshake,
  Languages,
  Mail,
  MapPin,
  Mic,
  Moon,
  Phone,
  RotateCcw,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type IconKey =
  | "general-hno"
  | "children"
  | "allergy"
  | "hearing"
  | "vertigo"
  | "snoring"
  | "voice"
  | "stethoscope"
  | "heart-handshake"
  | "languages"
  | "badge-check"
  | "phone"
  | "map-pin"
  | "mail"
  | "calendar"
  | "user"
  | "health";

const iconMap: Record<IconKey, LucideIcon> = {
  "general-hno": Ear,
  children: Baby,
  allergy: Flower2,
  hearing: AudioLines,
  vertigo: RotateCcw,
  snoring: Moon,
  voice: Mic,
  stethoscope: Stethoscope,
  "heart-handshake": HeartHandshake,
  languages: Languages,
  "badge-check": BadgeCheck,
  phone: Phone,
  "map-pin": MapPin,
  mail: Mail,
  calendar: Calendar,
  user: UserRound,
  health: Stethoscope,
};

type ServiceIconProps = {
  name: IconKey;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

export function ServiceIcon({
  name,
  className,
  size = 24,
  strokeWidth = 1.5,
}: ServiceIconProps) {
  const Icon = iconMap[name];
  return (
    <Icon
      className={cn("shrink-0", className)}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
    />
  );
}

export function serviceSlugToIcon(slug: string): IconKey {
  const map: Record<string, IconKey> = {
    "allgemeine-hno": "general-hno",
    "kinder-hno": "children",
    allergologie: "allergy",
    hoertest: "hearing",
    schwindel: "vertigo",
    schnarchen: "snoring",
    stimmstoerungen: "voice",
  };
  return map[slug] ?? "general-hno";
}
