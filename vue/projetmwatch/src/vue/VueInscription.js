class VueInscription{
	
	constructor(){
		this.html = document.getElementById("html-vue-inscription").innerHTML;
		this.actionInscription = null;
	}
	
	initialiserActionInscription(actionInscription){
		this.actionInscription = actionInscription;
	}
	
	afficher(){
		document.getElementsByTagName("body")[0].innerHTML = this.html;
		document.getElementById("formulaire-inscription").addEventListener("submit",evenement => this.enregistrer(evenement));
	}
	
	enregistrer(evenement){
		evenement.preventDefault();
		
		let courriel = document.getElementById("inscription-courriel").value;
		let motdepasse = document.getElementById("inscription-motdepasse").value;
		let repetemdp = document.getElementById("inscription-repetemdp").value;
		
		
		this.actionInscription(new Compte(courriel,motdepasse,repetemdp, null));
	}
	
	
}