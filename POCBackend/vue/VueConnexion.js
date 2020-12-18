class VueConnexion {
  constructor() {
    this.html = document.getElementById("html-vue-connexion").innerHTML;
    this.actionConnecter = null;
  }

  /** Met à jour le menu pour l'utilisateur déconnecté */
  presenterDeconnexion() {
    console.log("VueConnexion->presenterDeconnexion()");
    document.getElementById("menu-item-inscription").style.display = "block";
    document.getElementById("menu-item-connexion").style.display = "block";
    document.getElementById("menu-item-profil").style.display = "none";
    document.getElementById("menu-item-amis").style.display = "none";
    document.getElementById("menu-item-swipe").style.display = "none";
  }

  /** Met à jour le menu pour l'utilisateur connecté */
  presenterConnexion() {
    console.log("VueConnexion->presenterConnexion()");
    document.getElementById("menu-item-inscription").style.display = "none";
    document.getElementById("menu-item-connexion").style.display = "none";
    document.getElementById("menu-item-profil").style.display = "block";
    document.getElementById("menu-item-amis").style.display = "block";
    document.getElementById("menu-item-swipe").style.display = "block";
  }

  initialiserActionConnecter(actionConnecter) {
    this.actionConnecter = actionConnecter;
  }

  afficher() {
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;
    document.getElementById("formulaire").addEventListener("submit",
    evenement => this.connecter(evenement));
  }

  async connecter(evenement) {
    console.log("VueConnexion->connecter()");
    evenement.preventDefault();

    let email = document.getElementById("email").value;
    let motDePasse = document.getElementById("mot-de-passe").value;

    let resultat = await this.actionConnecter(email, motDePasse);
    if(resultat === "true") {
      console.log("   Utilisateur connecté");
    } else{
      this.afficherAlerte(Utilisateur.choixAlerte(resultat));
    }
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
