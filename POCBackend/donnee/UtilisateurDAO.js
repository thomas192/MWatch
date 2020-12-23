class UtilisateurDAO {
  constructor() {
    // Fonctions prêtées par le controleur
    this.actionRecevoirFilm = null;
    this.actionObtenirFilm = null;
  }

  /** Initialise la fonction actionRecevoirFilm */
  initialiserActionRecevoirFilm(actionRecevoirFilm){
    this.actionRecevoirFilm = actionRecevoirFilm;
  }

  /** Initialise la fonction actionObtenirFilm */
  initialiserActionObtenirFilm(actionObtenirFilm) {
    this.actionObtenirFilm = actionObtenirFilm;
  }

  async ecouterEtatUtilisateur(actionUtilisateurConnecte, actionUtilisateurDeconnecte) {
    // Ecouteur qui met à jour l'interface utilisateur automatiquement à chaque
    // fois que l'utilisateur se connecte ou se déconnecte
    firebase.auth().onAuthStateChanged(function(utilisateur) {
      console.log("Event onAuthStateChanged");
      if(utilisateur != null) {
        console.log("   Utilisateur connecté");
        actionUtilisateurConnecte();
      } else {
        console.log("   Utilisateur non connecté");
        actionUtilisateurDeconnecte();
      }
    });
  }

  async inscrire(pseudo, email, motDePasse) {
    console.log("UtilisateurDAO->inscrire()");
    let retour = "true";
    // Créer l'utilisateur
    await firebase.auth().createUserWithEmailAndPassword(email, motDePasse)
    .then(async function() {
      console.log("   Utilisateur créé");
      // Récupérer l'utilisateur connecté
      let utilisateur = await firebase.auth().currentUser;
      // Ajouter le pseudo
      await utilisateur.updateProfile({ displayName: pseudo });
      console.log("   Pseudo ajouté");
      // Ajouter l'utilisateur dans firestore
      await db.collection('Utilisateur').doc(utilisateur.uid)
      .set({
        id: firebase.auth().currentUser.uid,
        pseudo: pseudo,
        email: email
      });
      console.log("   Utilisateur ajouté dans Firestore");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code);
      retour = objetErreur.code;
    });
    return retour;
  }

  async connecter(email, motDePasse) {
    console.log("UtilisateurDAO->connecter()");
    let retour = "true";
    // Requête
    await firebase.auth().signInWithEmailAndPassword(email, motDePasse)
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code);
      retour = objetErreur.code;
    });
    return retour;
  }

  deconnecter() {
    firebase.auth().signOut();
  }

  async mettreAJourInformationPersonnelle(pseudo, email,
    motDePasseActuel, nouveauMotDePasse) {
    console.log("UtilisateurDAO->mettreAJourPseudoEtEmail()");
    let retour = "miseAJourEffectuee";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    const utilisateurRef = await db.collection("Utilisateur").doc(utilisateur.uid);
    // Initialiser l'objet de reconnexion
    const credential = await firebase.auth.EmailAuthProvider.credential(
        utilisateur.email,
        motDePasseActuel
    );
    // Réauthentifier l'utilisateur
    await utilisateur.reauthenticateWithCredential(credential)
    .then(async function() {
      if (pseudo !== utilisateur.displayName) {
        // Mettre à jour le pseudo dans FirebaseAuth
        await utilisateur.updateProfile({ displayName: pseudo });
        console.log("   Pseudo mis à jour FirebaseAuth");
        // Mettre à jour le pseudo dans Firestore
        utilisateurRef.update({ pseudo: utilisateur.displayName });
        console.log("   Pseudo mis à jour dans Firestore");
      }
      if (email !== utilisateur.email) {
        // Mettre à jour l'email dans FirebaseAuth
        await utilisateur.updateEmail(email);
        console.log("   Email mis à jour dans FirebaseAuth");
        // Mettre à jour l'email dans Firestore
        utilisateurRef.update({ email: utilisateur.email });
        console.log("   Email mis à jour dans Firestore");
      }
      if (nouveauMotDePasse !== "") {
        // Mettre à jour le mot de passe
        await utilisateur.updatePassword(nouveauMotDePasse);
        console.log("   Mot de passe mis à jour");
      }
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log(objetErreur);
      console.log("   Code d'erreur: " + objetErreur.code);
      retour = objetErreur.code;
    });
    return retour;
  }

  async enregistrerListeGenreAime(listeGenreAime) {
    console.log("UtilisateurDAO->enregistrerListeGenreAime()");
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Créer le document
    await db.collection("GenreAime").doc(utilisateur.uid).set({ listeGenreAime: listeGenreAime })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    console.log("   Genres aimés enregistrés");
    return retour;
  }

  async ajouterAmi(emailUtilisateurAjoute) {
    console.log("UtilisateurDAO->ajouterAmi()");
    let retour = "demandeAmiEnvoyee";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer le snapshot contenant le document de l'utilisateur ajouté
    let instanceUtilisateurDAO = this;
    await db.collection("Utilisateur").where("email", "==", emailUtilisateurAjoute).get()
    .then(async function(snapshotUtilisateurAjoute) {
      // Récupérer le document de l'utilisateur ajouté
      let utilisateurAjoute;
      snapshotUtilisateurAjoute.forEach(doc => {
        utilisateurAjoute = doc.data();
      })
      // Vérifier si l'utilisateur ajouté existe
      if (utilisateurAjoute == null) {
        console.log("   Utilisateur ajouté inconnu");
        return instanceUtilisateurDAO.exceptionAmi("utilisateur_inconnu");
      }
      // Vérifier si l'utilisateur ne s'ajoute pas lui-même en ami
      if (utilisateur.email === emailUtilisateurAjoute) {
        console.log("   L'utilisateur s'ajoute lui-même en ami");
        return instanceUtilisateurDAO.exceptionAmi("ajout_de_soi_en_ami");
      }
      // Vérifier si l'utilisateur n'a pas déjà envoyé une demande d'ami à l'utilisateur ajouté
      const demande = await db.collection("Ami").doc(utilisateurAjoute.id)
          .collection("DemandeRecue").doc(utilisateur.uid).get();
      if (demande.exists) {
        console.log("   Demande d'ami déjà envoyée à cet utilisateur");
        return instanceUtilisateurDAO.exceptionAmi("demande_ami_deja_envoyee");
      }
      // Vérifier si l'utilisateur n'est pas déjà ami avec l'utilisateur ajouté
      const relation = await db.collection("Ami").doc(utilisateur.uid)
          .collection("Relation").doc(utilisateurAjoute.id).get();
      if (relation.exists) {
        console.log("   Utilisateur déjà ami avec l'utilisateur ajouté");
        return instanceUtilisateurDAO.exceptionAmi("deja_ami");
      }
      // Enregistrer la demande d'ami
      await db.collection("Ami").doc(utilisateurAjoute.id).collection("DemandeRecue")
        .doc(utilisateur.uid).set({});
      console.log("   Demande d'ami envoyée");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });

    return retour;
  }

  async gererDemandeAmi(idUtilisateurAccepte, reponse) {
    console.log("UtilisateurDAO->gererDemandeAmi()");
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Supprimer la demande d'ami
    await db.collection("Ami").doc(utilisateur.uid).collection("DemandeRecue")
      .doc(idUtilisateurAccepte).delete()
    .then(async function() {
      console.log("   Demande d'ami supprimée")
      if (reponse === "acceptee") {
        // Ajouter la relation d'amitié
        await db.collection("Ami").doc(utilisateur.uid).collection("Relation")
          .doc(idUtilisateurAccepte).set({})
        await db.collection("Ami").doc(idUtilisateurAccepte).collection("Relation")
          .doc(utilisateur.uid).set({});
        console.log("   Relation d'amitié enregistrée")
      }
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    return retour;
  }

  async supprimerAmi(idAmi) {
    console.log("UtilisateurDAO->supprimerAmi()");
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Supprimer la relation d'amitié
    await db.collection("Ami").doc(utilisateur.uid).collection("Relation")
      .doc(idAmi).delete()
    .then(async function() {
      await db.collection("Ami").doc(idAmi).collection("Relation")
        .doc(utilisateur.uid).delete()
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    console.log("   Ami supprimé");
    return retour;
  }

  /** Retourne une liste d'objet utilisateur */
  async listerDemandeAmi() {
    console.log("UtilisateurDAO->listerDemandeAmi()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer la liste des utilisateurs qui ont envoyé une demande d'ami
    const snapshotDemandeRecu = await db.collection("Ami").doc(utilisateur.uid)
        .collection("DemandeRecue").get();
    // Récupérer les id des utilisateurs
    let listeIdUtilisateur = [];
    snapshotDemandeRecu.forEach(doc => {
      listeIdUtilisateur.push(doc.id);
    });
    // Récupérer les objets utilisateur à partir de leur id
    let listeUtilisateur = [];
    for (let i in listeIdUtilisateur) {
      let utilisateur = await db.collection("Utilisateur").doc(listeIdUtilisateur[i]).get();
      listeUtilisateur.push(utilisateur.data());
    }
    return listeUtilisateur;
  }

  /** Retourne une liste d'objet utilisateur */
  async listerAmi() {
    console.log("UtilisateurDAO->listerAmi()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer la liste des amis
    const snapshotRelation = await db.collection("Ami").doc(utilisateur.uid)
        .collection("Relation").get();
    // Récupérer les id des utilisateurs
    let listeIdUtilisateur = [];
    snapshotRelation.forEach(doc => {
      listeIdUtilisateur.push(doc.id);
    });
    // Récupérer les objets utilisateur à partir de leur id
    let listeUtilisateur = [];
    for (let i in listeIdUtilisateur) {
      let utilisateur = await db.collection("Utilisateur").doc(listeIdUtilisateur[i]).get();
      listeUtilisateur.push(utilisateur.data());
    }
    return listeUtilisateur;
  }

  async supprimerCompte(motDePasse) {
    console.log("UtilisateurDAO->supprimerCompte()");
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    const utilisateurRef = await db.collection("Utilisateur").doc(utilisateur.uid);
    const listeGenreAimeRef = await db.collection("GenreAime").doc(utilisateur.uid);
    // Initialiser l'objet de reconnexion
    const credential = await firebase.auth.EmailAuthProvider.credential(
        utilisateur.email,
        motDePasse
    );
    // Réauthentifier l'utilisateur
    await utilisateur.reauthenticateWithCredential(credential)
    .then(async function() {
      // Supprimer la liste des genres aimés par l'utilisateur
      await listeGenreAimeRef.delete();
      // Supprimer l'utilisateur de Firestore
      await utilisateurRef.delete();
      // Récupérer la liste des amis
      var snapshotRelation = await db.collection("Ami").doc(utilisateur.uid)
        .collection("Relation").get();
      // Supprimer les relations d'amitié
      snapshotRelation.forEach(async doc => {
        await db.collection("Ami").doc(doc.id)
          .collection("Relation").doc(utilisateur.uid).delete();
        await db.collection("Ami").doc(utilisateur.uid)
          .collection("Relation").doc(doc.id).delete();
      });
      // Supprimer l'utilisateur de FirebaseAuth
      await utilisateur.delete();
      console.log("   Utilisateur supprimé de FirebaseAuth");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code);
      retour = objetErreur.code;
    });
    return retour;
  }

  async gererSwipe(film, reponse) {
    console.log("UtilisateurDAO->swiperFilm()");
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Enregistrer le swipe
    await db.collection("Utilisateur").doc(utilisateur.uid).collection("FilmSwipe")
        .doc(film.id.toString()).set({id: film.id, titre: film.titre, etat: reponse})
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    console.log("   Swipe enregistré");
    return retour;
  }

  async ajouterAMaListe(film) {
    console.log("UtilisateurDAO->ajouterFilmAMaListe()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    await db.collection("Utilisateur").doc(utilisateur.uid)
        .collection("MaListe").doc(film.id.toString()).set({id: film.id, titre: film.titre});
    console.log("   Film ajouté à Ma liste");
  }

  async supprimerDeMaListe(idFilm) {
    console.log("UtilisateurDAO->ajouterFilmAMaListe()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    await db.collection("Utilisateur").doc(utilisateur.uid)
        .collection("MaListe").doc(idFilm.toString()).delete();
    console.log("   Film supprimé de Ma liste");
  }

  /** Retourne la liste des films ajoutés à Ma liste */
  async obtenirMaListe() {
    console.log("UtilisateurDAO->obtenirMaListe()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer les films ajoutés à ma liste
    const snapshotMaListe = await db.collection("Utilisateur").doc(utilisateur.uid)
        .collection("MaListe").get();
    let maListe = [];
    snapshotMaListe.forEach(doc => {
      maListe.push(doc.data())
    });
    return maListe;
  }

  /** Retourne true si le film fait partie de Ma liste, sinon false */
  async faitPartieDeMaListe(idFilm) {
    console.log("UtilisateurDAO->obtenirMaListe()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer le film
    let film = await db.collection("Utilisateur").doc(utilisateur.uid)
        .collection("MaListe").doc(idFilm.toString()).get();
    return !!film.exists;
  }

  async getUtilisateur(idUtilisateur) {
    console.log("UtilisateurDAO->getUtilisateur()");
    const utilisateur = await db.collection("Utilisateur").doc(idUtilisateur).get();
    return utilisateur.data();
  }

  /** Retourne la liste des films en commun (non vus et aimés) */
  async listerFilmEnCommun (idAmi) {
    console.log("UtilisateurDAO->listerFilmEnCommun()");
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer les films non vus et aimés par l'utilisateur
    let snapshotFilmsUtilisateur = await db.collection("Utilisateur").doc(utilisateur.uid)
        .collection("FilmSwipe").where("etat", "==", "nonVuAime").get();
    // Récupérer les films non vus et aimés par l'ami
    let snapshotFilmsAmi = await db.collection("Utilisateur").doc(idAmi)
        .collection("FilmSwipe").where("etat", "==", "nonVuAime").get();
    // Récupérer les films en commun
    let listeFilmEnCommun = [];
    snapshotFilmsUtilisateur.forEach(filmUtilisateur => {
      snapshotFilmsAmi.forEach(filmAmi => {
        if (filmUtilisateur.id === filmAmi.id) {
          let filmEnCommun = filmUtilisateur.data();
          listeFilmEnCommun.push({id: filmEnCommun.id, titre: filmEnCommun.titre});
        }
      })
    })
    return listeFilmEnCommun;
  }

  async proposerFilmASwiper() {
    console.log("UtilisateurDAO->proposerFilmASwiper()");
    // Récupérer l'id de l'utilisateur connecté
    const idUtilisateur = await firebase.auth().currentUser.uid;
    // Récupérer la liste des genres aimés
    const genreAimeRef = await db.collection("GenreAime").doc(idUtilisateur).get();

    let listeGenreAime = [];
    let listeGenreRequete = [];
    // Si l'utilisateur n'a pas de genres aimés
    if (!genreAimeRef.exists) {
      // Choisir un genre au hasard dans la liste des genres existants
      let listeGenreExistant = this.listerGenre();
      listeGenreRequete.push(listeGenreExistant[Math.floor(Math.random() * Math.floor(listeGenreExistant.length))].id);
      // Si l'utilisateur a bien défini ses genres aimés
    } else {
      listeGenreAime = genreAimeRef.data().listeGenreAime;
      // Determiner le nombre de genres à utiliser pour la requête (5 maximum)
      let nombreGenreRequete = 1 + (Math.floor(Math.random() * Math.floor(listeGenreAime.length - 1)) % 4);
      // Choix au hasard des genres à utiliser pour la requête
      for (let nb = 0; nb < nombreGenreRequete; nb++) {
        // Choisir un genre à utiliser au hasard dans la liste des genres aimés
        listeGenreRequete.push(listeGenreAime[Math.floor(Math.random() * Math.floor(listeGenreAime.length))]);
      }
    }

    let genres = "";
    for (let genre of listeGenreRequete) {
      genres += genre + ",";
    }
    this.choisirFilmASwiper(genres, idUtilisateur, 1);
  }

  choisirFilmASwiper(genres, idUtilisateur, numeroPage) {
    console.log("UtilisateurDAO->choisirFilmASwiper()");
    // Effectuer la requête
    let url = "https://api.themoviedb.org/3/discover/movie?api_key=108344e6b716107e3d41077a5ce57da2&language=fr-FR&include_adult=false&with_genres="+genres+"&page="+numeroPage;
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "json";
    request.send();

    let utilisateurDAO = this;
    let filmASwiper;
    // Recevoir la réponse de la requête
    request.onload = async function() {
      let reponse = request.response;
      // Si aucun film ne correspond aux genres sélectionnés
      if (reponse["results"].length === 0) {
        await utilisateurDAO.proposerFilmASwiper(idUtilisateur);
      } else {
        // Parcourir la liste des films tant qu'on n'a pas trouvé un film non swipé par l'utilisateur
        for (let film of reponse["results"]) {
          const filmPotentiel = await db.collection("Utilisateur").doc(idUtilisateur)
              .collection("FilmSwipe").doc(film["id"].toString()).get();
          if (!filmPotentiel.exists) {
            filmASwiper = {
              titre: film["title"],
              id: film["id"],
              annee: film["release_date"].substring(0, 4),
              description: film["overview"],
              affiche: "https://image.tmdb.org/t/p/w342/" + film["poster_path"]
            }
            break;
          }
        }
        // Si un film non swipé a été trouvé
        if (filmASwiper) {
          utilisateurDAO.actionRecevoirFilm(filmASwiper);
        // Si tous les films ont déjà été swipés
        } else {
          // Parcourir les films de la page suivante
          numeroPage++;
          utilisateurDAO.choisirFilmASwiper(genres, idUtilisateur, numeroPage);
        }
      }
    }
  }

  obtenirFilm(idFilm) {
    console.log("UtilisateurDAO->obtenirFilm()");
    let url = "https://api.themoviedb.org/3/movie/"+idFilm+"?api_key=108344e6b716107e3d41077a5ce57da2&language=fr-FR";
    let utilisateurDAO = this;
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      let f = request.response;
      let film = {
        titre: f["title"],
        id: f["id"],
        annee: f["release_date"].substring(0, 4),
        description: f["overview"],
        affiche: "https://image.tmdb.org/t/p/w342/" + f["poster_path"]
      }
      utilisateurDAO.actionObtenirFilm(film);
    }
  }

  /** Renvoie la liste des genres de film */
  listerGenre() {
    console.log("UtilisateurDAO->listerGenre()");
    return [{id: "28", nom: "Action"}, {id: "12", nom: "Aventure"}, {id: "16", nom: "Animation"},
      {id: "35", nom: "Comédie"}, {id: "80", nom: "Crime"}, {id: "99", nom: "Documentaire"},
      {id: "18", nom: "Drame"}, {id: "10751", nom: "Familial"}, {id: "14", nom: "Fantastique"},
      {id: "36", nom: "Histoire"}, {id: "27", nom: "Horreur"}, {id: "10402", nom: "Musique"},
      {id: "9648", nom: "Mystère"}, {id: "10749", nom: "Romance"}, {id: "878", nom: "Science-Fiction"},
      {id: "10770", nom: "Téléfilm"}, {id: "53", nom: "Thriller"}, {id: "10752", nom: "Guerre"},
      {id: "37", nom: "Western"}];
  }

  // Créé un objet erreur personnalisé
  exceptionAmi(code) {
    console.log("   exceptionAmi()");
    const objetErreur = new Error("Erreur personnalisée");
    objetErreur.code = code;
    throw objetErreur;
  }

}
