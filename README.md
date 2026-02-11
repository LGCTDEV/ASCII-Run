# Stickman Runner Turbo

Un runner arcade en Canvas 2D, pensé pour être nerveux, lisible et fun.

## Audit complet et plan d'amélioration

Le projet est une base solide, et il a été poussé vers une expérience plus « super fun » avec une boucle de gameplay plus variée.

### 10 points clés à améliorer (et/ou déjà adressés)

1. **Ajouter une roulade/glissade** pour éviter les obstacles aériens sans casser le rythme.
2. **Introduire des obstacles aériens** pour créer plus de décisions instantanées (saut vs roulade).
3. **Améliorer la lisibilité du HUD** (état roulade, combo, bouclier, records).
4. **Rendre les contrôles plus explicites** (clavier + boutons UI cohérents).
5. **Renforcer les feedbacks d’action** (particules + score pops spécifiques).
6. **Mieux récompenser l’esquive maîtrisée** (bonus near miss et bonus roulade).
7. **Préserver le flow mobile** avec boutons dédiés et interactions tactiles simples.
8. **Mieux équilibrer la difficulté** via variété d’obstacles et montée de vitesse maîtrisée.
9. **Corriger/normaliser les microcopies FR** pour éviter les ambiguïtés et typos.
10. **Étendre la couverture de tests** sur les nouvelles mécaniques de mouvement.

## Ce qui a été amélioré

- ✅ Système de **combo** + multiplicateur de score.
- ✅ Bonus **near miss** (passage au ras d’un obstacle).
- ✅ Bonus spécial **esquive roulade** sur obstacle aérien.
- ✅ Mécanique de **roulade** (↓ / S) pour éviter les obstacles aériens.
- ✅ Obstacles variés (short / block / tower / drone aérien).
- ✅ **Power-up bouclier** (absorbe une collision).
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
- `Flèche bas` / `S` : roulade / glissade
- `P` : pause / reprise
- `R` : rejouer (game over)
- Boutons UI : Démarrer, Sauter, Roulade, Pause, Rejouer

## Tests

```bash
npm test
```

## Fichiers clés

- `game.js` : boucle de jeu, scoring, combos, collisions, progression.
- `player.js` : physique du joueur, saut + roulade.
- `obstacle.js` : obstacles, variantes aériennes, power-ups, cooldown de spawn sécurisé.
- `drawing.js` : rendu monde + HUD + overlays.
- `input.js` : clavier + tactile + files d’actions consommables.
- `tests/game-logic.test.mjs` : tests unitaires de logique gameplay.
