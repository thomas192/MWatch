class Application {
  constructor(window, utilisateurDAO, vueInscription, vueConnexion, vueProfil, vueAmis, vueAmi, vueSwipe, vueFilm, vueMaListe) {
    this.window = window;
    this.utilisateurDAO = utilisateurDAO;
    this.vueInscription = vueInscription;
    this.vueConnexion = vueConnexion;
    this.vueProfil = vueProfil;
    this.vueAmis = vueAmis;
    this.vueAmi = vueAmi;
    this.vueSwipe = vueSwipe;
    this.vueFilm = vueFilm;
    this.vueMaListe = vueMaListe;

    // Initialiser la fonction actionInscrire dans VueInscription
    this.vueInscription.initialiserActionInscrire((pseudo, email, motDePasse) =>
      this.actionInscrire(pseudo, email, motDePasse));

    // Initialiser la fonction actionConnecter dans VueConnexion
    this.vueConnexion.initialiserActionConnecter((email, motDePasse) =>
      this.actionConnecter(email, motDePasse));

    // Initialiser la fonction actionMettreAJourInformationPersonnelle dans VueProfil
    this.vueProfil.initialiserActionMettreAJourInformationPersonnelle((idUtilisateur,
      pseudo, email, motDePasseActuel, nouveauMotDePasse) =>
        this.actionMettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
          motDePasseActuel, nouveauMotDePasse));

    // Initialiser la fonction actionEnregistrerListeGenreAime dans VueProfil
    this.vueProfil.initialiserActionEnregistrerListeGenreAime((idUtilisateur,
      listeGenreAime) => this.actionEnregistrerListeGenreAime(idUtilisateur,
        listeGenreAime));

    // Initialiser la fonction actionSupprimerCompte dans VueProfil
    this.vueProfil.initialiserActionSupprimerCompte((idUtilisateur, motDePasse) =>
      this.actionSupprimerCompte(idUtilisateur, motDePasse));

    // Initialiser la fonction actionDeconnecter dans VueProfil
    this.vueProfil.initialiserActionDeconnecter(() => this.actionDeconnecter());

    // Initialiser la fonction actionSupprimerCompte dans VueProfil
    this.vueAmis.initialiserActionAjouterAmi((idUtilisateur, emailUtilisateurAjoute) =>
      this.actionAjouterAmi(idUtilisateur, emailUtilisateurAjoute));

    // Initialiser la fonction actionGererDemandeAmi dans VueAmis
    this.vueAmis.initialiserActionGererDemandeAmi((idUtilisateurAccepte, reponse) =>
      this.actionGererDemandeAmi(idUtilisateurAccepte, reponse));

    // Initialiser la fonction actionSupprimerAmi dans VueAmi
    this.vueAmi.initialiserActionSupprimerAmi((idAmi) => this.actionSupprimerAmi(idAmi));

    // Intialiser la fonction actionRetourVueFilm dans VueFilm
    this.vueFilm.initialiserActionRetourVueFilm((idAmi) => this.actionRetourVueFilm(idAmi));

    // Initialiser la fonction actionFaitPartieDeMaListe dans VueFilm
    this.vueFilm.initialiserFaitPartieDeMaListe((idFilm) => this.faitPartieDeMaListe(idFilm));

    // Initialiser la fonction actionSupprimerDeMaListe dans VueFilm
    this.vueFilm.initialiserActionSupprimerDeMaListe((idFilm) => this.actionSupprimerDeMaListe(idFilm));

    // Intialiser la fonction actionObtenirFilmASwiper dans VueSwipe
    this.vueSwipe.initialiserActionObtenirFilmASwiper(() => this.actionObtenirFilmASwiper());

    // Intialiser la fonction actionGererSwipe dans VueSwipe
    this.vueSwipe.initialiserActionGererSwipe((film, reponse) => this.actionGererSwipe(film, reponse));

    // Intialiser la fonction actionAjouterAMaListe dans VueSwipe
    this.vueSwipe.initialiserActionAjouterAMaListe((film) => this.actionAjouterAMaListe(film));

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
          document.getElementById("menu-item-amis").style.display = "block";
          document.getElementById("menu-item-swipe").style.display = "block";
        } else {
          console.log("   Utilisateur non connecté");
          document.getElementById("menu-item-inscription").style.display = "block";
          document.getElementById("menu-item-connexion").style.display = "block";
          document.getElementById("menu-item-profil").style.display = "none";
          document.getElementById("menu-item-amis").style.display = "none";
          document.getElementById("menu-item-swipe").style.display = "none";
        }
      });
  }

  async naviguer() {
    console.log("Application->naviguer()");
    let hash = window.location.hash;

    if (!hash) {
      this.vueConnexion.afficher();

    } else if (hash.match(/^#inscription/)) {
      this.vueInscription.afficher();

    } else if (hash.match(/^#profil/)) {
      this.vueProfil.initialiserListeGenre(this.utilisateurDAO.listerGenre());
      this.vueProfil.afficher();

    } else if (hash.match(/^#maliste/)) {
      this.vueMaListe.initialiserListeFilm(await this.utilisateurDAO.obtenirMaListe());
      this.vueFilm.initialiserVueAppelante(hash);
      this.vueMaListe.afficher();

    } else if (hash.match(/^#amis/)) {
      this.vueAmis.initialiserListeDemandeAmi(await this.utilisateurDAO.listerDemandeAmi())
      this.vueAmis.initialiserListeAmi(await this.utilisateurDAO.listerAmi())
      this.vueAmis.afficher();

    } else if (hash.match(/^#ami\/(.*)/)) {
      let navigation = hash.match(/^#ami\/(.*)/);
      let idAmi = navigation[1];
      this.vueAmi.initialiserAmi(await this.utilisateurDAO.getUtilisateur(idAmi));
      this.vueAmi.initialiserListeFilmEnCommun(await this.utilisateurDAO.listerFilmEnCommun(idAmi));
      this.vueFilm.initialiserVueAppelante(hash);
      this.vueAmi.afficher();

    } else if (hash.match(/^#film\/(.*)/)) {
      let navigation = hash.match(/^#film\/(.*)/);
      let idFilm = navigation[1];
      this.vueFilm.initialiserFilm(await this.utilisateurDAO.obtenirFilm(idFilm));
      this.vueFilm.afficher();

    } else if (hash.match(/^#swipe/)) {
      this.vueSwipe.afficher();
    }
  }

  async actionInscrire(pseudo, email, motDePasse) {
    console.log("Application->actionInscrire()");
    let resultat = await this.utilisateurDAO.inscrire(pseudo, email, motDePasse);
    let user = await firebase.auth().currentUser;
    // Redirection
    if (user != null) {
      this.window.location.hash = "#profil";
    }
    return resultat;
  }

  async actionConnecter(email, motDePasse) {
    console.log("Application->actionConnecter()");
    let resultat = await this.utilisateurDAO.connecter(email, motDePasse);
    let user = await firebase.auth().currentUser;
    // Redirection
    if (user != null) {
      this.window.location.hash = "#profil";
    }
    return resultat;
  }

  actionDeconnecter() {
    console.log("Application->actionDeconnecter()");
    this.utilisateurDAO.deconnecter();
    console.log("   Utilisateur déconnecté");
    this.window.location.hash = "#";
  }

  async actionMettreAJourInformationPersonnelle(idUtilisateur, pseudo, email,
    motDePasseActuel, nouveauMotDePasse) {
    console.log("Application->actionMettreAJourInformationPersonnelle()");
    return await this.utilisateurDAO.mettreAJourInformationPersonnelle(idUtilisateur,
      pseudo, email, motDePasseActuel, nouveauMotDePasse);
  }

  async actionEnregistrerListeGenreAime(idUtilisateur, listeGenreAime) {
    console.log("Application->actionEnregistrerListeGenreAime()");
    return await this.utilisateurDAO.enregistrerListeGenreAime(idUtilisateur,
      listeGenreAime);
  }

  async actionSupprimerCompte(idUtilisateur, motDePasse) {
    console.log("Application->actionSupprimerCompte()");
    let resultat = await this.utilisateurDAO.supprimerCompte(idUtilisateur, motDePasse);
    // Redirection
    if (resultat === "true") {
      this.window.location.hash = "#";
    }
    return resultat;
  }

  async actionAjouterAmi(idUtilisateur, emailUtilisateurAjoute) {
    console.log("Application->actionAjouterAmi()");
    return await this.utilisateurDAO.ajouterAmi(idUtilisateur, emailUtilisateurAjoute);
  }

  async actionGererDemandeAmi(idUtilisateurAccepte, reponse) {
    console.log("Application->actionGererDemandeAmi()");
    return await this.utilisateurDAO.gererDemandeAmi(idUtilisateurAccepte, reponse);
  }

  async actionSupprimerAmi(idAmi) {
    console.log("Application->actionSupprimerAmi()");
    let resultat = await this.utilisateurDAO.supprimerAmi(idAmi);
    // Redirection
    if (resultat === "true") {
      this.window.location.hash = "#amis";
    }
    return resultat;
  }

  async actionRetourVueFilm(vueAppelante) {
    console.log("Application->actionRetourVueFilm()");
    this.window.location.hash = vueAppelante;
  }

  async faitPartieDeMaListe(idFilm) {
    console.log("Application->faitPartieDeMaListe()");
    return await this.utilisateurDAO.faitPartieDeMaListe(idFilm)
  }

  async actionSupprimerDeMaListe(idFilm) {
    console.log("Application->actionSupprimerDeMaListe()");
    return await this.utilisateurDAO.supprimerDeMaListe(idFilm);
  }

  async actionObtenirFilmASwiper() {
    console.log("Application->actionObtenirFilmASwiper");
    return await this.utilisateurDAO.obtenirFilmASwiper();
  }

  async actionGererSwipe(film, reponse) {
    console.log("Application->actionGererSwipe()");
    return await this.utilisateurDAO.gererSwipe(film, reponse);
  }

  async actionAjouterAMaListe(film) {
    console.log("Application->actionAjouterAMaListe()");
    return await this.utilisateurDAO.ajouterAMaListe(film);
  }
}

new Application(window, new UtilisateurDAO(), new VueInscription(), new VueConnexion(), new VueProfil(), new VueAmis(), new VueAmi(), new VueSwipe(), new VueFilm(), new VueMaListe());
