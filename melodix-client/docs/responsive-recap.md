# Melodix Musique – Récapitulatif des ajustements responsive (Mobile S 320px)

## Pages produit et composants
- **`src/components/ProductCard.jsx`**
  - Badge “TOP VENTES” réduit: `px-1.5 py-0.5 text-[10px] md:text-xs`.
  - Bouton “Ajouter au panier” plus compact: `h-8 md:h-10`, `text-xs md:text-base`.
- **Pages d’articles** (`Guitare.jsx`, `Basse.jsx`, `Batterie.jsx`, `Effet.jsx`, `HomeStudio.jsx`, `PianoClavier.jsx`)
  - Grilles: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`.
  - Espacements: `gap-4 md:gap-6`.

## Accueil / Nouveautés
- **`src/pages/Home.jsx`**
  - Carrousel horizontal “Nouveautés”: scrollbar masquée (`[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`).
  - Gaps/rigidité réduits en mobile, `min-w` carte: `min-w-[200px]` (sm `220px`).
  - `snap-x snap-mandatory` pour l’alignement par carte.

## Panier / Commande
- **`src/pages/Order.jsx`**
  - Compactage mobile: paddings réduits, images `w-16 h-16` (md `20`), textes `text-xs/ text-sm`.
  - Troncature marque/modèle (`truncate`, `min-w-0`).
  - Prix total non coupé (`whitespace-nowrap`), prix unitaire masqué en mobile (`hidden md:block`).
  - Récapitulatif: `p-3 md:p-4`, boutons `h-10 md:h-12`.
  - Barre sticky mobile (total + CTA) ajoutée en bas, avec `pb-20` sur le contenu.

## Footer
- **`src/components/FooterFixed.jsx`**
  - Layout mobile: `flex flex-col items-center text-center` (grille conservée dès `md`).
  - Form newsletter responsive (stack en mobile), champs `w-full`.
  - Logo réduit: `w-24 md:w-32`.

## About + Navigation interne
- **`src/components/HorizontalMenu.jsx`** (réutilisé sur About/Contact/HarmonyStore ...)
  - Responsive: `px-3 py-3` en mobile, items `text-base sm:text-lg md:text-2xl`.
  - `flex-wrap` + `overflow-x-auto` (scrollbar masquée) et centrage.
- **`src/pages/About.jsx`**
  - Menu de navigation adapté (mêmes tailles que ci‑dessus).
  - Titres/paragraphe responsives (`h1`/`h2`/text) et gaps réduits en mobile.
  - Cartes: `gap-4 md:gap-8`, bouton `VOIR PLUS` en `text-sm` mobile.

## Contact
- **`src/pages/Contact.jsx`**
  - Bandeau téléphone: lien `tel:` compact, centré avec `w-max mx-auto`, `text-sm` mobile.
  - Horaires: colonne en mobile, séparateur vertical masqué en mobile.
  - Bloc conseils: titres/texte responsives, `px-3`.
  - Formulaire: carte `p-4` mobile, bouton `h-10 md:h-12`.

## Harmony Store
- **`src/pages/HarmonyStore.jsx`**
  - Hero: `text-3xl sm:text-5xl md:text-8xl`, `px-4 py-8`.
  - Grille images: `grid-cols-1 md:grid-cols-3`, images `h-48 sm:h-56 md:h-72`.
  - Horaires: colonne mobile, séparateur masqué en mobile.

## Connexion / Inscription / Mot de passe oublié
- **`src/pages/connexion/Login.jsx`**
  - Titre `text-2xl md:text-3xl`, carte `p-4`, bouton `h-10 md:h-12`.
  - Liens bleus en `text-sm` (Créer un compte, Mot de passe oublié).
  - Ligne “Se souvenir / lien” wrap en mobile.
- **`src/pages/connexion/Register.jsx`**
  - Titre `text-2xl md:text-3xl`, carte `p-4`, bouton `h-10 md:h-12`.
  - Grille Nom/Prénom: `grid-cols-1 sm:grid-cols-2`.
  - Lien bleu “connectez-vous…” en `text-sm`.
- **`src/pages/connexion/ForgotPassword.jsx`**
  - Titre/texte responsives, carte `p-4`, bouton `h-10 md:h-12`.
  - Lien “connexion” en `text-sm`.

## CSS global
- **`src/index.css`**
  - `overflow-x: hidden` sur `html, body, #root` (déjà présent).
  - Recommandation appliquée ailleurs: masquage cross‑browser des scrollbars locales.

---

## Exporter en PDF
1. Ouvrir ce fichier: `docs/responsive-recap.md`.
2. Via VS Code/IDE: “Exporter en PDF” si extension Markdown PDF installée.
3. Ou ouvrir le Markdown dans un navigateur et imprimer en PDF (Cmd+P) avec marges réduites.
