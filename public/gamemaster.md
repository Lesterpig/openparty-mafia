Aide pour Maître du Jeu
=======================

Cette petite aide a pour objectif d'aider les maîtres du jeu (MDJ) dans leur découverte du moteur **Openparty-Mafia**.

Activation du mode Maître du Jeu
--------------------------------

L'activation se fait avant le lancement de la partie. C'est le créateur de la partie qui doit cocher la case "Mode Maître du Jeu".

Dans ce mode :

- **le créateur de la partie est immortel et dispose de pouvoirs supplémentaires**. Ces pouvoirs sont accessibles via le tchat.
- Avant de commencer la partie, et avant chaque journée, un temps de pause est automatiquement proposé par le système. Il permet au MDJ de finaliser ses opérations.
- Les joueurs peuvent directement parler avec le MDJ, à n'importe quel moment
- Le MDJ peut parler avec chaque joueur, et diffuser des messages dans les différents salons disponibles (village, mafia, cimetière...)

Commandes disponibles
---------------------

Toutes les commandes commencent par le caractère `/`. Après le nom de la commande, il y a éventuellement des paramètres, **indiqués entre chevrons** `< et >`.

Un paramètre est soit :

- Un nombre
- Un mot
- Une phrase : dans ce cas, la phrase doit être placée entre guillemets `"`

**Liste des commandes :** les paramètres faculatifs sont suivis d'une étoile.

```
Gestion de la partie
********************

/autoVictory            : active / désactive la victoire automatique
/help                   : affiche une aide
/kill <p> <phrase*>     : tue le joueur nommé "p". Il sera indiqué :
                          "p (role) <phrase>"
                          par défaut, la phrase est "a été foudroyé"
/role <p> <r> <c*>      : change le rôle du joueur "p" en "r" avec la couleur "c"
                          ATTENTION : cela ne change que le rôle affiché !
                          Couleurs disponibles : "r", "b", "o" (rouge, bleu, orange)
                          Par défaut, la couleur est grise.
/murder <p>             : prépare la mort du joueur "p" (à effectuer pendant la nuit)
/save <p>               : sauve le joueur de la mort (avant l'aube)
                          ne permet pas la "résurrection"
/time <s>               : change la durée de la phase courante
                          si s vaut -1, alors la limite de temps est supprimée
/victory <phrase>       : termine la partie en affichant la phrase en grand

Gestion des sons
****************

/load <url>             : charge le son présent à l'URL indiquée (mp3)
/play <n> <l*> <v*>     : lance la lecture du son nommé <n> (après chargement)
                          si le paramètre <l> vaut "l" (la lettre, pas le chiffre)
                            alors le son est lu en boucle
                          si le paramètre <v> est compris entre 0 et 1
                            alors le volume est configuré selon ce pourcentage
/stop <n>               : stoppe la lecture du son <n>
```

Exemples
--------

Le joueur "truc" va avoir le rôle "Charlatan" avec la couleur bleue.

```
/role truc Charlatan b
```

Le joueur "machin" va avoir le rôle "Criminel Recherché" avec la couleur orange.

```
/role machin "Criminel Recherché" o
```

Le joueur "Du Pont" va être écrasé par une voiture et va rejoindre le cimetière.

```
/kill "Du Pont" "a été écrasé par une voiture. Répugnant."
```

Le son "tictac.mp3" va être préchargé puis lui en boucle à un volume de 20%.

```
/load http://www.supers-sons.fr/tictac.mp3
/play tictac.mp3 l 0.2
```
