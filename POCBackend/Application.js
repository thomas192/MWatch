class Application {
  constructor(window, utilisateurDAO, vueInscription, vueConnexion, vueProfil) {
    this.window = window;
    this.utilisateurDAO = utilisateurDAO;
    this.vueInscription = vueInscription;
    this.vueConnexion = vueConnexion;
    this.vueProfil = vueProfil;

    // Initialise la fonction actionInscrire dans VueInscription
    this.vueInscription.initialiserActionInscrire((pseudo, email, motDePasse) =>
      this.actionInscrire(pseudo, email, motDePasse));

    // Initialise la fonction actionConnecter dans VueConnexion
    this.vueConnexion.initialiserActionConnecter((email, motDePasse) =>
      this.actionConnecter(email, motDePasse));

    // Initialise la fonction actionMettreAJourInformationPersonnelle dans VueProfil
    this.vueProfil.initialiserActionMettreAJourInformationPersonnelle((idUtilisateur,
      pseudo, email, motDePasseActuel, nouveauMotDePasse) =>
        this.actionMettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
          motDePasseActuel, nouveauMotDePasse));

    // Initialise la fonction actionMettreAJourGenreAime dans VueProfil
    this.vueProfil.initialiserActionMettreAJourGenreAime((idUtilisateur,
      listeGenreAime) => this.actionMettreAJourGenreAime(idUtilisateur,
        listeGenreAime));

    // Initialise la fonction actionSupprimerCompte dans VueProfil
    this.vueProfil.initialiserActionSupprimerCompte((idUtilisateur, motDePasse) =>
      this.actionSupprimerCompte(idUtilisateur, motDePasse));

    // Initialise la fonction actionDeconnecter dans VueProfil
    this.vueProfil.initialiserActionDeconnecter(() => this.actionDeconnecter());

    this.initialiserApplication();
  }

  initialiserApplication() {
      console.log("Application->initialiserNavigation()");

      this.window.addEventListener("hashchange", () => this.naviguer());

      // Ecouteur qui met à jour l'interface utilisateur automatiquement à chaque
      // fois que l'utilisateur se connecte ou se déconnecte
      firebase.auth().onAuthStateChanged(function(user) {
        console.log("Event onAuthStateChanged");
        if(user != null) {
          console.log("   Utilisateur connecté");
          document.getElementById("menu-item-inscription").style.display = "none";
          document.getElementById("menu-item-connexion").style.display = "none";
          document.getElementById("menu-item-profil").style.display = "block";
        } else {
          console.log("   Utilisateur non connecté");
          document.getElementById("menu-item-inscription").style.display = "block";
          document.getElementById("menu-item-connexion").style.display = "block";
          document.getElementById("menu-item-profil").style.display = "none";
        }
      });
  }

  naviguer() {
    console.log("Application->naviguer()");
    let hash = window.location.hash;

    if (!hash) {
      this.vueConnexion.afficher();
    } else if (hash.match(/^#inscription/)) {
      this.vueInscription.afficher();
    } else if (hash.match(/^#profil/)) {
      this.vueProfil.initialiserListeGenre(this.utilisateurDAO.listerGenre());
      this.vueProfil.afficher();
    }
  }

  async actionInscrire(pseudo, email, motDePasse) {
    console.log("Application->actionInscrire()");
    var resultat = await this.utilisateurDAO.inscrire(pseudo, email, motDePasse);
    var user = await firebase.auth().currentUser;
    // Redirection
    if (user != null) {
      this.window.location.hash = "#profil";
    }
    return resultat;
  }

  async actionConnecter(email, motDePasse) {
    console.log("Application->actionConnecter()");
    var resultat = await this.utilisateurDAO.connecter(email, motDePasse);
    var user = await firebase.auth().currentUser;
    // Redirection
    if (user != null) {
      this.window.location.hash = "#profil";
    }
    return resultat;
  }

  actionDeconnecter() {
    console.log("Application->actionDeconnecter()");
    firebase.auth().signOut();
    console.log("   Utilisateur déconnecté");
    this.window.location.hash = "#";
  }

  async actionMettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
    motDePasseActuel, nouveauMotDePasse) {
    console.log("Application->actionMettreAJourInformationPersonnelle()");
    return await this.utilisateurDAO.mettreAJourInformationPersonnelle(idUtilisateur,
      pseudo, email, motDePasseActuel, nouveauMotDePasse);
  }

  async actionMettreAJourGenreAime(idUtilisateur, listeGenreAime) {
    console.log("Application->actionMettreAJourGenreAime()");
    return await this.utilisateurDAO.mettreAJourGenreAime(idUtilisateur,
      listeGenreAime);
  }

    async actionSupprimerCompte(idUtilisateur, motDePasse) {
    console.log("Application->actionSupprimerCompte()");
    var resultat = await this.utilisateurDAO.supprimerCompte(idUtilisateur, motDePasse);
    // Redirection
    if (resultat == "true") {
      this.window.location.hash = "#";
    }
    return resultat;
  }

}

new Application(window, new UtilisateurDAO(), new VueInscription(), new VueConnexion(), new VueProfil());
