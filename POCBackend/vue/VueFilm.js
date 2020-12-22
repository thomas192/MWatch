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
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;
        document.getElementById("action-supprimer-film").style.display = "none";
        // Bouton retour cliqué
        document.getElementById("action-retour-vue-film").addEventListener("click",
            evenement => this.retourVueFilm(evenement));
    }

    async afficherFilm(film) {
        console.log("VueFilm->afficherFilm()");
        this.film = film;
        // Affichage du film
        document.getElementById("affiche").src = this.film.affiche;
        document.getElementById("titre").innerHTML = this.film.titre + " (" + this.film.annee + ")";
        document.getElementById("description").innerHTML = this.film.description;
        // Affichage du bouton supprimer
        if (await this.faitPartieDeMaListe(this.film.id)) {
            document.getElementById("action-supprimer-film").style.display = "block";
            // Bouton supprimé cliqué
            document.getElementById("action-supprimer-film").addEventListener("click",
                evenement => this.supprimerDeMaListe(evenement));
        } else {
            document.getElementById("action-supprimer-film").style.display = "none";
        }
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