class VueInscription {
  constructor() {
    this.html = document.getElementById("html-vue-inscription").innerHTML;
    this.actionInscrire = null;
  }

  initialiserActionInscrire(actionInscrire) {
    this.actionInscrire = actionInscrire;
  }

  afficher() {
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;
    document.getElementById("formulaire").addEventListener("submit",
    evenement => this.inscrire(evenement));
  }

  async inscrire(evenement) {
    evenement.preventDefault();

    let pseudo = document.getElementById("pseudo").value;
    let email = document.getElementById("email").value;
    let motDePasse = document.getElementById("mot-de-passe").value;

    let resultat = await this.actionInscrire(pseudo, email, motDePasse);
    if(resultat === "true") {
      console.log("   Utilisateur inscrit et connecté");
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
