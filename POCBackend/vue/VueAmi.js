class VueAmi {
  constructor() {
    this.html = document.getElementById("html-vue-ami").innerHTML;
    this.ami = null;
    this.listeFilmEnCommun = null;
    // Fonctions prêtées par le controleur
    this.actionSupprimerAmi = null;
  }

  /** Initialise l'ami */
  initialiserAmi(ami) {
    this.ami = ami;
  }

  /** Initialise la fonction actionSupprimerAmi */
  initialiserActionSupprimerAmi(actionSupprimerAmi) {
    this.actionSupprimerAmi = actionSupprimerAmi;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueAmi->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;

    // Affichage du pseudo de l'ami
    document.getElementsByClassName("page")[0].innerHTML = document.getElementsByClassName("page")[0]
        .innerHTML.replace("{h1.texte}", this.ami.pseudo);

    // Ecouteur du bouton supprimer ami
    document.getElementById("action-supprimer-ami").addEventListener("click",
    evenement => this.supprimerAmi(evenement));

    // Affichage de la liste des films en commun
    this.listeFilmEnCommun = [];
    if (!this.listeFilmEnCommun.length > 0) {
      document.getElementById("liste-film-en-commun-vide").style.display = "block";
    }
  }

  async supprimerAmi(evenement) {
    console.log("VueAmi->supprimerAmi()");
    evenement.preventDefault();
    let resultat = await this.actionSupprimerAmi(this.ami.idUtilisateur);
    if (resultat !== "true") {
      choixAlerte(resultat);
    }
  }

}
