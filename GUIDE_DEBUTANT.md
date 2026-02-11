# Guide débutant — ASCII Run

Ce document sert de point d’entrée pour comprendre rapidement le projet si tu débutes en JavaScript ou en développement de jeux web.

## 1) À quoi sert ce projet ?

`ASCII Run` est un mini jeu de course en **ASCII art** dans le navigateur :
- le personnage avance,
- des obstacles arrivent,
- on saute avec la barre espace,
- le score et le niveau augmentent.

Le rendu se fait dans une balise `<pre>` (texte monospace), pas avec Canvas/WebGL.

---

## 2) Structure générale

Le projet est volontairement simple :

- `asciirun.html` : point d’entrée HTML, charge CSS et scripts.
- `style.css` : styles visuels (couleurs des éléments ASCII, centrage, etc.).
- `constants.js` : constantes de jeu + motifs ASCII (personnage, obstacles, fonds).
- `player.js` : état du joueur + déplacement, saut, reset.
- `obstacle.js` : état/gestion de l’obstacle + collisions.
- `drawing.js` : rendu complet de la scène à chaque frame.
- `input.js` : gestion clavier (saut/restart).
- `game.js` : boucle de jeu (`requestAnimationFrame`) + update global.
- `main.js` : bootstrap (focus, écouteurs clavier, lancement boucle).

⚠️ Important : il n’y a pas de modules ES (`import/export`). Les fichiers partagent des variables globales et **l’ordre des `<script>` dans `asciirun.html` est crucial**.

---

## 3) Flux d’exécution (mental model)

1. Le navigateur charge `asciirun.html`.
2. Les scripts sont chargés dans l’ordre ; ils déclarent constantes, objets et fonctions.
3. `main.js` donne le focus à l’aire de jeu, branche les événements clavier, puis appelle `gameLoop()`.
4. À chaque frame (`requestAnimationFrame`) :
   - update position joueur,
   - update obstacle + score/niveau,
   - test collision,
   - update saut/animation,
   - draw complet.

Tu peux retenir la boucle standard : **Input → Update → Render**.

---

## 4) Les objets d’état à connaître absolument

### `player` (dans `player.js`)
Contient presque tout l’état joueur/partie :
- mouvement : `speed`, `position`, `isJumping`, `jumpHeight`, `jumpStartTime`
- session : `isGameOver`, `canRestart`, `isFirstGame`
- progression : `score`, `level`
- persistance : `topScore`, `topLevel` via `localStorage`
- affichage : `animationState`, `animationCounter`, `backgroundIndex`

### `obstacle` (dans `obstacle.js`)
État de l’obstacle courant :
- `position`
- `speed`
- `patternIndex`
- `isBonus` (bonus `@` au lieu d’un obstacle normal)

### `backgroundPosition`
Variable globale dans `player.js`, utilisée dans `drawing.js` pour faire défiler le fond ASCII.

---

## 5) Les fonctions clés (points de repère)

- `gameLoop()` (`game.js`) : cœur de l’exécution.
- `updateJump()` (`game.js`) : calcule la hauteur de saut selon le temps.
- `updatePlayerPosition()` (`player.js`) : avance le joueur + fond.
- `updateObstaclePosition()` (`obstacle.js`) : avance obstacle + gère score/niveau.
- `checkCollision()` (`obstacle.js`) : détermine collision / bonus.
- `draw()` (`drawing.js`) : reconstruit tout le texte HTML à afficher.
- `handleJump()` / `handleRestart()` (`input.js`) : actions clavier.
- `resetGame()` (`player.js`) : remet l’état à zéro après game over.

Si tu dois poser des breakpoints pour comprendre le jeu, commence par ces fonctions.

---

## 6) Détails importants à connaître (pièges classiques)

1. **Globals partout**
   - Simple pour débuter, mais fragile si on grossit le projet.

2. **Ordre de chargement critique**
   - `main.js` doit venir après les fichiers qu’il appelle.

3. **Rendu complet à chaque frame**
   - `draw()` reconstruit `innerHTML` entier.
   - OK pour un petit jeu, moins scalable à long terme.

4. **localStorage**
   - `topScore`/`topLevel` restent entre sessions navigateur.

5. **Difficulté progressive**
   - vitesse joueur/obstacle augmente avec le score.

6. **Countdowns**
   - startup countdown et game over countdown utilisent `setInterval`.
   - bien penser à nettoyer les timers dans `resetGame()`.

---

## 7) Comment démarrer l’apprentissage (ordre recommandé)

### Étape A — Comprendre sans modifier
- Lis `asciirun.html` puis `main.js`.
- Lis `game.js` pour voir la boucle centrale.
- Lis ensuite `drawing.js` pour comprendre le rendu.

### Étape B — Petites modifs sûres
- Changer une couleur dans `style.css`.
- Changer la gravité (`GRAVITY`) ou la hauteur de saut (`MAX_JUMP_HEIGHT`) dans `constants.js`.
- Changer les motifs ASCII d’obstacles.

### Étape C — Modifs gameplay
- Ajuster l’accélération dans `updateObstaclePosition()`.
- Modifier la logique de collision dans `checkCollision()`.
- Ajouter un nouveau type de bonus (copier le pattern `isBonus`).

### Étape D — Refacto progressive
- Introduire des modules (`type="module"`, `export/import`).
- Séparer `draw()` en sous-fonctions (UI score, terrain, joueur, obstacle).
- Créer un objet `state` unique pour clarifier les dépendances.

---

## 8) Checklist “je me repère bien dans le code”

Tu es prêt pour la suite si tu sais répondre à :
- Où est déclenchée la boucle de jeu ?
- Où le saut est-il calculé ?
- Où score/niveau sont-ils incrémentés ?
- Où est géré le game over ?
- Où le HTML final est-il construit ?

Si tu coches tout ça, tu peux déjà faire des évolutions utiles sans te perdre.
