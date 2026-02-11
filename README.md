# Stickman Runner Turbo

Un runner arcade Canvas 2D, nerveux et lisible, avec combos, roulade, obstacles aériens et power-ups bouclier.

## Audit complet (10 points d'amélioration)

Voici les **10 axes prioritaires** identifiés pour améliorer la jouabilité, l'UI/UX, la robustesse et la qualité globale.

1. **Corriger la dégradation du combo** : le combo ne doit pas chuter si le joueur continue d'enchaîner les obstacles.
2. **Rendre les contrôles UI robustes** : éviter les dépendances strictes entre boutons (support des bindings partiels).
3. **Mieux gérer les entrées tactiles** : ignorer les événements pointer secondaires et réduire les doubles déclenchements.
4. **Améliorer l'accessibilité de la pause** : exposer l'état via `aria-pressed`.
5. **Clarifier l'aide des contrôles** : uniformiser la microcopy clavier (`:` + symboles explicites).
6. **Améliorer l'accessibilité du canvas** : relier le canvas à l'aide via `aria-describedby`.
7. **Corriger la lisibilité du HUD** : éviter la coupe du texte quand l'indicateur « Roulade active » apparaît.
8. **Harmoniser les overlays FR** : remplacer l'anglicisme « high score » par « meilleur score ».
9. **Renforcer les tests gameplay** : couvrir la logique de decay combo et les états de contrôles.
10. **Formaliser l'audit produit** : garder un document de priorisation et KPI pour guider les prochaines itérations.

> Détail de l'audit et de la priorisation : voir `AUDIT_COMPLET.md`.

## Contrôles

- `Espace` / `Flèche haut` / `W` : sauter
- `Flèche bas` / `S` : roulade / glissade
- `P` : pause / reprise
- `R` : rejouer (game over)
- Boutons UI : Démarrer, Sauter, Roulade, Pause, Rejouer

## Lancer le projet

```bash
# Ouvrir asciirun.html dans un navigateur
```

## Tests

```bash
npm test
```

## Fichiers clés

- `game.js` : boucle de jeu, scoring, combos, collisions, progression.
- `player.js` : physique du joueur, saut + roulade.
- `obstacle.js` : obstacles, variantes aériennes, power-ups, cooldown de spawn sécurisé.
- `drawing.js` : rendu monde + HUD + overlays.
- `input.js` : clavier + tactile + files d'actions consommables.
- `tests/game-logic.test.mjs` : tests unitaires de logique gameplay.
