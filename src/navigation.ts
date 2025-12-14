import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Soluciones',
      links: [
        { text: 'Restaurantes', href: getPermalink('/#restaurantes') },
        { text: 'Hoteles', href: getPermalink('/#hoteles') },
        { text: 'Retail / POS', href: getPermalink('/#retail') },
      ],
    },
    {
      text: 'Servicios',
      links: [
        { text: 'Desarrollo a medida', href: getPermalink('/#servicios') },
        { text: 'Integraciones', href: getPermalink('/#stack') },
        { text: 'UX / Producto', href: getPermalink('/about') },
      ],
    },
    {
      text: 'Recursos',
      links: [
        { text: 'Casos', href: getPermalink('/#casos') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contacto', href: getPermalink('/contact') },
        { text: 'Planes', href: getPermalink('/pricing') },
      ],
    },
  ],
  actions: [
    { text: 'Agenda demo', href: getPermalink('/contact'), variant: 'primary' },
    { text: 'Ver stack', href: getPermalink('/#stack'), variant: 'secondary' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Soluciones',
      links: [
        { text: 'Restaurantes', href: getPermalink('/#restaurantes') },
        { text: 'Hoteles', href: getPermalink('/#hoteles') },
        { text: 'Retail / POS', href: getPermalink('/#retail') },
        { text: 'Comercio electronico', href: getPermalink('/services') },
      ],
    },
    {
      title: 'Servicios',
      links: [
        { text: 'Desarrollo a medida', href: getPermalink('/#servicios') },
        { text: 'Integraciones', href: getPermalink('/#stack') },
        { text: 'Soporte 24/7', href: getPermalink('/contact') },
        { text: 'Discovery de producto', href: getPermalink('/about') },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { text: 'Casos', href: getPermalink('/#casos') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contacto', href: getPermalink('/contact') },
        { text: 'Estado del servicio', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://twitter.com/llamadevs' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com' },
  ],
  footNote: '(c) 2025 llamadevs. Crafted con Astro + Tailwind CSS.',
};
