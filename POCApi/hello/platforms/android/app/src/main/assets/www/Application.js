//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controlleur de l'application                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Application{
    constructor(window, filmDAO, vuePrincipale, utilisateur){
        this.window = window;

        this.utilisateur = utilisateur;

        this.filmDAO = filmDAO;

        // Initialisation de fonction de filmDAO necessaire //
        this.filmDAO.initialiserActionRecevoirFilm(filmPropose => this.actionRecevoirFilm(filmPropose));
        this.filmDAO.initialiserActionDetaillerFilm(film => this.actionDetaillerFilm(film));
        //////////////////////////////////////////////////////

        this.vuePrincipale = vuePrincipale;

        // Initialisation des fonctions de vuePrincipale necessaires //
        this.vuePrincipale.initialiserActionDemanderPropositionFilm(()=> this.actionDemanderPropositionFilm());
        this.vuePrincipale.initialiserActionVouloirVoirFilm(id => this.actionVouloirVoirFilm(id));
        this.vuePrincipale.initialiserActionPasVouloirVoirFilm(id => this.actionPasVouloirVoirFilm(id));
        this.vuePrincipale.initialiserActionFilmVuAime(id => this.actionFilmVuAime(id));
        this.vuePrincipale.initialiserActionFilmVuNonAime(id => this.actionFilmVuNonAime(id));
        ///////////////////////////////////////////////////////////////

        vuePrincipale.afficher();
        this.filmDAO.proposerFilm(utilisateur); // On force la proposition d'un film au lancement
    }


    actionRecevoirFilm(filmPropose){
        console.log("ActionRecevoirFilm : " , filmPropose);
        this.vuePrincipale.rafraichirFilm(filmPropose);
    }

    actionDetaillerFilm(film){
        this.vuePrincipale.detaillerFilm(film);
    }
    
    // Fonctions liees a FilmDAO dans le constructeur //
    actionDemanderPropositionFilm(){
        this.filmDAO.proposerFilm(this.utilisateur);
    }

    actionVouloirVoirFilm(id){
        this.filmDAO.vouloirVoirFilm(id, this.utilisateur);
    }

    actionPasVouloirVoirFilm(id){
        this.filmDAO.pasVouloirVoirFilm(id, this.utilisateur);
    }

    actionFilmVuAime(id){
        this.filmDAO.filmVuAime(id, this.utilisateur);
    }

    actionFilmVuNonAime(id){
        this.filmDAO.filmVuNonAime(id, this.utilisateur);
    }
    ////////////////////////////////////////////////////
}

new Application(window, new FilmDAO(), new VuePrincipale(), "Yann");