class VueFilm {
    constructor() {
        this.html = document.getElementById("html-vue-film").innerHTML;
        /** Film à afficher */
        this.film = null;
        /** Vue appelante  */
        this.vueAppelante = null;
        // Fonctions prêtées par le controleur
        this.actionRetourAmi = null;
        this.faitPartieDeMaListe = null;
        this.actionSupprimerDeMaListe = null;
    }

    /** Initialise le film */
    initialiserFilm(film) {
        this.film = film;
    }

    /** Initialise la vue appelante */
    initialiserVueAppelante(vueAppelante) {
        this.vueAppelante = vueAppelante;
    }

    /** Initialise la fonction actionSupprimerDeMaListe */
    initialiserActionSupprimerDeMaListe(actionSupprimerDeMaListe) {
        this.actionSupprimerDeMaListe = actionSupprimerDeMaListe;
    }

    /** Initialise la fonction actionRetourAmi */
    initialiserActionRetourVueFilm(actionRetourVueFilm) {
        this.actionRetourAmi = actionRetourVueFilm;
    }

    /** Initialise la fonction actionFaitPartieDeMaListe */
    initialiserFaitPartieDeMaListe(faitPartieDeMaListe) {
        this.faitPartieDeMaListe = faitPartieDeMaListe;
    }

    /** Gère l'affichage de la vue */
    async afficher() {
        console.log("VueFilm->afficher()");
        // Affichage du film
        this.html = this.html.replace("{Film.titre}", this.film.titre);
        this.html = this.html.replace("{Film.annee}", this.film.annee);
        this.html = this.html.replace("{Film.affiche}", this.film.affiche);
        this.html = this.html.replace("{Film.description}", this.film.description);
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;
        // Affichage du bouton supprimer
        if (await this.faitPartieDeMaListe(this.film.id)) {
            console.log("true");
            document.getElementById("action-supprimer-film").style.display = "block";
            // Bouton supprimé cliqué
            document.getElementById("action-supprimer-film").addEventListener("click",
                evenement => this.supprimerDeMaListe(evenement));
        } else {
            console.log("false");
            document.getElementById("action-supprimer-film").style.display = "none";
        }
        // Bouton retour cliqué
        document.getElementById("action-retour-vue-film").addEventListener("click",
            evenement => this.retourVueFilm(evenement));
    }

    async supprimerDeMaListe(evenement) {
        console.log("VueFilm->retourVueFilm()");
        evenement.preventDefault();

        await this.actionSupprimerDeMaListe(this.film.id);

        this.actionRetourAmi(this.vueAppelante);

    }

    retourVueFilm(evenement) {
        console.log("VueFilm->retourVueFilm()");
        evenement.preventDefault();

        this.actionRetourAmi(this.vueAppelante);
    }
}