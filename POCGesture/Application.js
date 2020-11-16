var counter = 0;
var region = new ZingTouch.Region(document.getElementById('parent'));
var target = document.getElementById('child');

region.bind(target, 'swipe', function(e){
    counter++;
    document.getElementById('output').innerHTML = 
    "Nombre de swipes detectes depuis lancement : " + counter + " fois";
    console.log(e.detail.data[0].currentDirection);
    var dir = e.detail.data[0].currentDirection;

    var margeErreur = 20; // "Marge" d'erreur pour savoir si le swipe est dans la bonne direction. EX : 340° = Swipe droite quand meme ; CHANGER SI BESOIN

    if(dir < 0+margeErreur || dir > 360-margeErreur){
        console.log("Swipe vers la droite");
        //APPELER FONCTION POUR SWIPE VERS LA DROITE
    } else if(dir < 90+margeErreur && dir > 90-margeErreur){
        console.log("Swipe vers le haut");
        //APPELER FONCTION POUR SWIPE VERS LE HAUT
    } else if(dir < 180+margeErreur && dir > 180-margeErreur){
        console.log("Swipe vers la gauche");
        //APPELER FONCTION POUR SWIPE VERS LA GAUCHE
    } else if(dir < 270+margeErreur && dir > 270-margeErreur){
        console.log("Swipe vers le bas");
        //APPELER FONCTION POUR SWIPE VERS LE BAS
    }
})