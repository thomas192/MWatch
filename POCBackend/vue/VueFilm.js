class VueFilm {
    constructor() {
        this.html = document.getElementById("html-vue-film").innerHTML;
        /** Film à afficher */
        this.Film = null;
        /** Id de l'ami du film en commun */
        this.idAmi = null;
        // Fonctions prêtées par le controleur
        this.actionRetourAmi = null;
    }

    /** Initialise le film */
    initialiserFilm(film) {
        this.Film = film;
    }

    /** Initialise l'id de l'ami */
    initialiserIdAmi(idAmi) {
        this.idAmi = idAmi;
    }

    /** Initialise la fonction actionRetourAmi */
    initialiserActionRetourAmi(actionRetourAmi) {
        this.actionRetourAmi = actionRetourAmi;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueFilm->afficher()");

        this.html = this.html.replace("{Film.titre}", this.Film.titre);
        this.html = this.html.replace("{Film.annee}", this.Film.annee);
        this.html = this.html.replace("{Film.affiche}", this.Film.affiche);
        this.html = this.html.replace("{Film.description}", this.Film.description);

        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        document.getElementById("action-retour-ami").addEventListener("click",
            evenement => this.retourAmi(evenement));
    }

    retourAmi(evenement) {
        console.log("VueFilm->retourAmi()");
        evenement.preventDefault();

        this.actionRetourAmi(this.idAmi);
    }
}