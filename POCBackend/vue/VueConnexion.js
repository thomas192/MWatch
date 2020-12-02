class VueConnexion {
  constructor() {
    this.html = document.getElementById("html-vue-connexion").innerHTML;
    this.actionConnecter = null;
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

    var resultat = await this.actionConnecter(email, motDePasse);
    if(resultat == "true") {
      console.log("   Utilisateur connecté");
    } else{
      choixAlerte(resultat);
    }
  }
}
