# Projet Mobile

Thomas Saudemont / Yann Roubeau / Samuel Lacasse / Lucas Guffroy / Niruban Thuraisingham

## Résumé du projet

L’application permet à deux amis de trouver un film à regarder ensemble en fonction de leurs goûts. 

### Première connexion à l’application

Lorsque l’utilisateur se connecte à l’application pour la première fois, il définit les genres, les réalisateurs et les acteurs qu'il apprécie. Cela permet d’orienter l'algorithme de l'application vers des films que l'utilisateur est susceptible d'aimer.

### Navigation

#### Page d’accueil

Des films sont proposés à l’utilisateur par l’algorithme. Celui-ci peut alors préciser si il aimerait le regarder ou non, et s’il a déjà vu indiquer si il a aimé le film ou non : 

- Swipe droite : jamais vu et intéressé
- Swipe gauche : jamais vu et non intéressé
- Swipe haut : vu et aimé
- Swipe bas : vu et pas aimé

L’utilisateur peut également ajouter des films à une liste de favoris consultable sur son profil.

#### Page liste d'amis

L’utilisateur peut ajouter un ami. Une fois l’ami ajouté, il peut voir les films par lesquels ils sont tous les deux intéressés.

#### Page profil

Affichage des préférences renseignées lors de la première connexion, possibilité de les changer. Historique des derniers films proposés à l’utilisateur. Affichage de la liste des films favoris.

## Technologies utilisées

### Architecture

Modèle MVC + DAO en JavaScript via PhoneGap (Apache Cordova).

### Gesture

Swipe sur la page d’accueil.

### Données

- Utilisation de The Movie Database API (JSON)
- Stockage des données utilisateurs via Firestore

### Librairie

Librairie JavaScript (pas encore choisie)

### Capteur

Accéléromètre : l’utilisateur pourra swiper en agitant son téléphone vers la droite ou la gauche.