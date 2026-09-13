# Revue design A — Xénia Van Outryve (impeccable critique, mode Persuade)

Site : `C:\Dev\Noveo\_autres\website\xenia`, serveur `http://127.0.0.1:4331/`. Revue isolée, sans détecteur automatique, en lecture seule. Le brief (aurore pastel, framboise, Fraunces) est validé : on juge l'exécution, pas la direction.

## 1. Verdict de spécificité

Le site est ancré dans ce produit, pas interchangeable. La traversée « Parfois, tout pèse un peu trop » → « La lumière revient, à votre rythme » joue littéralement le concept « L'éclaircie » avant tout argument. Le logo à deux pétales se cite partout sans le dire : puces-pétales des titres, pétales flottants du hero, diagramme « rencontre » à trois pétales de la nutrition, pastille qui respire du footer. La carte du Brabant wallon dessinée à la main, le médaillon aquarelle du cabinet et les huit phrases à la première personne appartiennent à cette psychologue et à personne d'autre.

Trois endroits retombent dans le générique :

- les trois cartes « Holistique / Le corps / Sans jugement » d'Approche, avec le même badge logo miniature dans chaque coin, ce sont des feature cards de SaaS ;
- la rangée de confiance « Agrément · Master · 3 cabinets · RDV en ligne » sous le hero (`src/pages/index.astro:101-106`), c'est le trust row standard ;
- le carrousel à onglets, flèches et bouton pause, c'est un composant de catalogue.

L'occasion manquée la plus lourde : la signature n'existe qu'en desktop. Sur mobile, `src/pages/index.astro:430-442` remplace la traversée par une intro de deux secondes, et le hero devient eyebrow + H1 + copy + CTA + médaillon, c'est-à-dire n'importe quel site de psy bien fait. Pour un public qui consulte sur téléphone, souvent la nuit, le site montre sa version la moins singulière. Le halo qui respire, seconde signature du design system, est quasi imperceptible dans le hero : il vit derrière le médaillon et le voile de l'écran 0 le cache.

## 2. Heuristiques de Nielsen

| # | Heuristique | Note | Constat clé |
|---|---|---|---|
| 1 | Visibilité de l'état du système | 3 | Page active en framboise dans la nav, onglet sélectionné, indice « Faites défiler ». Aucun signal que six liens ouvrent un nouvel onglet (mesure : 6 `target=_blank`, 0 mention « nouvel onglet »). |
| 2 | Adéquation au monde réel | 4 | Le visiteur parle avant le métier : « Je suis épuisé·e, je n'y arrive plus », « ça se soigne, et ce n'est la faute de personne ». Excellent. |
| 3 | Contrôle et liberté | 3 | Scène épinglée sur un écran entier dès l'arrivée, carrousel qui avance seul toutes les 7 s. Compensé : bouton pause, Échap ferme le menu, reduced-motion respecté partout. |
| 4 | Cohérence et standards | 3 | Quatre sémantiques pour une même pilule : page interne, annuaire externe, `mailto:`, volet nutrition en sauge. Le bouton « Prendre rendez-vous » ne prend jamais rendez-vous, il mène à `/lieux-contact/#rdv` (`src/components/Header.astro:32`). |
| 5 | Prévention des erreurs | 3 | Chaque carte de lieu nomme sa plateforme ; le visiteur peut quand même partir sur Doctoranytime pour La Hulpe, la réponse « Doctoranytime ou Rosa ? » est 1 000 px plus bas. |
| 6 | Reconnaissance plutôt que rappel | 3 | Horaires, plateforme et itinéraire sur chaque carte. La ligne « Où » se répète sur les 4 accompagnements. Rien ne dit quel cabinet convient à quel motif, mais c'est le métier qui le veut. |
| 7 | Flexibilité et efficacité | 3 | CTA collant dans la nav desktop, `tel:` dans le menu mobile, capsules qui pointent des ancres (`#tdah`). Pas de raccourci vers l'annuaire depuis la nav. |
| 8 | Esthétique et minimalisme | 3 | Système de jetons impeccable, mais trois énumérations consécutives des mêmes motifs et un accueil à 8 230 px, au-dessus de la cible ≤ 6 800 posée dans `PROJET.md` (Problèmes connus). |
| 9 | Reconnaître et réparer les erreurs | 2 | « Demander une visio » est un `mailto:` sans adresse visible à côté (`src/pages/lieux-contact.astro:85`) : sans client mail configuré, rien ne se passe. La 404 est soignée, avec CTA. |
| 10 | Aide et documentation | 3 | FAQ « Côté pratique » bien placée et bien écrite, mais « Comment payer ? » répond sans montrer de prix et rien ne dit ce qui se passe après le clic vers l'annuaire. |

