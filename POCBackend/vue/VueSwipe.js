class VueSwipe {
    constructor() {
        this.html = document.getElementById("html-vue-swipe").innerHTML;
        /** Film à swiper */
        this.filmASwiper = null;
        // Foncrions prêtées par le controleur
        this.actionGererSwipe = null;
    }

    /** Initialise un film à swiper */
    intialiserFilmASwiper(film) {
        this.filmASwiper = film;
    }

    /** Initialise la fonction actionGererSwipe */
    initialiserActionGererSwipe(actionGererSwipe) {
        this.actionGererSwipe = actionGererSwipe;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueSwipe->afficher()");
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        // Ajout d'un écouteur pour chaque bouton de la vue
        let listeBouton = document.getElementsByTagName("button");
        for (let i=0; i<listeBouton.length; i++) {
            let valeurBouton = listeBouton[i].value;
            listeBouton[i].addEventListener("click",
                evenement => this.gererSwipe(evenement, valeurBouton));
        }

        this.afficherFilmASwiper();
    }

    /** Affiche un film à swiper */
    afficherFilmASwiper() {
        console.log("VueSwipe->afficherFilm()");
        // Affichage de l'affiche
        document.getElementById("img").innerHTML = document.getElementById("img")
            .innerHTML.replace("{img.src}", this.filmASwiper.affiche);
    }

    async gererSwipe(evenement, reponse) {
        console.log("VueSwipe->gererSwipe");
        let idFilm = this.filmASwiper.id;
        let resultat = await this.actionGererSwipe(idFilm, reponse);
        if (resultat !== "true") {
            choixAlerte(resultat);
        }
    }
}