class VueFilm {
    constructor() {
        this.html = document.getElementById("html-vue-film").innerHTML;
        this.Film = null;
    }

    initialiserFilm(film) {
        this.Film = film;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueFilm->afficher()");

        this.html = this.html.replace("{Film.titre}", this.Film.titre);
        this.html = this.html.replace("{Film.annee}", this.Film.annee);
        this.html = this.html.replace("{Film.affiche}", this.Film.affiche);
        this.html = this.html.replace("{Film.description}", this.Film.description);

        document.getElementsByTagName("contenu")[0].innerHTML = this.html;
    }
}