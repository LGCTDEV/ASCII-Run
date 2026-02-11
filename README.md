# Stickman Runner Turbo

Un runner arcade en Canvas 2D, pensé pour être nerveux, lisible et fun.

## Ce qui a été amélioré

- ✅ Système de **combo** + multiplicateur de score.
- ✅ Bonus **near miss** (passage au ras d’un obstacle).
- ✅ **Power-up bouclier** (absorbe une collision).
- ✅ Obstacles variés (short / block / tower).
- ✅ HUD plus riche : score, niveau, combo, meilleur score, meilleur niveau.
- ✅ Feedback visuel boosté (particules, pop de score, flash hit, shake).
- ✅ UX tactile corrigée : tap canvas mieux géré selon l’état du jeu.
- ✅ Textes FR harmonisés et plus clairs.

## Lancer le projet

```bash
# Ouvrir asciirun.html dans un navigateur
```

## Contrôles

- `Espace` / `Flèche haut` / `W` : sauter
- `P` : pause / reprise
- `R` : rejouer (game over)
- Boutons UI : Démarrer, Sauter, Pause, Rejouer

## Tests

```bash
npm test
```

## Fichiers clés

- `game.js` : boucle de jeu, scoring, combos, collisions, progression.
- `obstacle.js` : obstacles, power-ups, cooldown de spawn sécurisé.
- `drawing.js` : rendu monde + HUD + overlays.
- `input.js` : clavier + tactile + files d’actions consommables.
- `tests/game-logic.test.mjs` : tests unitaires de logique gameplay.
