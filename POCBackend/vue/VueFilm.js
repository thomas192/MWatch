class VueFilm {
    constructor() {
        this.html = document.getElementById("html-vue-film").innerHTML;
        /** Film à afficher */
        this.Film = null;
        /** Vue appelante  */
        this.vueAppelante = null;
        // Fonctions prêtées par le controleur
        this.actionRetourAmi = null;
    }

    /** Initialise le film */
    initialiserFilm(film) {
        this.Film = film;
    }

    /** Initialise la vue appelante */
    initialiserVueAppelante(vueAppelante) {
        this.vueAppelante = vueAppelante;
    }

    /** Initialise la fonction actionRetourAmi */
    initialiserActionRetourVueFilm(actionRetourVueFilm) {
        this.actionRetourAmi = actionRetourVueFilm;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueFilm->afficher()");

        this.html = this.html.replace("{Film.titre}", this.Film.titre);
        this.html = this.html.replace("{Film.annee}", this.Film.annee);
        this.html = this.html.replace("{Film.affiche}", this.Film.affiche);
        this.html = this.html.replace("{Film.description}", this.Film.description);

        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        document.getElementById("action-retour-vue-film").addEventListener("click",
            evenement => this.retourVueFilm(evenement));
    }

    retourVueFilm(evenement) {
        console.log("VueFilm->retourVueFilm()");
        evenement.preventDefault();

        this.actionRetourAmi(this.vueAppelante);
    }
}