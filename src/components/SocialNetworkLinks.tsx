import { SOCIAL_NETWORK_LINKS, socialIconUseHref } from "@/utils";

/** Классы для списка соцсетей (шапка / подвал задают свои CSS Modules) */
export type SocialNetworkLinksClassNames = {
  list: string;
  item: string;
  link: string;
  icon: string;
};

type SocialNetworkLinksProps = {
  classNames: SocialNetworkLinksClassNames;
  /** Подпись для списка (aria-label) */
  ariaLabel?: string;
  /** Показывать текст рядом с иконкой (как в подвале) */
  withLabel?: boolean;
};

/** Ссылки на соцсети из SOCIAL_NETWORK_LINKS + SVG из спрайта */
const SocialNetworkLinks = ({
  classNames,
  ariaLabel = "Соцсети",
  withLabel = false,
}: SocialNetworkLinksProps) => {
  return (
    <ul className={classNames.list} aria-label={ariaLabel}>
      {SOCIAL_NETWORK_LINKS.map((s) => (
        <li key={s.href} className={classNames.item}>
          <a
            href={s.href}
            className={classNames.link}
            aria-label={s.name}
            target="_blank"
            rel="noreferrer"
          >
            <svg className={classNames.icon} aria-hidden="true">
              <use href={socialIconUseHref(s.spriteSymbolId)} />
            </svg>
            {withLabel ? s.name : null}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialNetworkLinks;
