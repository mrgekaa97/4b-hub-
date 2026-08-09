import iconSet from "../../../../../shared/icons/icon-set.json";

const ICONS: Record<string, string> = iconSet;
const FALLBACK_ICON_KEY = "I_SHIELD";

interface IconProps {
  name: string;
  className?: string;
}

/**
 * Renders an icon from shared/icons/icon-set.json by key (e.g. "I_SHIELD").
 * The markup source is always the fixed, developer-authored icon-set.json —
 * `name` is only ever used as a lookup key into it, never rendered directly,
 * so dangerouslySetInnerHTML here can't be used to inject arbitrary HTML.
 */
export function Icon({ name, className = "card-icon" }: IconProps) {
  const svg = ICONS[name] ?? ICONS[FALLBACK_ICON_KEY] ?? "";

  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
