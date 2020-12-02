class Application{
	constructor(window, ){
		this.window = window;
		this.jeuxVideoDAO = jeuxVideoDAO;
		/*this.vueListeJeuxVideo = vueListeJeuxVideo;
		this.vueAjouterJeuVideo = vueAjouterJeuVideo;
		this.vueModifierJeuVideo = vueModifierJeuVideo;
		this.vueAjouterJeuVideo.initialiserActionAjouterJeuVideo(jeuVideo=>this.actionAjouterJeuVideo(jeuVideo));
		this.vueModifierJeuVideo.initialiserActionModifierJeuVideo(jeuVideo=>this.actionModifierJeuVideo(jeuVideo));*/
		
		/*this.vueListeJeuxVideo.initialiserListeJeuxVideo(this.jeuxVideoDAO.lister());
		this.vueListeJeuxVideo.afficher();*/
		
		this.vueJeuVideo = vueJeuVideo;
		
		
		this.window.addEventListener("hashchange",() =>this.naviguer());
		
		this.naviguer();
	} 
	

	naviguer(){
		let hash = window.location.hash;
		
		if(!hash){
			this.vueListeJeuxVideo.initialiserListeJeuxVideo(this.jeuxVideoDAO.lister());
			this.vueListeJeuxVideo.afficher();
		}
		else if(hash.match(/^#ajouter-jeuVideo/)){
			this.vueAjouterJeuVideo.afficher();
		}
		else if(hash.match(/^#modifier-jeuVideo\/([0-9]+)/)){
			
			let navigation = hash.match(/^#modifier-jeuVideo\/([0-9]+)/);
			//alert(navigation);
			let idJeuVideo = navigation[1];
			//alert(idJeuVideo);
			
			this.vueModifierJeuVideo.initialiserActionModifierJeuVideo(this.jeuxVideoDAO.lister()[idJeuVideo]);
			this.vueModifierJeuVideo.afficher();
		}
		else if (hash.match(/^#jeuVideo\/([0-9]+)/)){
			
			let navigation = hash.match(/^#jeuVideo\/([0-9]+)/);
			//alert(navigation);
			let idJeuVideo = navigation[1];
			//alert(idJeuVideo);
			
			this.vueJeuVideo.initialiserJeuVideo(this.jeuxVideoDAO.lister()[idJeuVideo]);
			this.vueJeuVideo.afficher();
		}
	}
	
	actionAjouterJeuVideo(jeuVideo){
		this.jeuxVideoDAO.ajouter(jeuVideo);
		this.window.location.hash = "#";
	}
	
	actionModifierJeuVideo(jeuVideo){
		this.jeuxVideoDAO.modifier(jeuVideo);
		this.window.location.hash = "#";
	}
	
}
new Application(window, new JeuxVideoDAO(), new VueListeJeuxVideo(), new VueAjouterJeuVideo(), new VueJeuVideo(), new VueModifierJeuVideo());

