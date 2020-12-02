class UtilisateurDAO {
  constructor() {
  }

  async inscrire(pseudo, email, motDePasse) {
    console.log("UtilisateurDAO->inscrire()");
    var retour = "true";
    // Créer l'utilisateur
    await firebase.auth().createUserWithEmailAndPassword(email, motDePasse)
    .then(function() {
      // Ajouter le pseudo
      console.log("   Utilisateur créé")
      return firebase.auth().currentUser.updateProfile({ displayName: pseudo })
    })
    .then(function() {
      console.log("   Pseudo ajouté")
      // Ajouter l'utilisateur dans firestore
      return db.collection('Utilisateur').add({
        idUtilisateur: firebase.auth().currentUser.uid,
        pseudo: pseudo,
        email: email
      })
    })
    .then(function() {
      console.log("   Utilisateur ajouté dans Firestore");
    })
    // Gestion des erreurs
    .catch(function(objetErreur) {
      console.log("   code d'erreur: " + objetErreur.code)
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
      console.log("   code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });
    return retour;
  }

  async mettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
    motDePasseActuel, nouveauMotDePasse) {
    console.log("UtilisateurDAO->mettreAJourPseudoEtEmail()");
    // On retourne par défaut true s'il n'y a pas d'erreur
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
      console.log("   code d'erreur: " + objetErreur.code)
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
      console.log("   code d'erreur: " + objetErreur.code)
      retour = objetErreur.code
    });

    return retour;
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
