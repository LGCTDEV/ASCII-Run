# Guide débutant — Stickman Runner

Ce projet est maintenant un runner 2D en **Canvas API** (et non plus un rendu ASCII dans un `<pre>`).

## Stack choisie

- **HTML + CSS + JavaScript ES Modules**
- **Canvas 2D** pour le rendu temps réel
- Architecture découpée par responsabilité : input / logique de jeu / rendu

## Fichiers clés

- `asciirun.html` : shell UI + canvas + chargement du module principal.
- `style.css` : thème visuel et mise en page responsive.
- `constants.js` : dimensions, physique, couleurs et tuning gameplay.
- `player.js` : classe `StickmanPlayer` (mouvement, saut, hitbox).
- `obstacle.js` : génération/gestion des obstacles + collisions AABB.
- `input.js` : contrôles clavier et pointer.
- `drawing.js` : rendu du monde, du stickman, HUD, overlays.
- `game.js` : état global, boucle update, score, niveaux, game over.
- `main.js` : bootstrap de l’application.

## Contrôles

- **Espace**, **Flèche haut** ou **clic** : sauter
- **R** : recommencer après un game over

## Boucle de jeu

1. Lecture des entrées utilisateur.
2. Mise à jour physique (gravité/saut), vitesse et difficulté.
3. Spawn + déplacement des obstacles.
4. Détection de collision.
5. Rendu frame complète dans le canvas.

## Idées d’évolution

- Ajouter des types d’obstacles (aériens, mobiles, etc.).
- Ajouter des bonus temporaires (slow-motion, invincibilité).
- Ajouter un mode mobile avec HUD tactile dédié.
- Ajouter une boucle son et des effets audio.
