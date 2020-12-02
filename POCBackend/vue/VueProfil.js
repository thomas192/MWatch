class VueProfil {
  constructor() {
    this.html = document.getElementById("html-vue-profil").innerHTML;
    this.listeGenreDonnee = null;
    // Fonction prêtée par le controleur
    this.actionDeconnecter = null;
    // Fonction prêtée par le controleur
    this.actionMettreAJourInformationPersonnelle = null;
    // Fonction prêtée par le controleur
    this.actionMettreAJourGenreAime = null;
    // Fonction prêtée par le controleur
    this.actionSupprimerCompte = null;
  }

  /** Initialise la liste des genres */
  initialiserListeGenre(listeGenreDonnee) {
    this.listeGenreDonnee = listeGenreDonnee;
    }

  /** Initialise la fonction actionMettreAJourInformationPersonnelle */
  initialiserActionMettreAJourInformationPersonnelle(actionMettreAJourInformationPersonnelle) {
    this.actionMettreAJourInformationPersonnelle = actionMettreAJourInformationPersonnelle;
  }

  /** Initialise la fonction actionMettreAJourGenreAime */
  initialiserActionMettreAJourGenreAime(actionMettreAJourGenreAime) {
    this.actionMettreAJourGenreAime = actionMettreAJourGenreAime;
  }

  /** Initialise la fonction actionDeconnecter */
  initialiserActionDeconnecter(actionDeconnecter) {
    this.actionDeconnecter = actionDeconnecter;
  }

  /** Initialise la fonction actionSupprimerCompte */
  initialiserActionSupprimerCompte(actionSupprimerCompte) {
    this.actionSupprimerCompte = actionSupprimerCompte;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueProfil->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;
    document.getElementById("deconnexion").addEventListener("click",
    evenement => this.deconnecter(evenement));

    // Ecouteur du formulaire informations personnelles
    document.getElementById("formulaire-information-personnelle").addEventListener("submit",
    evenement => this.mettreAJourInformationPersonnelle(evenement));

    // Ecouteur du formulaire genres aimés
    document.getElementById("formulaire-genre-aime").addEventListener("submit",
    evenement => this.mettreAJourGenreAime(evenement));

    // Ecouteur du formulaire supprimer compte
    document.getElementById("formulaire-supprimer-compte").addEventListener("submit",
    evenement => this.supprimerCompte(evenement));

    // Affichage dynamique du pseudo
    document.getElementById("pseudo").value = firebase.auth().currentUser.displayName;

    // Affichage dynamique de l'adresse email
    document.getElementById("email").value = firebase.auth().currentUser.email;

    // Affichage dynamique des genres
    let formulaireGenre = document.getElementById("genre");
    const formulaireGenreItemHtml = formulaireGenre.innerHTML;
    let formulaireGenreHtmlRemplacement = "";
    for (var genre in this.listeGenreDonnee) {
      let formulaireGenreItemHtmlRemplacement = formulaireGenreItemHtml;
      // id
      formulaireGenreItemHtmlRemplacement =
        formulaireGenreItemHtmlRemplacement.replace("{id}",
        this.listeGenreDonnee[genre].id)
      // name
      formulaireGenreItemHtmlRemplacement =
        formulaireGenreItemHtmlRemplacement.replace("{name}",
        this.listeGenreDonnee[genre].id)
      // value
      formulaireGenreItemHtmlRemplacement =
        formulaireGenreItemHtmlRemplacement.replace("{value}",
        this.listeGenreDonnee[genre].nom)
      // for
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{for}",
          this.listeGenreDonnee[genre].id)
      // label
      formulaireGenreItemHtmlRemplacement =
        formulaireGenreItemHtmlRemplacement.replace("{label}",
        this.listeGenreDonnee[genre].nom)
     formulaireGenreHtmlRemplacement += formulaireGenreItemHtmlRemplacement;
    }
    formulaireGenre.innerHTML = formulaireGenreHtmlRemplacement;
  }

  /** Récupère les informations personnelles renseignées par l'utilisateur et
    * et les passe au controleur */
  async mettreAJourInformationPersonnelle(evenement) {
    console.log("VueProfil->mettreAJourInformationPersonnelle()");
    evenement.preventDefault();
    // Récupérer l'id de l'utilisateur
    var idUtilisateur = firebase.auth().currentUser.uid;
    // Récupérer les valeurs des champs
    var pseudo = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var motDePasseActuel = document.getElementById("mot-de-passe-actuel").value;
    var nouveauMotDePasse = document.getElementById("nouveau-mot-de-passe").value;
    // Effectuer la mise à jour des informations personnelles
    var resultat = await this.actionMettreAJourInformationPersonnelle(idUtilisateur,
      pseudo, email, motDePasseActuel, nouveauMotDePasse);
    if (resultat != "true") {
      choixAlerte(resultat);
    }
  }

  /** Récupère les genre aimés par l'utilisateur et et les passe
    * au controleur */
  async mettreAJourGenreAime(evenement) {
    console.log("VueProfil->mettreAJourGenreAime()");
    evenement.preventDefault();
    // Récupérer l'id de l'utilisateur
    var idUtilisateur = firebase.auth().currentUser.uid;
    // Récupérer les champs cochés
    var listeGenreAime = []
    for (var index in this.listeGenreDonnee) {
      let checkbox = document.getElementById(this.listeGenreDonnee[index].id);
      if (checkbox.checked) {
            listeGenreAime.push(this.listeGenreDonnee[index].id);
      }
    }
    // Enregistrer les genres aimés
    var resultat = await this.actionMettreAJourGenreAime(idUtilisateur, listeGenreAime);
    if(resultat != "true") {
      choixAlerte(resultat);
    }
  }

  /** Récupère le mot de passe renseigné par l'utilisateur et appelle le
    * controleur */
    async supprimerCompte(evenement) {
      console.log("VueProfil->supprimerCompte()");
      evenement.preventDefault();
      // Récupérer l'id de l'utilisateur
      var idUtilisateur = firebase.auth().currentUser.uid;
      // Récupérer le mot de passe
      var motDePasseActuel = document.getElementById("mot-de-passe").value;
      // Supprimer l'utilisateur
      var resultat = await this.actionSupprimerCompte(idUtilisateur, motDePasseActuel);
      if(resultat != "true") {
        choixAlerte(resultat);
      }
    }

  /** Appelle le controleur qui déconnecte l'utilisateur */
  deconnecter(evenement) {
    console.log("VueProfil->deconnecter()");
    evenement.preventDefault();
    this.actionDeconnecter();
  }
}