Total : **29 / 40 = 72 %**, bande **Bon**, tout juste au-dessus du seuil des 70 %. Les heuristiques 7 et 10 sont notées, pas n/a : le site a des accélérateurs et une FAQ, ils s'évaluent.

## 3. Charge cognitive

**3 échecs sur 8.**

- Chunking ≤ 4 : échec. 8 phrases « Ce qui vous amène », 10 capsules du bandeau, 6 questions de FAQ, 6 domaines sur Périnatalité, 7 liens dans « Le site » du footer.
- Une chose à la fois : échec. Bandeau qui défile (60 s en boucle), carrousel qui avance seul (7 s), halo qui respire, blobs en parallaxe, mots de la tagline qui s'allument : tout bouge en même temps sur l'accueil.
- ≤ 4 options par point de décision : échec, voir la liste ci-dessous.
- Focus unique : passe. L'écran 0 ne montre qu'une phrase ; le hero final a une pilule et un lien.
- Regroupement : passe. Les teintes rose / lilas / eau / pêche suivent les pages de destination, sans légende mais lisibles.
- Hiérarchie : passe. Overline → H2 → copy → cartes, partout le même rythme ; H1 → H2 → H3 corrects sur l'accueil (mesure).
- Mémoire de travail : passe. Les cartes de lieux portent horaires, plateforme et itinéraire ; rien à retenir d'une page à l'autre.
- Divulgation progressive : passe. Accueil → page d'accompagnement → FAQ → annuaire.

**Points de décision à plus de 4 options :**

- nav desktop : 5 entrées + CTA (6) ;
- bandeau : 10 capsules (20 dans le DOM, `src/data/themes.ts`) ;
- « Ce qui vous amène » : 8 cartes (`src/pages/index.astro:16-25`) ;
- carrousel : 4 onglets + 2 flèches + pause = 7 commandes pour 4 contenus (`src/components/Carrousel.astro`) ;
- page Lieux, bloc `#rdv` : 3 cartes × 2 actions + « Demander une visio » = 7 ;
- FAQ : 6 questions ;
- menu mobile : 7 liens + pilule + téléphone = 9.

## 4. Parcours émotionnel

**Pics.** La traversée desktop (voile → lumière). La reconnaissance dans les phrases à la première personne. La page Périnatalité (« Aimer ses enfants et ne plus supporter son quotidien de parent : les deux coexistent », `src/pages/accompagnements/perinatalite-parentalite.astro:25`). Le closing « Le plus difficile, c'est souvent de prendre le premier rendez-vous » (`src/components/Closing.astro:13`).

**Creux.**

- « Portrait à venir » au moment exact où l'on cherche un visage (`src/components/Portrait.astro:13-16`), sur l'accueil et sur À propos : un placeholder dans le bloc de confiance.
- Le hero de Lieux, administratif (« Choisissez le lieu et le jour qui vous arrangent », `src/pages/lieux-contact.astro:68-70`), sur la page où l'on a le plus peur.
- Le saut hors du site sans passerelle : le bouton part vers Doctoranytime ou Rosa, nouvel onglet, sans un mot de réassurance à côté.
- « Comment payer ? Le paiement mobile est accepté en cabinet. » : une réponse qui ne répond pas à la question que se pose le visiteur (combien).

**Fin.** Les pages Accueil, Approche, À propos et Périnatalité finissent sur le closing, bonne règle du pic-fin. La page de conversion, elle, se termine sur « Officiel : Agrément / TVA » (`src/pages/lieux-contact.astro:165-168`) : la dernière chose vue avant de partir est un numéro de TVA. Le closing est absent de la seule page où il aurait le plus de sens.

## 5. Forces

