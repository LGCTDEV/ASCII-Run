# Audit complet — Stickman Runner Turbo

## Résumé exécutif
Le cœur du gameplay est solide (rythme, lisibilité globale, feedbacks), mais plusieurs points impactaient encore la constance de la difficulté, l'accessibilité, et la clarté UX. Les 10 axes ci-dessous couvrent jouabilité, UI/UX, bugs, fonctionnalités et typos.

## 10 points à améliorer

1. **Fix combo decay** : le combo ne doit décroître qu'en cas d'inactivité réelle d'actions combo.
2. **Durcir la synchro des boutons UI** : la logique ne doit pas casser si un bouton manque.
3. **Limiter le bruit d'input pointer** : filtrer les pointeurs non primaires.
4. **Prévenir les doubles actions tactiles** : fiabiliser l'enqueue des actions jump/slide.
5. **Expose state pause pour A11y** : utiliser `aria-pressed`.
6. **Uniformiser les libellés de contrôles** : syntaxe cohérente (`:`) pour réduire les ambiguïtés.
7. **Relier canvas + aide des contrôles** : `aria-describedby` pour le contexte d'usage.
8. **Corriger HUD clipping** : ajuster la hauteur du panneau selon les états affichés.
9. **Harmoniser la microcopy FR** : « meilleur score » à la place de « high score ».
10. **Étendre les tests critiques** : combo timing + sync contrôles partiels.

## Priorisation recommandée

- **Haute priorité** : 1, 2, 3, 8, 10.
- **Moyenne priorité** : 4, 5, 6, 7.
- **Finition** : 9.

## KPI à suivre

- Durée moyenne de session.
- Score moyen et P90 score.
- Taux de game over < 10 secondes.
- Taux d'usage de la roulade.
- Taux d'utilisation des boutons mobile.
- Taux de reprise après pause.
