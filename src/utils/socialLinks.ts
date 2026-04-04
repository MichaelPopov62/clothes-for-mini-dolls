/** Путь к SVG-спрайту с иконками соцсетей */
export const SOCIAL_ICON_SPRITE_PATH = "/assets/icon/symbol-defs.svg";

/** Одна соцсеть: те же URL и символы, что в футере */
export type SocialNetworkLink = {
  href: string;
  /** Подпись в футере и aria-label везде */
  name: string;
  /** id символа в спрайте (фрагмент после #) */
  spriteSymbolId: string;
};

/** Порядок ссылок совпадает с футером */
export const SOCIAL_NETWORK_LINKS: readonly SocialNetworkLink[] = [
  {
    href: "https://www.instagram.com/elizavetavdovinets?igsh=MWF6ZnhwcGQzaHdzeQ==",
    name: "Instagram",
    spriteSymbolId: "icon-instagram",
  },
  {
    href: "https://t.me/+380953451089",
    name: "Telegram",
    spriteSymbolId: "icon-telegram",
  },
  {
    href: "https://www.facebook.com/share/1Dt5RFvcbx",
    name: "Facebook",
    spriteSymbolId: "icon-facebook2",
  },
];

/** Единый href для `<use href="...">` в спрайте */
export function socialIconUseHref(spriteSymbolId: string): string {
  return `${SOCIAL_ICON_SPRITE_PATH}#${spriteSymbolId}`;
}