- **La copy fait le travail thérapeutique.** `src/pages/index.astro:16-25` et `src/pages/accompagnements/perinatalite-parentalite.astro:10-35` écrivent dans les mots du patient, jamais dans ceux du DSM. C'est ce qui rend le site crédible avant toute preuve d'agrément.
- **Un langage visuel qui se cite lui-même.** Deux pétales → puce de titre → pétales du hero → diagramme nutrition → pastille du footer, plus la carte dessinée du Brabant wallon (`src/components/CarteCabinets.astro`). L'identité est un système, pas un logo posé en haut à gauche.
- **La couche d'animation dégrade proprement.** Reduced-motion partout, site complet sans JS, garde-fou 3 s du voile (`src/pages/index.astro:33-40`), bandeau replié en liste statique au clavier (`src/components/Bandeau.astro`, `:focus-within`), onglets ARIA, `aria-label` sur le H1 splitté (`src/pages/index.astro:301`). Une animation lourde qui ne casse rien, c'est rare.

## 6. Problèmes prioritaires

### [P1] L'écran 0 desktop ne dit pas ce qu'est le site
- **Pourquoi ça compte.** Un visiteur venu de Google voit « Parfois, tout pèse un peu trop. », « Faites défiler » et un nom dans la nav. Le mot « psychologue » n'apparaît qu'après ~600 px de scroll : l'eyebrow `hero__eyebrow` (`src/pages/index.astro:88`) ne monte qu'à 60 % de la scène (`src/pages/index.astro:419`). Sur une surface Persuade, les trois premières secondes ne posent ni le qui, ni le quoi, ni le où.
- **Correctif.** Garder la phrase et poser dessous, en petites capitales framboise, « Psychologue clinicienne · Brabant wallon », visible dès la phase 1 et fondue avec elle. La traversée porte alors l'identité au lieu de la retarder.
- **Commande.** `clarify`.

### [P1] Le CTA principal disparaît sur mobile
- **Pourquoi ça compte.** `src/components/Header.astro:244` masque `.nav__cta` sous 960 px. Il reste : la pilule du hero, qui n'apparaît qu'à 1,45 s (`src/pages/index.astro:441`), la pilule du menu derrière le burger, et le closing 9 000 px plus bas (accueil mobile : 9 722 px). L'action unique du site est invisible sur l'écran d'un téléphone.
- **Correctif.** Pilule compacte « RDV » dans la capsule mobile à côté du burger, ou barre basse collante « Prendre rendez-vous » qui apparaît après le hero.
- **Commande.** `layout`.

### [P1] La sortie vers l'annuaire n'est ni annoncée ni rassurante
- **Pourquoi ça compte.** `src/components/LieuxCards.astro:22` ouvre Doctoranytime ou Rosa dans un nouvel onglet sans glyphe ni mention. La réassurance « les deux montrent mes disponibilités en direct » vit dans la FAQ (`src/pages/lieux-contact.astro:127-132`), hors de vue au moment du clic. Le moment à enjeu maximal du parcours est le moins accompagné.
- **Correctif.** Une ligne sous les trois cartes, juste au-dessus des boutons : « La prise de rendez-vous se fait sur Doctoranytime ou Rosa, dans un nouvel onglet. Disponibilités en direct, sans prescription. » Plus un glyphe de lien externe dans le bouton et un `aria-label` qui le dit.
- **Commande.** `harden`.

### [P2] Le `mailto:` « Demander une visio » est un cul-de-sac
- **Pourquoi ça compte.** `src/pages/lieux-contact.astro:85`. Sur un desktop sans client mail configuré, cas fréquent, le clic ne produit rien de visible et l'adresse n'est pas affichée dans la carte. Le visiteur croit que le site est cassé.
- **Correctif.** Écrire l'adresse e-mail et le téléphone en clair dans la carte visio, garder le `mailto:` en commodité sur l'adresse elle-même.
- **Commande.** `harden`.

### [P2] Trois listes des mêmes motifs à la suite, et deux mouvements que le tactile ne peut pas arrêter
- **Pourquoi ça compte.** 10 capsules → 8 phrases → 4 onglets, chacune animée, c'est trois fois la même information en 3 000 px. Le carrousel avance seul toutes les 7 s (`src/components/Carrousel.astro:129-133`) pendant qu'on lit. Le bandeau ne se met en pause qu'au survol (`src/components/Bandeau.astro`, `.bandeau:hover`), donc jamais au doigt : viser une capsule qui bouge sur téléphone est un problème de Fitts.
- **Correctif.** Retirer le bandeau ou le replier en liste statique sur `(hover: none)` comme il l'est déjà en reduced-motion ; supprimer l'auto-avance du carrousel et garder onglets + flèches ; ramener les phrases à 6 si le bandeau reste.
- **Commande.** `distill`, puis `quieter`.

