class VueProfil {
  constructor() {
    this.html = document.getElementById("html-vue-profil").innerHTML;
    this.listeGenreDonnee = null;
    // Fonctions prêtées par le controleur
    this.actionDeconnecter = null;
    this.actionMettreAJourInformationPersonnelle = null;
    this.actionEnregistrerListeGenreAime = null;
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

  /** Initialise la fonction actionEnregistrerListeGenreAime */
  initialiserActionEnregistrerListeGenreAime(actionEnregistrerListeGenreAime) {
    this.actionEnregistrerListeGenreAime = actionEnregistrerListeGenreAime;
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

    // Ecouteur du bouton de déconnexion
    document.getElementById("deconnexion").addEventListener("click",
        evenement => this.deconnecter(evenement));

    // Ecouteur du formulaire informations personnelles
    document.getElementById("formulaire-information-personnelle").addEventListener("submit",
        evenement => this.mettreAJourInformationPersonnelle(evenement));

    // Ecouteur du formulaire genres aimés
    document.getElementById("formulaire-genre-aime").addEventListener("submit",
        evenement => this.enregistrerListeGenreAime(evenement));

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
    for (let i in this.listeGenreDonnee) {
      let formulaireGenreItemHtmlRemplacement = formulaireGenreItemHtml;
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{id}",
              this.listeGenreDonnee[i].id)
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{name}",
              this.listeGenreDonnee[i].id)
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{value}",
              this.listeGenreDonnee[i].nom)
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{for}",
              this.listeGenreDonnee[i].id)
      formulaireGenreItemHtmlRemplacement =
          formulaireGenreItemHtmlRemplacement.replace("{label}",
              this.listeGenreDonnee[i].nom)
      formulaireGenreHtmlRemplacement += formulaireGenreItemHtmlRemplacement;
    }
    formulaireGenre.innerHTML = formulaireGenreHtmlRemplacement;
  }

  /** Récupère les informations personnelles renseignées par l'utilisateur et
   * et les passe au controleur */
  async mettreAJourInformationPersonnelle(evenement) {
    console.log("VueProfil->mettreAJourInformationPersonnelle()");
    evenement.preventDefault();
    // Récupérer les valeurs des champs
    let pseudo = document.getElementById("pseudo").value;
    let email = document.getElementById("email").value;
    let motDePasseActuel = document.getElementById("mot-de-passe-actuel").value;
    let nouveauMotDePasse = document.getElementById("nouveau-mot-de-passe").value;
    // Effectuer la mise à jour des informations personnelles
    let resultat = await this.actionMettreAJourInformationPersonnelle(pseudo,
        email, motDePasseActuel, nouveauMotDePasse);
    this.afficherAlerte(Utilisateur.choixAlerte(resultat));
  }

  /** Récupère les genre aimés par l'utilisateur et et les passe
   * au controleur */
  async enregistrerListeGenreAime(evenement) {
    console.log("VueProfil->enregistrerListeGenreAime()");
    evenement.preventDefault();
    // Récupérer les champs cochés
    let listeGenreAime = []
    for (let i in this.listeGenreDonnee) {
      let checkbox = document.getElementById(this.listeGenreDonnee[i].id);
      if (checkbox.checked) {
        listeGenreAime.push(this.listeGenreDonnee[i].id);
      }
    }
    // Enregistrer les genres aimés
    let resultat = await this.actionEnregistrerListeGenreAime(listeGenreAime);
    if(resultat !== "true") {
      alert(resultat);
    }
  }

  /** Récupère le mot de passe renseigné par l'utilisateur et appelle le
   * controleur */
  async supprimerCompte(evenement) {
    console.log("VueProfil->supprimerCompte()");
    evenement.preventDefault();
    // Récupérer le mot de passe
    let motDePasseActuel = document.getElementById("mot-de-passe").value;
    // Supprimer l'utilisateur
    let resultat = await this.actionSupprimerCompte(motDePasseActuel);
    if(resultat !== "true") {
      alert(resultat);
    }
  }

  /** Appelle le controleur qui déconnecte l'utilisateur */
  deconnecter(evenement) {
    console.log("VueProfil->deconnecter()");
    evenement.preventDefault();
    this.actionDeconnecter();
  }

  afficherAlerte(alerte) {
    if (alerte.type === "erreur") {
      document.getElementById("alerte").style.color = "red";
    } else if (alerte.type === "succes") {
      document.getElementById("alerte").style.color = "green";
    }
    document.getElementById("alerte").innerHTML = alerte.message;
  }
}
