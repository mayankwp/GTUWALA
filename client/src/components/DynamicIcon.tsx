import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ iconName, className = "", size = 24 }: DynamicIconProps) {
  // Get the icon component from Lucide Icons
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Fallback to a default icon if the specified icon doesn't exist
  const FallbackIcon = LucideIcons.HelpCircle;
  
  const Icon = IconComponent || FallbackIcon;
  
  return <Icon className={className} size={size} />;
}