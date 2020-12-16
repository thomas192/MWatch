function choixAlerte(codeErreur) {
  switch(codeErreur) {
    case "auth/wrong-password":
      afficherAlerte(ERREUR_MOT_DE_PASSE_INCORRECT, "rouge");
      break;
    case "auth/weak-password":
      afficherAlerte(ERREUR_MOT_DE_PASSE_PAS_ASSEZ_SECURISE, "rouge");
      break;
    case "auth/invalid-email":
      afficherAlerte(ERREUR_EMAIL_INVALIDE, "rouge");
      break;
    case "auth/email-already-exists":
      afficherAlerte(ERREUR_EMAIL_DEJA_UTILISE, "rouge");
      break;
    case "auth/email-already-in-use":
      afficherAlerte(ERREUR_EMAIL_DEJA_UTILISE, "rouge");
      break;
    case "auth/too-many-requests":
      afficherAlerte(ERREUR_TROP_DE_TENTATIVES, "rouge");
      break;
    case "auth/invalid-display-name":
      afficherAlerte(ERREUR_PSEUDO_INVALIDE, "rouge");
      break;
    case "auth/user-not-found":
      afficherAlerte(ERREUR_EMAIL_INVALIDE, "rouge");
      break;
    case "auth/requires-recent-login":
      afficherAlerte(ERREUR_CONNEXION_RECENTE_REQUISE, "rouge");
      break;
    case "utilisateur_inconnu":
      afficherAlerte(ERREUR_UTILISATEUR_INCONNU, "rouge");
      break;
    case "ajout_de_soi_en_ami":
      afficherAlerte(ERREUR_AJOUT_DE_SOI_EN_AMI, "rouge");
      break;
    case "demande_ami_deja_envoyee":
      afficherAlerte(ERREUR_DEMANDE_AMI_DEJA_ENVOYEE, "rouge");
      break;
    case "deja_ami":
      afficherAlerte(ERREUR_DEJA_AMI, "rouge");
      break;
    default:
      alert(codeErreur);
  }
}

function afficherAlerte(message, couleur) {
  if (couleur === "rouge") {
    document.getElementById("alerte-verte").innerHTML = "";
    document.getElementById("alerte-rouge").innerHTML = message;

  } else if (couleur === "verte") {
    document.getElementById("alerte-rouge").innerHTML = "";
    document.getElementById("alerte-verte").innerHTML = message;
  }
}

// Créé un objet erreur personnalisé
function exceptionPersonnalisee(code) {
  console.log("   exceptionPersonnalisee()");
  const objetErreur = new Error("Erreur personnalisée");
  objetErreur.code = code;
  throw objetErreur;
}
