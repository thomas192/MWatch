class VueAmis {
  constructor() {
    this.html = document.getElementById("html-vue-amis").innerHTML;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueAmis->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;

    // Ecouteur du formulaire de demande d'amis
    document.getElementById("formulaire-ajouter-ami").addEventListener("submit",
    evenement => this.ajouterAmis(evenement));
  }
}
