class VueAmis {
  constructor() {
    this.html = document.getElementById("html-vue-amis").innerHTML;
    // Fonctions prêtées par le controleur
    this.actionAjouterAmi = null;
  }

  /** Initialise la fonction actionAjouterAmi */
  initialiserActionAjouterAmi(actionAjouterAmi) {
    this.actionAjouterAmi = actionAjouterAmi;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueAmis->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;

    // Ecouteur du formulaire de demande d'amis
    document.getElementById("formulaire-ajouter-ami").addEventListener("submit",
    evenement => this.ajouterAmi(evenement));
  }

  async ajouterAmi(evenement) {
    console.log("VueProfil->actionAjouterAmi()");
    evenement.preventDefault();
    // Récupérer l'id de l'utilisateur connecté
    var idUtilisateur = firebase.auth().currentUser.uid;
    // Récupérer les valeurs des champs
    var emailUtilisateurAjoute = document.getElementById("email").value;
    // Ajouter ami
    var resultat = await this.actionAjouterAmi(idUtilisateur, emailUtilisateurAjoute);
    if(resultat != "true") {
      choixAlerte(resultat);
    }
  }
}
