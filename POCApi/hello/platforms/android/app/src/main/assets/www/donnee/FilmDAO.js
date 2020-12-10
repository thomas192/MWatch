class FilmDAO{
    constructor(){
        this.bddSimuleeDAO = new BddSimuleeDAO();
    }

    proposerFilm(utilisateur){
        var genreAime = this.bddSimuleeDAO.getGenreAime(utilisateur); // On demande a la BDD les genres aimes par l'utilisateur
        console.log("DEBUG : genreAIme" + genreAime);
        var genreExistant = this.getListeFilm(); // On récupère la liste de genre disponible dans l'API
        var genreAimeID = []; 
        genreAime.forEach(element => genreAimeID.push(genreExistant[element])); // On fait match les genre aime par l'utilisateur et leurs ID, resultats stocke dans genreAimeID

        var nombreDeGenreAUtiliser = 1 + (Math.floor(Math.random()*Math.floor(genreAimeID.length-1))%4); // Determination du nombre de genre a utiliser (5 maximum)
        console.log("DEBUG : nombreDeGenreAUtiliser = " + nombreDeGenreAUtiliser);
        var genreAUtiliser = [];
        for(let i = 0 ; i < nombreDeGenreAUtiliser ; i++) // Choix au hasard des genres a utiliser pour la requête, possibilité de plusieurs fois le même, mais pris en compte par API
        {
            let index = Math.floor(Math.random()*Math.floor(nombreDeGenreAUtiliser));
            console.log("DEBUG : genre a utiliser " + i + " : " + genreAimeID[index]);
            genreAUtiliser.push(genreAimeID[index]);
        }
        var film;
        let genresString = "";
        genreAUtiliser.forEach(element => genresString += element + ","); // Passage de la liste de genre sous format string
        let url = "https://api.themoviedb.org/3/discover/movie?api_key=108344e6b716107e3d41077a5ce57da2&language=fr-FR&include_adult=false&with_genres="+genresString+"&page=1"

        var request = new XMLHttpRequest(); 
        request.open('GET', url); // Ouverture de la requête API
        request.responseType = 'json';
        request.send();
        var bdd = this.bddSimuleeDAO;
        var actionRecevoirFilm = this.actionRecevoirFilm;
        request.onload = function()
        {
            //var bddSimulee = new BddSimuleeDAO();
            var idFilm = -1;
            let reponse = request.response;
            for(let i = 0 ; i < reponse['results'].length && idFilm == -1 ; i++) // On navigue a travers tout les films retournés par l'API
            { 
                if(!bdd.isInBdd(reponse['results'][i]['id'])) // Si l'ID du film n'est pas présent dans la BDD on peut le proposer
                {
                    idFilm = reponse['results'][i]['id'];
                    film = new Film(reponse['results'][i]['title'], reponse['results'][i]['id'], reponse['results'][i]['overview'], reponse['results'][i]['poster_path']);
                }
            }
            console.log("DEBUG : idFilm interessant -> " + idFilm);
            actionRecevoirFilm(film);
        }
        return film;
        // Appel callback ??? https://stackoverflow.com/questions/7434371/image-onload-function-with-return
    }

    getListeFilm(){ // Renvoie la liste des genres et les ids correspondant, possible d'avoir le même resultat via requete API mais mieux vaut limiter les appels
        var dict = {};
        dict["Action"] = 28;
        dict["Aventure"] = 12;
        dict["Animation"] = 16;
        dict["Comédie"] = 35;
        dict["Crime"] = 80;
        dict["Documentaire"] = 99;
        dict["Drame"] = 18;
        dict["Familial"] = 10751;
        dict["Fantastique"] = 14;
        dict["Histoire"] = 36;
        dict["Horreur"] = 27;
        dict["Musique"] = 10402;
        dict["Mystère"] = 9648;
        dict["Romance"] = 10749;
        dict["Science-Fiction"] = 878;
        dict["Téléfilm"] = 10770;
        dict["Thriller"] = 53;
        dict["Guerre"] = 10752;
        dict["Western"] = 37;
        return dict;
    }

    vouloirVoirFilm(id, utilisateur){
        this.bddSimuleeDAO.utilisateurVouloirVoirFilm(id, utilisateur);
    }

    pasVouloirVoirFilm(id, utilisateur){
        this.bddSimuleeDAO.utilisateurPasVouloirVoirFilm(id, utilisateur);
    }

    filmVuAime(id, utilisateur){
        this.bddSimuleeDAO.utilisateurFilmVuAime(id, utilisateur);
    }

    filmVuNonAime(id, utilisateur){
        this.bddSimuleeDAO.utilisateurFilmVuNonAime(id, utilisateur);
    }

    initialiserActionRecevoirFilm(actionRecevoirFilm){
        this.actionRecevoirFilm = actionRecevoirFilm;
    }
}