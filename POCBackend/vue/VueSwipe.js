class VueSwipe {
    constructor() {
        this.html = document.getElementById("html-vue-swipe").innerHTML;
        /** Film à swiper */
        this.filmASwiper = null;
    }

    /** Initialise un film à swiper */
    intialiserFilmASwiper(film) {
        this.filmASwiper = film;
    }

    /** Gère l'affichage de la vue */
    afficher() {
        console.log("VueSwiper->afficher()");
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;

        this.afficherFilmASwiper();
    }

    /** Affiche un film à swiper */
    afficherFilmASwiper() {
        console.log("VueSwiper->afficherFilm()");
        document.getElementsByClassName("page")[0].innerHTML = document.getElementsByClassName("page")[0]
            .innerHTML.replace("{img.src}", this.filmASwiper.affiche);
    }

}