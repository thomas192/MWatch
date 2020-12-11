class VueSwipe {
    constructor() {
        this.html = document.getElementById("html-vue-swipe").innerHTML;
        /** Film à swiper */
        this.filmASwiper = null;
        // Foncrions prêtées par le controleur
        this.actionGererSwipe = null;
        this.actionObtenirFilmASwiper = null;
    }

    /** Initialise la fonction actionObtenirFilmASwiper */
    initialiserActionObtenirFilmASwiper(actionObtenirFilmASwiper) {
        this.actionObtenirFilmASwiper = actionObtenirFilmASwiper;
    }

    /** Initialise la fonction actionGererSwipe */
    initialiserActionGererSwipe(actionGererSwipe) {
        this.actionGererSwipe = actionGererSwipe;
    }

    /** Gère l'affichage de la vue */
    async afficher() {
        console.log("VueSwipe->afficher()");
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        await this.afficherFilmASwiper();

        // Ajout d'un écouteur pour chaque bouton de la vue
        let listeBouton = document.getElementsByTagName("button");
        for (let i=0; i<listeBouton.length; i++) {
            let valeurBouton = listeBouton[i].value;
            listeBouton[i].addEventListener("click",
                evenement => this.gererSwipe(evenement, valeurBouton));
        }
    }

    /** Affiche un film à swiper */
    async afficherFilmASwiper() {
        console.log("VueSwipe->afficherFilmASwiper()");
        // Récupérer le film à swiper
        this.filmASwiper = await this.actionObtenirFilmASwiper();
        // Affichage de l'affiche
        document.getElementById("affiche").src = this.filmASwiper.affiche;
    }

    async gererSwipe(evenement, reponse) {
        console.log("VueSwipe->gererSwipe");
        let idFilm = this.filmASwiper.id;
        let resultat = await this.actionGererSwipe(idFilm, reponse);
        if (resultat !== "true") {
            choixAlerte(resultat);
        } else {
            await this.afficherFilmASwiper();
        }
    }
}