### [P3] Placeholder et gabarits répétés
- **Pourquoi ça compte.** « Portrait à venir » (`src/components/Portrait.astro:13-16`) est attendu de la cliente, mais tant qu'il est là, il occupe la moitié du bloc « Qui je suis ». Les grilles de trois cartes centrées (« Repères », « Me contacter », cartes d'Approche) se ressemblent trop d'une page à l'autre.
- **Correctif.** En attendant la photo, replier la colonne portrait ou y mettre l'aquarelle du cabinet ; différencier les trois grilles (une en liste, une en carte unique large).
- **Commande.** `polish`.

## 7. Drapeaux rouges par persona

**Jordan, première visite.**
- Écran 0 desktop sans identité : ne sait pas qu'il est chez une psychologue avant 600 px.
- « Prendre rendez-vous » dans la nav mène à une page où il faut encore choisir un cabinet, puis une plateforme : un bouton d'une étape qui en cache trois.
- Le portrait placeholder dans « Qui je suis », juste après avoir été touché par les phrases.

**Riley, testeur méthodique.**
- Six liens externes sans convention visuelle ni textuelle.
- « Comment payer ? » sans montant ; les tarifs n'existent nulle part sur le site.
- Quatre sémantiques de pilule (interne, externe, `mailto:`, sauge).
- « Nutrition & Santé » présent dans la nav, le bandeau, les phrases et le carrousel : quatre entrées pour une page.
- Le tag de carte `.amene__tag` (12,8 px, framboise) tombe à 4,50 sur le haut du dégradé rose, juste à la limite AA ; il est en bas de carte sur le blanc en pratique, mais la marge est nulle.

**Casey, mobile distrait.**
- Pas de CTA dans l'en-tête mobile.
- Accueil à 9 722 px, avec vidéo qui joue en boucle dans le hero.
- Capsules qui défilent sans possibilité de pause au doigt.
- Menu à 9 entrées en Fraunces, lisible mais long ; le téléphone est tout en bas.
- Le CTA du hero n'est visible qu'après 1,45 s d'intro : un tap immédiat tombe sur un bouton à opacité 0.

**Nour, jeune mère en post-partum, 3 h du matin, sur téléphone. Persona dérivée du contenu des pages Périnatalité et « Ce qui vous amène ».**
- Elle lit exactement ce qu'il lui faut sur la page Périnatalité, puis bute sur les horaires : aucun créneau du soir dans `src/data/site.ts` (lundi matin, vendredi après-midi, mardi, jeudi, vendredi matin).
- La visio, seule option compatible avec un nourrisson, n'est réservable que par e-mail, et aucune promesse de délai de réponse n'existe sur le site.
- Rien ne lui dit qu'il faudra créer un compte Doctoranytime ou Rosa à l'étape suivante.
- Le closing lui dit « pas besoin d'attendre que ça aille vraiment mal », mais à cette heure-là, il lui faut « je vous réponds sous 48 h » ou « un appel de 10 minutes pour choisir ensemble ». Ni l'un ni l'autre n'est écrit.

## 8. Observations mineures

- « Un cadre clair et officiel » (À propos) et « Me contacter » (Lieux) sont deux grilles de trois cartes centrées de même gabarit que « Repères » : les bas de page se confondent.
- Les phrases de la scène épinglée sont `aria-hidden` (`src/pages/index.astro:77`), cohérent ; mais le hero mobile n'a plus d'indice de défilement, rien n'annonce le médaillon sous le pli.
- « 3 cabinets + visio » et « RDV en ligne » dans la rangée de confiance répètent le copy juste au-dessus.
- Corps de texte secondaire entre 12,8 et 14,7 px sur capsules, tags, adresses et pied de page (mesure).
- Le closing manque sur la page Lieux.
- La page Approche perd sa signature après les trois cartes : le blob rose seul sur 700 px avant « Pour qui ».
- La chip « Nutrition & santé » emprunte la teinte eau (`.chip--sage` sur `--tint-aqua`, `src/styles/global.css:221`) alors que le volet a sa propre couleur sauge : la seule capsule dont la teinte ne dit pas sa page.

## 9. Questions provocantes

