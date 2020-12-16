function choixAlerte(code) {
  switch(code) {
    case "auth/wrong-password":
      afficherAlerte(ERREUR_MOT_DE_PASSE_INCORRECT, "erreur");
      break;
    case "auth/weak-password":
      afficherAlerte(ERREUR_MOT_DE_PASSE_PAS_ASSEZ_SECURISE, "erreur");
      break;
    case "auth/invalid-email":
      afficherAlerte(ERREUR_EMAIL_INVALIDE, "erreur");
      break;
    case "auth/email-already-exists":
      afficherAlerte(ERREUR_EMAIL_DEJA_UTILISE, "erreur");
      break;
    case "auth/email-already-in-use":
      afficherAlerte(ERREUR_EMAIL_DEJA_UTILISE, "erreur");
      break;
    case "auth/too-many-requests":
      afficherAlerte(ERREUR_TROP_DE_TENTATIVES, "erreur");
      break;
    case "auth/invalid-display-name":
      afficherAlerte(ERREUR_PSEUDO_INVALIDE, "erreur");
      break;
    case "auth/user-not-found":
      afficherAlerte(ERREUR_EMAIL_INVALIDE, "erreur");
      break;
    case "auth/requires-recent-login":
      afficherAlerte(ERREUR_CONNEXION_RECENTE_REQUISE, "erreur");
      break;
    case "utilisateur_inconnu":
      afficherAlerte(ERREUR_UTILISATEUR_INCONNU, "erreur");
      break;
    case "ajout_de_soi_en_ami":
      afficherAlerte(ERREUR_AJOUT_DE_SOI_EN_AMI, "erreur");
      break;
    case "demande_ami_deja_envoyee":
      afficherAlerte(ERREUR_DEMANDE_AMI_DEJA_ENVOYEE, "erreur");
      break;
    case "deja_ami":
      afficherAlerte(ERREUR_DEJA_AMI, "erreur");
      break;
    case "miseAJourEffectuee":
      afficherAlerte(SUCCES_MISE_A_JOUR, "succes");
      break;
    case "demandeAmiEnvoyee":
      afficherAlerte(SUCCES_DEMANDE_AMI, "succes");
      break;
    default:
      alert(code);
  }
}

function afficherAlerte(message, type) {
  if (type === "erreur") {
    document.getElementById("alerte").style.color = "red";
  } else if (type === "succes") {
    document.getElementById("alerte").style.color = "green";
  }
  document.getElementById("alerte").innerHTML = message;
}

// Créé un objet erreur personnalisé
function exceptionPersonnalisee(code) {
  console.log("   exceptionPersonnalisee()");
  const objetErreur = new Error("Erreur personnalisée");
  objetErreur.code = code;
  throw objetErreur;
}
