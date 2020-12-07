class VueAmi {
  constructor() {
    this.html = document.getElementById("html-vue-ami").innerHTML;
    this.ami = null;
    this.listeFilmEnCommun = null;
  }

  /** Initialise l'ami */
  initialiserAmi(ami) {
    this.ami = ami;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueAmi->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;

    // Affichage du pseudo de l'ami
    var pageHtmlRemplacement = document.getElementsByClassName("page")[0].innerHTML.replace("{h1.texte}", this.ami.pseudo);
    document.getElementsByClassName("page")[0].innerHTML = pageHtmlRemplacement;

    // Affichage de la liste des films en commun
    this.listeFilmEnCommun = [];
    if (!this.listeFilmEnCommun.length > 0) {
      document.getElementById("liste-film-en-commun-vide").style.display = "block";
    }
  }
  
}
