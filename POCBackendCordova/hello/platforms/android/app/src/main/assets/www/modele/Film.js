//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modele Film, il contiens tout ce dont on peut avoir besoin pour l'instant                                    //
// Ajouter des champs est très simple et seulement pourraient etre utilise si il nous en viens le besoin        //
// Liste des champs possibles : https://api.themoviedb.org/3/movie/550?api_key=108344e6b716107e3d41077a5ce57da2 //
// On utilise actuellement : "title" , "id" , "overview" , "poster_path"                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Film{ 
    constructor(titre, id, description, backgroundpath){
        this.titre = titre;
        this.id = id;
        this.description = description;
        this.backgroundpath = backgroundpath;
    }
}