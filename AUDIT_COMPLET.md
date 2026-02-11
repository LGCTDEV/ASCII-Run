# Audit complet — Stickman Runner Turbo

## Résumé
Le projet est déjà solide techniquement (découpage modules + tests de logique), mais il manquait encore plusieurs leviers pour le rendre “super fun” : variété de gameplay, boucle de récompense plus lisible, meilleure UX tactile et cohérence textuelle.

## 10 points d’amélioration (jouabilité / UI-UX / bugs / typos)

1. **Empêcher les clics involontaires** : distinguer “tap canvas” et “jump” pour éviter les démarrages accidentels.
2. **Boucle combo récompensante** : bonus croissant à chaque obstacle passé + multiplicateur affiché.
3. **Mécanique “near miss”** : bonus quand le joueur passe au ras d’un obstacle.
4. **Power-up bouclier** : un hit absorbé pour éviter les morts frustrantes.
5. **Diversité d’obstacles** : presets short/block/tower pour casser la monotonie.
6. **HUD enrichi** : affichage combo, multiplicateur, boucliers, meilleur niveau.
7. **Feedback visuel dynamique** : score pop coloré, particules, ciel animé.
8. **Responsive / mobile UX** : interactions tactiles conservées + boutons plus réactifs.
9. **Microcopy FR harmonisée** : titre, overlays et légendes uniformisés en français.
10. **Couverture qualité** : tests étendus sur scoring et cooldown de spawn sécurisé.

## Priorisation recommandée
- **Haute** : 1, 2, 4, 5, 10.
- **Moyenne** : 3, 6, 7, 8.
- **Basse** : 9 (mais important pour la finition).

## KPI à suivre
- Durée moyenne de session.
- Score moyen et P90 score.
- Taux de game over < 10 secondes.
- Taux de redémarrage immédiat après game over.
