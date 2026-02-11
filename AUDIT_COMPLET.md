# Audit complet — ASCII Run

## Résumé exécutif
Le projet est **propre, lisible et modulaire** (séparation input / game loop / rendu), mais plusieurs points limitent la jouabilité long terme, l'accessibilité, et la robustesse sur différents appareils.  
Les 10 recommandations ci-dessous couvrent priorité gameplay, UX/UI, correction de bugs potentiels, améliorations fonctionnelles et typos/microcopy.

---

## 1) Corriger la progression du score (bug gameplay)
- **Constat** : le score est recalculé à chaque frame avec `elapsedSeconds * pointsPerSecond`, puis un bonus de `+5` est ajouté lors du dépassement d'obstacle. Ce bonus est perdu à la frame suivante car le score est réécrasé.
- **Impact** : frustration (le joueur ne comprend pas pourquoi les bonus ne “restent” pas).
- **Action** : séparer `timeScore` et `bonusScore` puis afficher `timeScore + bonusScore`.
- **Priorité** : 🔴 Haute.

## 2) Limiter les obstacles “injustes” (équilibrage difficulté)
- **Constat** : la taille d'obstacle est aléatoire et l'intervalle de spawn diminue avec le niveau, sans garantie de fenêtre de réaction minimale.
- **Impact** : morts “impossibles” à éviter sur certaines combinaisons de vitesse + gros obstacle + spawn rapproché.
- **Action** : implémenter une règle de sécurité basée sur `tempsDeRéactionMin` (ex. 0,9 s) et adapter le cooldown en fonction de la vitesse et de la largeur obstacle.
- **Priorité** : 🔴 Haute.

## 3) Éviter le démarrage involontaire au clic (UX)
- **Constat** : tout `pointerdown` sur le canvas est interprété comme saut, y compris sur l'écran d'accueil et game over.
- **Impact** : redémarrages accidentels, surtout sur mobile/tactile.
- **Action** : introduire des zones interactives explicites (`Start`, `Rejouer`) ou exiger `pointerup` + courte latence anti double-trigger.
- **Priorité** : 🟠 Moyenne.

## 4) Rendre les contrôles accessibles sur mobile (UX/UI)
- **Constat** : aucune UI tactile dédiée (bouton jump visible).
- **Impact** : accessibilité limitée sur petits écrans et ambiguïté des interactions.
- **Action** : ajouter un bouton flottant “Sauter” et un bouton “Pause”, avec feedback visuel/sonore léger.
- **Priorité** : 🟠 Moyenne.

## 5) Ajouter un mode pause + reprise (feature)
- **Constat** : pas de pause (ni clavier, ni UI).
- **Impact** : expérience pénalisante (impossible d'interrompre une partie).
- **Action** : raccourci `P` / bouton pause ; état `paused`; overlay “Partie en pause”.
- **Priorité** : 🟠 Moyenne.

## 6) Fiabiliser le `localStorage` (bug robustesse)
- **Constat** : lecture/écriture du meilleur score sans garde-fous.
- **Impact** : exceptions possibles en mode privé/sandbox stricte ou si la valeur est corrompue (NaN).
- **Action** : encapsuler accès storage dans helpers sécurisés (`getNumberOrDefault`, `safeSetItem`) et validation stricte.
- **Priorité** : 🟠 Moyenne.

## 7) Clarifier la HUD et réduire la charge cognitive (UI)
- **Constat** : HUD affiche score/niveau/meilleur mais sans différenciation visuelle forte ; `bestLevel` est stocké mais jamais affiché.
- **Impact** : information incomplète et lisibilité moyenne en mouvement.
- **Action** : afficher `Meilleur niveau`, hiérarchiser typographie, ajouter icônes/contraste.
- **Priorité** : 🟡 Basse à moyenne.

## 8) Ajouter des feedbacks “juice” (feature/game feel)
- **Constat** : pas d'effets d'impact (flash, particules, shake, son).
- **Impact** : boucle de récompense faible, sensation de jeu “plat”.
- **Action** : micro-effets optionnels (landing dust, hit flash, son jump/hit, animation score).
- **Priorité** : 🟡 Basse à moyenne.

## 9) Corriger/cohérer la microcopy FR/EN et les libellés (typos/UX writing)
- **Constat** : mélange FR/EN (ex. “Game Over”), vocabulaire pas totalement homogène selon les écrans.
- **Impact** : impression moins pro et cohérence de marque réduite.
- **Action** : passer en FR complet (`Partie terminée`, `Rejouer`) ou EN complet ; uniformiser textes HUD/overlay/instructions.
- **Priorité** : 🟡 Basse.

## 10) Ajouter un socle de tests de logique (qualité)
- **Constat** : aucune vérification automatisée visible pour collision, scoring, progression de niveau.
- **Impact** : régressions probables lors d'itérations gameplay.
- **Action** : ajouter tests unitaires JS (Vitest/Jest) sur `intersects`, progression score/niveau, règles de spawn.
- **Priorité** : 🟠 Moyenne.

---

## Roadmap suggérée
1. **Sprint 1 (stabilité/gameplay)** : points 1, 2, 6.  
2. **Sprint 2 (UX essentielle)** : points 3, 4, 5, 7.  
3. **Sprint 3 (finitions)** : points 8, 9, 10.

## KPI recommandés après améliorations
- Taux de mort < 5s après début de run (doit diminuer).
- Durée moyenne de session (doit augmenter).
- Taux de redémarrage immédiat post game over.
- Score moyen et percentile 90 des joueurs.
