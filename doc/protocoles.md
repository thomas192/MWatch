# Protocoles

##### Bouton Inscrire cliqué la page Inscription

- Créé un utilisateur dans Firebase
- Créé un document associé à l'utilisateur dans la collection Utilisateur
- Connecte l'utilisateur (état Firebase)

##### Bouton Connecter cliqué dans la page Connexion

- Connecte l'utilisateur (état Firebase)

##### Page profil cliquée dans le menu

- Récupère l'utilisateur connecté (Firebase)

- Récupère le document associé à l'utilisateur connecté dans la collection Utilisateur

##### Bouton Supprimer cliqué dans la page Profil

- Récupère l'utilisateur connecté (Firebase)

- Reconnecte l'utilisateur
- Supprime le document associé à l'utilisateur dans la collection Utilisateur
- Supprime le document associé à l'utilisateur dans la collection GenreAime
- Supprime le document associé à l'utilisateur dans la collection Ami
- Supprime l'utilisateur de Firebase
- Déconnecte l'utilisateur (état Firebase)

##### Bouton Déconnexion cliqué dans la page Profil

- Déconnecte l'utilisateur (état Firebase)

##### Bouton Enregistrer cliqué dans la page Profil

- Récupère l'utilisateur connecté (Firebase)
- Créé ou surcharge le document associé à l'utilisateur dans la collection GenreAime

##### Bouton Mettre à jour cliqué dans la page Profil

- Récupère l'utilisateur connecté (Firebase)
- Reconnecte l'utilisateur

- Met à jour les informations personnelles dans Firebase
- Met à jour le document associé à l'utilisateur dans la collection Utilisateur

##### Bouton Ma liste cliqué dans la page Profil

- Récupère l'utilisateur connecté (Firebase)
- Récupère les documents les présents dans la collection MaListe du document associé à l'utilisateur dans la collection Utilisateur

##### Film cliqué dans la page Ami ou dans la page Ma liste

- Récupère l'utilisateur connecté (Firebase)
- Récupère le film cliqué via une requête API à The Movie Database

- Vérifie si le document associé au film cliqué existe dans la collection MaListe du document associé à l'utilisateur dans la collection Utilisateur

##### Bouton Supprimer de ma liste cliqué dans la page Film

- Récupère l'utilisateur connecté (Firebase)
- Supprime le document associé au film ciblé dans la collection MaListe du document associé à l'utilisateur dans la collection Utilisateur

##### Page Amis cliquée dans le menu

- Récupère l'utilisateur connecté (Firebase)
- Récupère les documents associés à la collection Relation du document associé à l'utilisateur dans la collection Ami

- Récupère le document associé à chaque utilisateur ayant envoyé une demande d'ami dans la collection Utilisateur
- Récupère les documents associés à la collection DemandeRecue du document associé à l'utilisateur dans la collection Ami
- Récupère le document associé à chaque utilisateur ami dans la collection Utilisateur

##### Bouton Ajouter cliqué dans la page Amis

- Récupère l'utilisateur connecté (Firebase)
- Récupère l'éventuel document associé à l'utilisateur ajouté dans la collection Utilisateur
- Récupère l'éventuel document associé à l'utilisateur connecté dans la collection DemandeRecue du document associé à l'utilisateur ajouté dans la collection Ami
- Récupère l'éventuel document associé à l'utilisateur ajouté dans la collection Relation du document associé à l'utilisateur connecté dans la collection Ami
- Ajoute un document associé à l'utilisateur connecté dans  dans la collection DemandeRecue du document associé à l'utilisateur ajouté dans la collection Ami

##### Bouton Accepter cliqué dans la page Amis

- Récupère l'utilisateur connecté (Firebase)
- Supprime le document associé à l'utilisateur ayant envoyé la demande d'ami dans la collection DemandeRecue du document associé à l'utilisateur connecté dans la collection Ami

- Ajoute un document associé à l'utilisateur ayant envoyé la demande d'ami dans la collection Relation du document associé à l'utilisateur connecté dans la collection Ami
- Ajoute un document associé à l'utilisateur connecté dans la collection Relation du document associé à l'utilisateur ayant envoyé la demande d'ami dans la collection Ami

##### Bouton Refuser cliqué dans la page Amis

- Récupère l'utilisateur connecté (Firebase)
- Supprime le document associé à l'utilisateur ayant envoyé la demande d'ami dans la collection DemandeRecue du document associé à l'utilisateur connecté dans la collection Ami

##### Ami cliqué dans la vue Amis

- Récupère l'utilisateur connecté (Firebase)
- Récupère le document associé à l'ami cliqué dans la collection Utilisateur

- Récupère les documents associés aux films non vus et aimés dans la collection FilmSwipe dans le document associé à l'utilisateur connecté dans la collection Utilisateur
- Récupère les documents associés aux films non vus et aimés dans la collection FilmSwipe dans le document associé à l'ami dans la collection Utilisateur

##### Bouton Supprimer des amis cliqué dans la page Ami

- Récupère l'utilisateur connecté (Firebase)
- Supprime le document associé à l'ami dans la collection Relation du document associé à l'utilisateur connecté dans la collection Ami
- Supprime le document associé à l'utilisateur connecté dans la collection Relation du document associé à l'ami dans la collection Ami

##### Page Swipe cliquée dans le menu

- Récupère l'utilisateur connecté (Firebase)
- Récupère le document associé à l'utilisateur connecté dans la collection GenreAime
- Récupère une liste de films via une requête API à The Movie Database

##### Swipe dans la vue Swipe

- Récupère l'utilisateur connecté (Firebase)
- Ajoute un document associé au film swipé dans la collection FilmSwipe du document associé à l'utilisateur connecté dans la collection Utilisateur
- Si le film est ajouté à ma liste
  - Récupère l'utilisateur connecté (Firebase)
  - Ajoute un document associé au film swipé dans la collection MaListe du document associé à l'utilisateur connecté dans la collection Utilisateur
- Récupère l'utilisateur connecté (Firebase)
- Récupère le document associé à l'utilisateur connecté dans la collection GenreAime
- Récupère une liste de films via une requête API à The Movie Database

