class UtilisateurDAO {
  constructor() {
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
    let retour = "true";
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
    let retour = "true";
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Récupérer le snapshot contenant le document de l'utilisateur ajouté
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
        return exceptionPersonnalisee("utilisateur_inconnu");
      }
      // Vérifier si l'utilisateur ne s'ajoute pas lui-même en ami
      if (utilisateur.email === emailUtilisateurAjoute) {
        console.log("   L'utilisateur s'ajoute lui-même en ami");
        return exceptionPersonnalisee("ajout_de_soi_en_ami");
      }
      // Vérifier si l'utilisateur n'a pas déjà envoyé une demande d'ami à l'utilisateur ajouté
      const demande = await db.collection("Ami").doc(utilisateurAjoute.id)
          .collection("DemandeRecue").doc(utilisateur.uid).get();
      if (demande.exists) {
        console.log("   Demande d'ami déjà envoyée à cet utilisateur");
        return exceptionPersonnalisee("demande_ami_deja_envoyee");
      }
      // Vérifier si l'utilisateur n'est pas déjà ami avec l'utilisateur ajouté
      const relation = await db.collection("Ami").doc(utilisateur.uid)
          .collection("Relation").doc(utilisateurAjoute.id).get();
      if (relation.exists) {
        console.log("   Utilisateur déjà ami avec l'utilisateur ajouté");
        return exceptionPersonnalisee("deja_ami");
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

  /** Retourne un film à swiper pour l'utilisateur (simulé) */
  async obtenirFilmASwiper() {
    // Récupérer l'utilisateur connecté
    const utilisateur = await firebase.auth().currentUser;
    // Liste de films disponibles simulée
    let listeFilm = [{
      titre: "Enola Holmes",
      id: 497582,
      annee: 2020,
      description: "Quand Enola Holmes, la jeune sœur de Sherlock, découvre que sa mère a disparu, elle s'improvise super-détective. Ne tardant pas à faire ses preuves, elle se montre même plus maligne que son illustre grand frère en mettant au jour le dangereux complot qui entoure un mystérieux jeune lord.",
      affiche: "https://image.tmdb.org/t/p/w342/2tfTE30QGr71g8XLUQefRdbbV4N.jpg"
    },
      {
        titre: "Mort Subite 2",
        id: 741067,
        annee: 2020,
        description: "Jesse Freeman est un ancien officier des forces spéciales et expert en explosifs qui travaille maintenant comme agent de sécurité dans une arène de basket-ball à la pointe de la technologie. Des problèmes éclatent lorsqu'un groupe de terroristes kidnappe le propriétaire de l'équipe et la fille de Jesse lors de la soirée d'ouverture.",
        affiche: "https://image.tmdb.org/t/p/w342/9lHBNpAkiFoqKNygC22217hSrqW.jpg"
      },
      {
        titre: "Les chroniques de Noël 2",
        id: 654028,
        annee: 2020,
        description: "Désormais ado et cynique, Kate Pierce fait une nouvelle fois équipe avec le père Noël quand un mystérieux fauteur de troubles menace de supprimer Noël... pour toujours.",
        affiche: "https://image.tmdb.org/t/p/w342/AawUeviXf2hRi9d4K2IxgJUfUO9.jpg"
      },
      {
        titre: "Sacrées sorcières",
        id: 531219,
        annee: 2020,
        description: "Un jeune garçon et sa grand-mère, exilés en Angleterre, doivent lutter contre d'horribles sorcières. Contrairement aux idées reçues, les sorcières ne portent ni balai, ni verrue, ni chapeau pointu. Les démasquer représente donc une vraie difficulté pour le petit garçon, qui va devoir rivaliser d'ingéniosité pour échapper à la perfidie de ces vilaines créatures.",
        affiche: "https://image.tmdb.org/t/p/w342/9wI1x4H86A1Cj2tuRdolZ0F7BPb.jpg"
      }];

    let filmASwiper;
    while (true) {
      filmASwiper = listeFilm[Math.floor(Math.random() * listeFilm.length)];
      // Vérifier si le film à swiper n'a pas déjà été swipé
      const film = await db.collection("Utilisateur").doc(utilisateur.uid)
          .collection("FilmSwipe").doc(filmASwiper.id.toString()).get();
      if (!film.exists) {
        return filmASwiper;
      }
    }
  }

  /** Retourne un film (simulé) */
  obtenirFilm(idFilm) {
    console.log("UtilisateurDAO->obtenirFilm()");
    return {
      titre: "Sacrées sorcières",
      id: 531219,
      annee: 2020,
      description: "Un jeune garçon et sa grand-mère, exilés en Angleterre, doivent lutter contre d'horribles sorcières. Contrairement aux idées reçues, les sorcières ne portent ni balai, ni verrue, ni chapeau pointu. Les démasquer représente donc une vraie difficulté pour le petit garçon, qui va devoir rivaliser d'ingéniosité pour échapper à la perfidie de ces vilaines créatures.",
      affiche: "https://image.tmdb.org/t/p/w342/9wI1x4H86A1Cj2tuRdolZ0F7BPb.jpg"
    };
  }

  /** Simule la liste des genres qui existent */
  listerGenre() {
    console.log("UtilisateurDAO->listerGenre()");
    return [{id: "drame", nom: "Drame"}, {id: "comedie", nom: "Comédie"},
      {id: "thriller", nom: "Thriller"}, {id: "romance", nom: "Romance"},
      {id: "action", nom: "Action"}, {id: "crime", nom: "Crime"},
      {id: "aventure", nom: "Aventure"}, {id: "mystere", nom: "Mystère"}];
  }

}
