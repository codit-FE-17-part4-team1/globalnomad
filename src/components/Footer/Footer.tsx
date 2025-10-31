import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    href: 'https://www.facebook.com/codeit.kr/',
    alt: 'Facebook',
    icon: '/icon/mono/facebook.png',
  },
  {
    href: 'https://x.com/CodeitKr/status/1628942846601605120',
    alt: 'Twitter',
    icon: '/icon/mono/twitter.png',
  },
  {
    href: 'https://www.youtube.com/channel/UCCM79CPm2WbBYTRaiNEExbg',
    alt: 'YouTube',
    icon: '/icon/mono/youtube.png',
  },
  {
    href: 'https://www.instagram.com/codeit_kr/',
    alt: 'Instagram',
    icon: '/icon/mono/instagram.png',
  },
];

const footerLinks = [
  { href: 'https://www.codeit.kr/', label: 'Privacy Policy' },
  { href: 'https://www.codeit.kr/', label: 'FAQ' },
];

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`w-full h-[160px] bg-orange-dark text-white mb-[83px] md:mb-0 ${className}`}
    >
      <div className="mx-auto h-full w-full min-w-[375px] max-w-[1240px] pt-8 pb-16 flex flex-col gap-4 px-5">
        {/* 모바일 (<768px): 저작권 + 개인정보처리방침 */}
        <div className="flex justify-between w-full items-center md:hidden">
          <span className="font-normal text-lg leading-none tracking-normal whitespace-nowrap">
            ©codeit-2023
          </span>
          <nav className="flex gap-6 text-lg">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-orange-light transition-colors duration-300 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 모바일 (<768px): SNS */}
        <div className="flex justify-center items-center gap-4 w-full md:hidden">
          {socialLinks.map(({ href, alt, icon }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={alt}
            >
              <Image
                src={icon}
                alt={alt}
                width={20}
                height={20}
                className="hover:bg-orange-light"
              />
            </a>
          ))}
        </div>

        {/* 태블릿+PC (≥768px) */}
        <div className="hidden md:flex justify-between items-center w-full">
          <span className="font-normal text-lg leading-none tracking-normal whitespace-nowrap">
            ©codeit-2023
          </span>
          <nav className="flex gap-6 text-lg">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-orange-light transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4">
            {socialLinks.map(({ href, alt, icon }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={alt}
              >
                <Image
                  src={icon}
                  alt={alt}
                  width={20}
                  height={20}
                  className="hover:opacity-80"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