1. Si la majorité des visites vient de téléphones, la traversée est-elle la signature du site ou celle de la démonstration au client ?
2. Deux cabinets sur trois passent par le même profil Doctoranytime : pourquoi « Prendre rendez-vous » n'ouvre-t-il pas directement l'annuaire, avec La Hulpe en exception nommée ?
3. Capsules, phrases, onglets : laquelle des trois listes le visiteur lit-il vraiment, et que perd-on à supprimer les deux autres ?

## 10. Preuves

Dossier : `C:\Users\debes\AppData\Local\Temp\claude\C--Dev-Noveo--autres-website\7bac8134-cfb9-4728-96e0-f16cbb14937c\scratchpad\A\`

| Capture | Ce qu'on y voit |
|---|---|
| `home-1440-0.png` | Écran 0 desktop : phrase 1 sur voile, « Faites défiler », aucune mention « psychologue ». |
| `home-1440-s600.png` | Phrase 2 « La lumière revient » sur le film d'aquarelle, pétales, halo. |
| `home-1440-s1200.png` | Hero final : H1 partiellement sous la nav, médaillon, rangée de confiance, bandeau, début de « Ce qui vous amène ». |
| `home-1440-s1800.png` | « Ce qui vous amène », 8 cartes teintées, blob lilas-eau. |
| `home-1440-s3500.png` | « Qui je suis » avec « Portrait à venir », citation, trois repères. |
| `home-1440-s6100.png` | Carte dessinée collante du Brabant wallon et cartes de lieux compactes. |
| `home-1440-full.png` | Accueil entier animé, 8 230 px : pin et reveals non déclenchés par la capture pleine page. |
| `home-1440-full-rm.png` | Accueil entier en reduced-motion, 7 313 px, tout le contenu visible : la référence de composition. |
| `home-1440-dropdown.png` | Menu « Accompagnements » ouvert au clic, 3 entrées, `aria-expanded` vrai. |
| `home-390-full.png` | Accueil mobile, 9 722 px : en-tête sans CTA, hero sans traversée. |
| `home-390-menu.png` | Menu mobile ouvert : 7 liens, pilule, téléphone, note des lieux. |
| `approche-1440-full.png` | Approche : hero avec arrosoir, trois feature cards, « Pour qui », sections à reveal invisibles. |
| `perinat-1440-full.png` | Périnatalité : hero avec mobile de berceau, 6 domaines en cartes lilas. |
| `apropos-1440-full.png` | À propos : placeholder portrait, quatre paragraphes, « Un cadre clair et officiel ». |
| `lieux-1440-full.png` | Lieux animé : hero, trois cartes, sections suivantes à reveal invisibles. |
| `lieux-1440-full-rm.png` | Lieux en reduced-motion, 3 539 px : cartes, visio, FAQ 6 questions, « Me contacter ». |
| `lieux-390-full.png` | Lieux mobile : trois cartes empilées, chaque CTA en bas de carte. |
| `perinat-390-full.png` | Périnatalité mobile : hero, illustration, domaines à reveal invisibles. |

Mesures par `eval` (`mesures.js`, exécuté sur `/` et `/lieux-contact/`) :

| Mesure | Valeur |
|---|---|
| Contraste `--muted` sur ivoire | 4,78 |
| Contraste `--muted-hero` sur ivoire | 5,71 |
| Contraste framboise sur ivoire | 4,94 |
| Contraste blanc sur framboise | 5,10 |
| Contraste framboise sur teinte rose (haut de carte) | 4,50 |
| Contraste `--petale-rose` sur ivoire (décoratif) | 2,65 |
| Liens `target=_blank` sur l'accueil | 6, aucune mention « nouvel onglet » |
| Pilules / liens-flèches / capsules sur l'accueil | 8 / 12 / 20 |
| Tailles secondaires | chips 13,76 px · tag de carte 12,8 px · rangée de confiance 13,76 px · adresse de lieu 14,4 px · footer 14,72 px |
| Hiérarchie de titres accueil | H1 → 7 H2 → H3, correcte |
| Ancre `#rdv` sur Lieux | section à 565 px, `scroll-padding-top` 96 px |
| Menu mobile | 9 liens, `aria-hidden` bascule à false à l'ouverture |
| Nav desktop | 5 entrées de premier niveau + CTA, dropdown 3 entrées |

Deux captures d'interaction (menu mobile, dropdown) ont été prises avec un script séparé, `shot_action.py`, dans le dossier de sortie. Aucun fichier du projet n'a été modifié, aucun build ni git lancé, le serveur n'a pas été touché.
