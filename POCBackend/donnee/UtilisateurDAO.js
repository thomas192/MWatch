class UtilisateurDAO {
  constructor() {
  }

  async inscrire(pseudo, email, motDePasse) {
    console.log("UtilisateurDAO->inscrire()");
    var retour = "true";
    // Créer l'utilisateur
    await firebase.auth().createUserWithEmailAndPassword(email, motDePasse)
    .then(async function() {
      console.log("   Utilisateur créé")
      // Récupérer l'utilisateur connecté
      var utilisateur = await firebase.auth().currentUser
      // Ajouter le pseudo
      await utilisateur.updateProfile({ displayName: pseudo })
      console.log("   Pseudo ajouté")
      // Ajouter l'utilisateur dans firestore
      await db.collection('Utilisateur').doc(utilisateur.uid)
      .set({
        idUtilisateur: firebase.auth().currentUser.uid,
        pseudo: pseudo,
        email: email
      })
      console.log("   Utilisateur ajouté dans Firestore");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    return retour;
  }

  async connecter(email, motDePasse) {
    console.log("UtilisateurDAO->connecter()");
    var retour = "true";
    // Requête
    await firebase.auth().signInWithEmailAndPassword(email, motDePasse)
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    return retour;
  }

  async mettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
    motDePasseActuel, nouveauMotDePasse) {
    console.log("UtilisateurDAO->mettreAJourPseudoEtEmail()");
    var retour = "true";
    // Initialiser les références
    var utilisateur = await firebase.auth().currentUser;
    var snapshotUtilisateur = await db.collection("Utilisateur").where("idUtilisateur",
      "==", utilisateur.uid).get();
    // Initialiser l'objet de reconnexion
    var credential = await firebase.auth.EmailAuthProvider.credential(
      utilisateur.email,
      motDePasseActuel
    );
    // Réauthentifier l'utilisateur
    await utilisateur.reauthenticateWithCredential(credential)
    .then(async function() {
      if(pseudo != utilisateur.displayName) {
        // Mettre à jour le pseudo dans FirebaseAuth
        await utilisateur.updateProfile({displayName: pseudo})
        console.log("   Pseudo mis à jour FirebaseAuth")
        // Mettre à jour le pseudo dans Firestore
        snapshotUtilisateur.forEach(async doc => {
          await db.collection("Utilisateur").doc(doc.id).update({
            pseudo: firebase.auth().currentUser.displayName
          })
        })
        console.log("   Pseudo mis à jour dans Firestore")
      }
      if(email != utilisateur.email) {
        // Mettre à jour l'email dans FirebaseAuth
        await utilisateur.updateEmail(email)
        console.log("   Email mis à jour dans FirebaseAuth")
        // Mettre à jour l'email dans Firestore
        snapshotUtilisateur.forEach(async doc => {
          await db.collection("Utilisateur").doc(doc.id).update({
            email: firebase.auth().currentUser.email,
          })
        })
        console.log("   Email mis à jour dans Firestore")
      }
      if(nouveauMotDePasse != "") {
        // Mettre à jour le mot de passe
        await utilisateur.updatePassword(nouveauMotDePasse)
        console.log("   Mot de passe mis à jour");
      }
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });

    return retour;
  }

  async mettreAJourGenreAime(idUtilisateur, listeGenreAime) {
    console.log("UtilisateurDAO->mettreAJourGenreAime()");
    var retour = "true";
    // Récupérer le document s'il existe
    await db.collection("GenreAime").where("idUtilisateur", "==", idUtilisateur).get()
    .then(async function(snapshot) {
      // Supprimer le document
      snapshot.forEach(async doc => {
        await db.collection("GenreAime").doc(doc.id).delete();
      })
      // Créer le document
      await db.collection("GenreAime").add({ idUtilisateur: idUtilisateur })
      // Récupérer le document
      snapshot = await db.collection("GenreAime").where("idUtilisateur", "==", idUtilisateur).get()
      // Ajouter les genres aimés au document
      snapshot.forEach(async doc => {
        await db.collection("GenreAime").doc(doc.id).update({ listeGenreAime: listeGenreAime })
        console.log("   Genre aimés mis à jours");
      })
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });

    return retour;
  }

  async ajouterAmi(idUtilisateur, emailUtilisateurAjoute) {
    console.log("UtilisateurDAO->ajouterAmi()");
    var retour = "true";
    // Récupérer l'utilisateur connecté
    var utilisateur = await firebase.auth().currentUser;
    // Récupérer le snapshot contenant le document de l'utilisateur ajouté
    await db.collection("Utilisateur").where("email", "==", emailUtilisateurAjoute).get()
    .then(async function(snapshotUtilisateurAjoute) {
      // Récupérer le document de l'utilisateur ajouté
      var utilisateurAjoute;
      snapshotUtilisateurAjoute.forEach(doc => {
        utilisateurAjoute = doc.data();
      })
      // Vérifier si l'utilisateur ajouté existe
      if (utilisateurAjoute == null) {
        console.log("   Utilisateur ajouté inconnu");
        return new exceptionPersonnalisee("utilisateur_inconnu");
      }
      // Vérifier si l'utilisateur ne s'ajoute pas lui-même en ami
      if (utilisateur.email == emailUtilisateurAjoute) {
        console.log("   L'utilisateur s'ajoute lui-même en ami");
        return new exceptionPersonnalisee("ajout_de_soi_en_ami");
      }
      // Vérifier si l'utilisateur n'a pas déjà envoyé une demande d'ami à l'utilisateur ajouté
      var demande = await db.collection("Ami").doc(utilisateurAjoute.idUtilisateur)
        .collection("DemandeRecu").doc(utilisateur.uid).get();
      if (demande.exists) {
        console.log("   Demande d'ami déjà envoyée à cet utilisateur");
        return new exceptionPersonnalisee("demande_ami_deja_envoyee");
      }
      // Vérifier si l'utilisateur n'est pas déjà ami avec l'utilisateur ajouté
      var relation = await db.collection("Ami").doc(utilisateur.uid)
        .collection("Relation").doc(utilisateurAjoute.idUtilisateur).get();
      if (relation.exists) {
        console.log("   Utilisateur déjà ami avec l'utilisateur ajouté");
        return new exceptionPersonnalisee("deja_ami");
      }
      // Enregistrer la demande d'ami
      await db.collection("Ami").doc(utilisateurAjoute.idUtilisateur).collection("DemandeRecu")
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
    var retour = "true";
    // Récupérer l'utilisateur connecté
    var utilisateur = await firebase.auth().currentUser;
    // Supprimer la demande d'ami
    await db.collection("Ami").doc(utilisateur.uid).collection("DemandeRecu")
      .doc(idUtilisateurAccepte).delete()
    .then(async function() {
      console.log("   Demande d'ami supprimée")
      if (reponse == "acceptee") {
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

  /** Retourne une liste d'objet utilisateur */
  async listerDemandeAmi() {
    console.log("UtilisateurDAO->listerDemandeAmi()");
    // Récupérer l'utilisateur connecté
    var utilisateur = await firebase.auth().currentUser;
    // Récupérer la liste des utilisateurs qui ont envoyé une demande d'ami
    var snapshotDemandeRecu = await db.collection("Ami").doc(utilisateur.uid)
      .collection("DemandeRecu").get();
    // Récupérer les id des utilisateurs
    var listeIdUtilisateur = [];
    snapshotDemandeRecu.forEach(doc => {
      listeIdUtilisateur.push(doc.id);
    });
    // Récupérer les objets utilisateur à partir de leur id
    var listeUtilisateur = [];
    for (var index in listeIdUtilisateur) {
      let utilisateur = await db.collection("Utilisateur").doc(listeIdUtilisateur[index]).get();
      listeUtilisateur.push(utilisateur.data());
    }
    return listeUtilisateur;
  }

  /** Retourne une liste d'objet utilisateur */
  async listerAmi() {
    console.log("UtilisateurDAO->listerAmi()");
    // Récupérer l'utilisateur connecté
    var utilisateur = await firebase.auth().currentUser;
    // Récupérer la liste des amis
    var snapshotRelation = await db.collection("Ami").doc(utilisateur.uid)
      .collection("Relation").get();
    // Récupérer les id des utilisateurs
    var listeIdUtilisateur = [];
    snapshotRelation.forEach(doc => {
      listeIdUtilisateur.push(doc.id);
    });
    // Récupérer les objets utilisateur à partir de leur id
    var listeUtilisateur = [];
    for (var index in listeIdUtilisateur) {
      let utilisateur = await db.collection("Utilisateur").doc(listeIdUtilisateur[index]).get();
      listeUtilisateur.push(utilisateur.data());
    }
    return listeUtilisateur;
  }

  async supprimerCompte(idUtilisateur, motDePasse) {
    console.log("UtilisateurDAO->supprimerCompte()");
    var retour = "true";
    // Initialiser les références
    var utilisateur = await firebase.auth().currentUser;
    var snapshotUtilisateur = await db.collection("Utilisateur").where("idUtilisateur",
      "==", idUtilisateur).get();
    var snapshotGenreAime = await db.collection("GenreAime").where("idUtilisateur",
      "==", idUtilisateur).get();
    // Initialiser l'objet de reconnexion
    var credential = await firebase.auth.EmailAuthProvider.credential(
      utilisateur.email,
      motDePasse
    );
    // Réauthentifier l'utilisateur
    await utilisateur.reauthenticateWithCredential(credential)
    .then(async function() {
      // Supprimer les genres aimés par l'utilisateur
      snapshotGenreAime.forEach(async doc => {
        await db.collection("GenreAime").doc(doc.id).delete()
        console.log("   Genres aimés par l'utilisateur supprimés");
      })
      // Supprimer l'utilisateur de Firestore
      snapshotUtilisateur.forEach(async doc => {
        await db.collection("Utilisateur").doc(doc.id).delete()
        console.log("   Utilisateur supprimé de Firestore");
      })
      // Supprimer l'utilisateur de FirebaseAuth
      await utilisateur.delete();
      console.log("   Utilisateur supprimé de FirebaseAuth");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   Code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    return retour;
  }

  async getUtilisateur(idUtilisateur) {
    console.log("UtilisateurDAO->getUtilisateur()");
    var utilisateur = await db.collection("Utilisateur").doc(idUtilisateur).get();
    return utilisateur.data();
  }

  listerGenre() {
    console.log("UtilisateurDAO->listerGenre()");
    let listeGenre = [{id:"drame", nom:"Drame"}, {id:"comedie", nom:"Comédie"},
      {id:"thriller", nom:"Thriller"}, {id:"romance", nom:"Romance"},
      {id:"action", nom:"Action"}, {id:"crime", nom:"Crime"},
      {id:"aventure", nom:"Aventure"}, {id:"mystere", nom:"Mystère"}]
    return listeGenre;
  }
}
