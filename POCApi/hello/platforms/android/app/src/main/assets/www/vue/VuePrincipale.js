//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vue dans laquelle toutes les actions se passent, la POC n'a besoin que d'une seule vue                       //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class VuePrincipale{
    constructor(){
        this.html = document.getElementById("html-vue-principale").innerHTML;
    }

    afficher(){
        document.getElementsByTagName("body")[0].innerHTML = this.html;
        var region = new ZingTouch.Region(document.getElementById('parent')); 
        var target = document.getElementById('child');
        region.bind(target, 'swipe', evenement => this.actionSwipeFilm(evenement)); // Au lancement de l'application on bind la region swipable a notre fonction actionSwipeFilm
    }

    rafraichirFilm(filmPropose){ // On actualise le film a l'écran par le nouveau proposer par l'algorithme
        document.getElementById('child').style.background = "url('https://image.tmdb.org/t/p/w342"+filmPropose.backgroundpath+"')"; // Aspect graphique, a changer au moment du merge
        document.getElementById('child').style.backgroundSize = "contain";
        document.getElementById('child').style.backgroundPosition = "center";
        document.getElementById('titre-film').innerHTML = filmPropose.titre;
        this.film = filmPropose; // On enregiste le film en local de maniere a pouvoir agir dessus une fois le choix de l'utilisateur fait
    }

    detaillerFilm(film){
        //A coder quand on demande le detail d'un film
    }

    actionSwipeFilm(evenement){ // Executer quand un swipe est detecte
        var directionSwipe = evenement.detail.data[0].currentDirection; // On recupere l'orientation du swipe
        const margeErreur = 20; // "Marge" d'erreur pour savoir si le swipe est dans la bonne direction. EX : 340° = Swipe droite quand meme ; CHANGER SI BESOIN

        if(directionSwipe < 0+margeErreur || directionSwipe > 360-margeErreur){
            console.log("Swipe vers la droite");
            this.actionVouloirVoirFilm(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LA DROITE
        } else if(directionSwipe < 90+margeErreur && directionSwipe > 90-margeErreur){
            console.log("Swipe vers le haut");
            this.actionFilmVuAime(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LE HAUT
        } else if(directionSwipe < 180+margeErreur && directionSwipe > 180-margeErreur){
            console.log("Swipe vers la gauche");
            this.actionPasVouloirVoirFilm(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LA GAUCHE
        } else if(directionSwipe < 270+margeErreur && directionSwipe > 270-margeErreur){
            console.log("Swipe vers le bas");
            this.actionFilmVuNonAime(this.film.id);
            this.actionDemanderPropositionFilm();
            //APPELER FONCTION POUR SWIPE VERS LE BAS
        }
        
    }


    // INITIALISATION DE FONCTIONS //
    initialiserActionDemanderPropositionFilm(actionDemanderPropositionFilm){
        this.actionDemanderPropositionFilm = actionDemanderPropositionFilm;
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
    /////////////////////////////////
}