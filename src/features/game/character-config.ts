export type CharacterConfig = {
  bgColor: string;
  textColor: string;
  imageUrl: string;
  description: string;
};

const CONFIG: Record<string, CharacterConfig> = {
  Waldo: {
    bgColor: "#dc2626",
    textColor: "#ffffff",
    imageUrl: "/images/characters/waldo.webp",
    description:
      "The man in the red-and-white striped shirt, red bobble hat, and glasses.",
  },
  Wizard: {
    bgColor: "#2563eb",
    textColor: "#ffffff",
    imageUrl: "/images/characters/wizard.webp",
    description: "An elderly wizard in a blue robe carrying a magical staff.",
  },
  Odlaw: {
    bgColor: "#ca8a04",
    textColor: "#000000",
    imageUrl: "/images/characters/odlaw.webp",
    description:
      "Waldo's nemesis — yellow and black stripes, handlebar mustache.",
  },
  Wenda: {
    bgColor: "#f87171",
    textColor: "#000000",
    imageUrl: "/images/characters/wenda.webp",
    description:
      "Waldo's friend, wearing a red-and-white striped shirt and glasses.",
  },
};

const FALLBACK: CharacterConfig = {
  bgColor: "#4b5563",
  textColor: "#ffffff",
  imageUrl: "",
  description: "",
};

export function getCharacterConfig(name: string): CharacterConfig {
  return CONFIG[name] ?? FALLBACK;
}

/** All known characters in display order. */
export const ALL_CHARACTERS = Object.entries(CONFIG).map(([name, cfg]) => ({
  name,
  ...cfg,
}));
