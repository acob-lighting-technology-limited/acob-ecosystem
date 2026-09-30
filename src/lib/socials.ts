export type SocialId = "linkedin" | "x" | "facebook" | "instagram" | "tiktok";

export interface Social {
  id: SocialId;
  name: string;
  handle: string;
  href: string;
}

/** Official ACOB accounts. Shared by the footer dock and the Organization JSON-LD. */
export const socials: Social[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "ACOB Lighting Technology",
    href: "https://www.linkedin.com/company/acob-lighting-technology-limited/",
  },
  { id: "x", name: "X", handle: "@acoblimited", href: "https://x.com/acoblimited" },
  {
    id: "facebook",
    name: "Facebook",
    handle: "@acoblightingtechltd",
    href: "https://www.facebook.com/acoblightingtechltd",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@acob_lighting",
    href: "https://www.instagram.com/acob_lighting/",
  },
  { id: "tiktok", name: "TikTok", handle: "@acob_lighting", href: "https://www.tiktok.com/@acob_lighting" },
];
