class VuePrincipale{
    constructor(){
        this.html = document.getElementById("html-vue-principale").innerHTML;
    }

    afficher(){
        document.getElementsByTagName("body")[0].innerHTML = this.html;
        var region = new ZingTouch.Region(document.getElementById('parent'));
        var target = document.getElementById('child');
        region.bind(target, 'swipe', evenement => this.actionSwipeFilm(evenement));
    }

    initialiserActionDemanderPropositionFilm(actionDemanderPropositionFilm){
        this.actionDemanderPropositionFilm = actionDemanderPropositionFilm;
    }

    rafraichirFilm(filmPropose){
        document.getElementById('child').style.background = "url('https://image.tmdb.org/t/p/original"+filmPropose.backgroundpath+"')";
        document.getElementById('child').style.backgroundSize = "contain";
        document.getElementById('child').style.backgroundPosition = "center";
        document.getElementById('titre-film').innerHTML = filmPropose.titre;
        this.film = filmPropose;
    }

    actionSwipeFilm(evenement){
        var dir = evenement.detail.data[0].currentDirection;
        var margeErreur = 20; // "Marge" d'erreur pour savoir si le swipe est dans la bonne direction. EX : 340° = Swipe droite quand meme ; CHANGER SI BESOIN

        if(dir < 0+margeErreur || dir > 360-margeErreur){
            console.log("Swipe vers la droite");
            this.actionVouloirVoirFilm(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LA DROITE
        } else if(dir < 90+margeErreur && dir > 90-margeErreur){
            console.log("Swipe vers le haut");
            this.actionFilmVuAime(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LE HAUT
        } else if(dir < 180+margeErreur && dir > 180-margeErreur){
            console.log("Swipe vers la gauche");
            this.actionPasVouloirVoirFilm(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LA GAUCHE
        } else if(dir < 270+margeErreur && dir > 270-margeErreur){
            console.log("Swipe vers le bas");
            this.actionFilmVuNonAime(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LE BAS
        }
        
    }

    initialiserActionVouloirVoirFilm(actionVouloirVoirFilm){
        this.actionVouloirVoirFilm = actionVouloirVoirFilm;
    }

    initialiserActionPasVouloirVoirFilm(actionPasVouloirVoirFilm){
        this.actionPasVouloirVoirFilm = actionPasVouloirVoirFilm;
    }

    initialiserActionFilmVuAime(actionFilmVuAime){
        this.actionFilmVuAime = actionFilmVuAime;
    }

    initialiserActionFilmVuNonAime(actionFilmVuNonAime){
        this.actionFilmVuNonAime = actionFilmVuNonAime;
    }
}