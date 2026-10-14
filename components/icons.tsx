import {
  BookOpen, Calendar, Compass, Download, Heart, Home, Lightbulb, Mail, MapPin, Megaphone,
  MessageSquare, MessagesSquare, Microscope, Newspaper, Phone, Rocket, School, Scroll, Shield,
  Sparkles, Sprout, Upload, Users, Clock, Mails, Vote, type LucideIcon,
} from "lucide-react";

// أسماء الأيقونات كما في خطة الهوية البصرية (asset-manifest.json).
export const icons = {
  home: Home,
  school: School,
  principal: MessageSquare,
  vision: Compass,
  constitution: Scroll,
  staff: Users,
  contact: Mail,
  address: MapPin,
  phone: Phone,
  reading: BookOpen,
  news: Newspaper,
  announcements: Megaphone,
  calendar: Calendar,
  newsletter: Mails,
  challenges: Lightbulb,
  participate: Sparkles,
  debate: MessagesSquare,
  vote: Vote,
  kindness: Heart,
  values: Sprout,
  install: Download,
  privacy: Shield,
  publish: Upload,
  grade7: Compass,
  grade8: Microscope,
  grade9: Rocket,
  clock: Clock,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const C = icons[name];
  return <C size={size} strokeWidth={2} aria-hidden="true" />;
}

export function IconBadge({ name, color }: { name: IconName; color?: string }) {
  return (
    <span className="icon-badge" style={color ? { ["--ic" as string]: color } : undefined}>
      <Icon name={name} />
    </span>
  );
}
