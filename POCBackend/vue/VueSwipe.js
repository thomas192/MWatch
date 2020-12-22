class VueSwipe {
    constructor() {
        this.html = document.getElementById("html-vue-swipe").innerHTML;
        /** Film à swiper */
        this.filmASwiper = null;
        // Fonctions prêtées par le controleur
        this.actionGererSwipe = null;
        this.actionObtenirFilmASwiper = null;
        this.actionAjouterAMaListe = null;
    }

    /** Initialise la fonction actionObtenirFilmASwiper */
    initialiserActionObtenirFilmASwiper(actionObtenirFilmASwiper) {
        this.actionObtenirFilmASwiper = actionObtenirFilmASwiper;
    }

    /** Initialise la fonction actionGererSwipe */
    initialiserActionGererSwipe(actionGererSwipe) {
        this.actionGererSwipe = actionGererSwipe;
    }

    /** Initialise la fonction actionAjouterAMaListe */
    initialiserActionAjouterAMaListe(actionAjouterAMaListe) {
        this.actionAjouterAMaListe = actionAjouterAMaListe;
    }

    /** Gère l'affichage de la vue */
    async afficher() {
        console.log("VueSwipe->afficher()");
        document.getElementsByTagName("contenu")[0].innerHTML = this.html;
        // Ajout d'un écouteur pour chaque bouton de la vue
        let listeBouton = document.getElementsByTagName("button");
        for (let i=0; i<listeBouton.length; i++) {
            let valeurBouton = listeBouton[i].value;
            listeBouton[i].addEventListener("click",
                evenement => this.gererSwipe(evenement, valeurBouton));
        }
        // Affiche cliquée
        document.getElementById("affiche").addEventListener("click",
            evenement => this.afficherDetailsFilm(evenement));
    }

    /** Affiche un film à swiper */
    async afficherFilmASwiper(filmASwiper) {
        console.log("VueSwipe->afficherFilmASwiper()");
        document.getElementById("detailsFilm").style.display = "none";
        // Récupérer le film à swiper
        this.filmASwiper = filmASwiper;
        // Affichage du film
        document.getElementById("affiche").src = this.filmASwiper.affiche;
        document.getElementById("titre-film").innerHTML = this.filmASwiper.titre + " (" + this.filmASwiper.annee + ")";
        document.getElementById("description-film").innerHTML = this.filmASwiper.description;
        // Réinitialiser la checkbox utilisée pour ajouter un film à Ma liste
        document.getElementById("ajouter-a-ma-liste").checked = false;
    }

    afficherDetailsFilm(evenement) {
        console.log("VueSwipe->afficherDetailsFilm");
        evenement.preventDefault();
        let style = window.getComputedStyle(document.getElementById("detailsFilm")).display;
        if (style === "none") {
            document.getElementById("detailsFilm").style.display = "block";
        } else {
            document.getElementById("detailsFilm").style.display = "none";
        }
    }

    async gererSwipe(evenement, reponse) {
        console.log("VueSwipe->gererSwipe");
        evenement.preventDefault();

        let ajouterAMaListe = document.getElementById("ajouter-a-ma-liste");
        // Ajout du film à la liste de l'utilisateur
        if (ajouterAMaListe.checked) {
            await this.actionAjouterAMaListe(this.filmASwiper);
        }
        // Gérer swipe
        let resultat = await this.actionGererSwipe(this.filmASwiper, reponse);
        if (resultat !== "true") {
            alert(resultat);
        } else {
            this.actionObtenirFilmASwiper();
        }
    }
}