class VueMaListe {
    constructor() {
        this.html = document.getElementById("html-vue-maliste").innerHTML;
        /** Liste des films */
        this.listeFilm = null;
    }

    /** Initialise la liste des films */
    initialiserListeFilm(listeFilm) {
        this.listeFilm = listeFilm;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueMaListe->afficher()");
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        // Affichage de la liste des films
        if (this.listeFilm.length > 0) {
            document.getElementById("ma-liste-vide").style.display = "none";

            let listeFilm = document.getElementById("ma-liste");
            const filmHtml = listeFilm.innerHTML;
            let listeFilmHtmlRemplacement = "";

            for (let i in this.listeFilm) {
                let listeFilmItemHtmlRemplacement = filmHtml;
                listeFilmItemHtmlRemplacement =
                    listeFilmItemHtmlRemplacement.replace("{Film.id",
                        this.listeFilm[i].id);
                listeFilmItemHtmlRemplacement =
                    listeFilmItemHtmlRemplacement.replace("{Film.titre}",
                        this.listeFilm[i].titre);
                listeFilmHtmlRemplacement += listeFilmItemHtmlRemplacement;
            }
            listeFilm.innerHTML = listeFilmHtmlRemplacement;

        } else {
            document.getElementById("ma-liste").style.display = "none";
        }
    }

}