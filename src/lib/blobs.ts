/* Parallaxe des blobs : chaque .blob[data-parallaxe] glisse de -amp à +amp
   pendant que sa section traverse l'écran. Desktop seulement (en mobile le
   blob est un lavis centré, sans dérive). GSAP écrit `transform` ; la dérive
   CSS du blob vit sur `translate` (Blob.astro), donc pas de conflit. */
import { DESKTOP_MQ } from './motion';

type GsapModules = {
  gsap: typeof import('gsap').default;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

export function bootBlobs({ gsap, ScrollTrigger }: GsapModules) {
  /* matchMedia : si la fenêtre repasse sous le seuil, GSAP retire ses tweens
     et le blob centré du mobile ne garde aucun transform résiduel */
  gsap.matchMedia().add(DESKTOP_MQ, () => {
    document.querySelectorAll<HTMLElement>('.blob[data-parallaxe]').forEach((blob) => {
      const amp = Number(blob.dataset.parallaxe) || 40;
      const section = blob.parentElement;
      if (!section) return;
      gsap.fromTo(
        blob,
        { y: -amp },
        {
          y: amp,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
        }
      );
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
