class Application{

	import Vue from "vue";
	import App from "./App";

	constructor(window, ){
		this.window = window;
			
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
		/*else if(hash.match(/^#ajouter-jeuVideo/)){
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
		}*/
	}
	
	actionAjouterJeuVideo(jeuVideo){
		this.jeuxVideoDAO.ajouter(jeuVideo);
		this.window.location.hash = "#";
	}
	
	actionModifierJeuVideo(jeuVideo){
		this.jeuxVideoDAO.modifier(jeuVideo);
		this.window.location.hash = "#";
	}

	Vue.config.productionTip = false;

	new Vue({
		el: "#app",
		components: { App },
		template: "<App/>"
	});
	
	
	new Application(window, new JeuxVideoDAO(), new VueListeJeuxVideo(), new VueAjouterJeuVideo(), new VueJeuVideo(), new VueModifierJeuVideo());

}

