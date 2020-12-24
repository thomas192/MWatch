class VueAmi {
  constructor() {
    this.html = document.getElementById("html-vue-ami").innerHTML;
    /** Ami à afficher */
    this.ami = null;
    /** Films en commun à afficher */
    this.listeFilmEnCommun = null;
    // Fonctions prêtées par le controleur
    this.actionSupprimerAmi = null;
  }

  /** Initialise l'ami à afficher */
  initialiserAmi(ami) {
    this.ami = ami;
  }

  /** Initialise la liste des films en commun */
  initialiserListeFilmEnCommun(listeFilmEnCommun) {
    this.listeFilmEnCommun = listeFilmEnCommun;
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
    if (this.listeFilmEnCommun.length > 0) {
      document.getElementById("liste-film-en-commun-vide").style.display = "none";

      let listeFilm = document.getElementById("liste-film-en-commun");
      const filmHtml = listeFilm.innerHTML;
      let listeFilmHtmlRemplacement = "";

      for (let i in this.listeFilmEnCommun) {
        let listeFilmItemHtmlRemplacement = filmHtml;
        listeFilmItemHtmlRemplacement =
            listeFilmItemHtmlRemplacement.replace("{a.href}",
                this.listeFilmEnCommun[i].id);
        listeFilmItemHtmlRemplacement =
            listeFilmItemHtmlRemplacement.replace("{a.texte}",
                this.listeFilmEnCommun[i].titre);
        listeFilmHtmlRemplacement += listeFilmItemHtmlRemplacement;
      }
      listeFilm.innerHTML = listeFilmHtmlRemplacement;

    } else {
      document.getElementById("liste-film-en-commun").style.display = "none";
    }
  }

  async supprimerAmi(evenement) {
    console.log("VueAmi->supprimerAmi()");
    evenement.preventDefault();
    let resultat = await this.actionSupprimerAmi(this.ami.id);
    if (resultat !== "true") {
      alert(resultat);
    }
  }

}
