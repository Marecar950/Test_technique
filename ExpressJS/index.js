const express = require('express');
const app = express();
const cors = require('cors');
const donnee_json = require('./MOCK_DATA.json');
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.post('/api/etablissement', (req, res) => {                                 // Création d'un nouvel élément en vérifiant la validité des valeurs
  const newEtablissement = {
    id: donnee_json.length + 1,
    etablissement_type: req.body.etablissement_type,
    etablissement: req.body.etablissement,
    location: req.body.location,
    address: req.body.address,
    mail: req.body.mail
  };

  if(!req.body.etablissement_type || !req.body.etablissement || !req.body.location || !req.body.address || !req.body.mail) {
    res.status(401).send({erreur: 'Veuillez remplir tous les champs !'});
  }  
  else {
    donnee_json.push(newEtablissement);
    res.status(201).send({success: "Le nouveau élément à bien été inséré"});
  }
});
 
app.delete('/api/etablissement/:etablissementID', (req, res) => {               // Suppression d'un élément à l'aide de son ID.      
  const id = req.params.etablissementID;
  const index = donnee_json.findIndex(element => element.id == id);
  
  if (index == -1) {
    res.status(404).send({erreur: "L'élément n'a pas été trouvé !"});
  } 
  else {
    donnee_json.splice(index, 1);
    res.send({success: "L'élément a bien été supprimé."});
  }
});

app.put('/api/etablissement/:etablissementID', (req, res) => {                 // Modification d'un élément à l'aide de son ID.
  const id = Number(req.params.etablissementID);
  const { etablissement_type, etablissement, location, address, mail } = req.body;
  const index = donnee_json.find(element => element.id === id); 
  
  if(!index) {
    res.status(404).send({erreur: "L'élément n'a pas été trouvé !"});
  } 
  
  if (etablissement_type) index.etablissement_type = etablissement_type;
  if (etablissement) index.etablissement = etablissement;
  if (location) index.location = location;
  if (address) index.address = address;
  if (mail) index.mail = mail;
  
    res.send({success: "L'élément a bien été mis à jour"});
}); 

app.get('/api/etablissement/:etablissement', (req, res) => {                   // Obtention d'un élément à l'aide de son nom.
  const etablissement = req.params.etablissement;
  const data = donnee_json.find(element => element.etablissement === etablissement);
  
  if (!data) {
    res.status(404).send({erreur: "Aucune résultat !"});
 }  
  else {
    res.send(data);
 }
}); 
     
app.get('/api/somme/secteur', (req, res) => {                                  // Obtention de la somme d'un secteur d'activité donné.
  res.json(donnee_json.reduce((etablissement_secteur, current) => {
    
  if (etablissement_secteur[current.etablissement_type]) {
    etablissement_secteur[current.etablissement_type] ++; 
 }
  else {
    etablissement_secteur[current.etablissement_type] = 1;
 }
   return etablissement_secteur;
 }, {}));
});

app.get('/api/somme/ville', (req, res) => {                                    // Obtention de la somme d'une ville donnée.
  res.json(donnee_json.reduce(function(ville, actuel) {
    
  if (ville[actuel.location]) {
    ville[actuel.location]++;
 }
  else {
    ville[actuel.location] = 1;
 }
   return ville;
 }, {}));
});
 
app.get('/api/somme/secteur_ville', (req, res) => {                            // Obtention de la somme d'un secteur d'activité dans une ville donnée
  res.json(donnee_json.map(function(ville) {
    return {
      location: ville.location,
      etablissement_type: donnee_json.filter(function(a) {
      
    return a.location == ville.location;
    }).reduce(function(somme_secteur, b) {
   
    if (somme_secteur[b.etablissement_type]) {
      somme_secteur[b.etablissement_type]++;
    }
    else {
      somme_secteur[b.etablissement_type] = 1;
    }
    return somme_secteur;
    }, {})
   };
   }).filter((value, index, array) => {
    return array.map(VILLE => VILLE.location).indexOf(value.location) == index;
   }));
});
   
app.get('/api/etablissement_ville', (req, res) => {                            // Obtention de tous les établissements en fonction d'une ville donnée
  res.send(donnee_json.map(function(ville_donnee) {
    return {
      location: ville_donnee.location,
      etablissement: donnee_json.filter(function(b) {
      
    return b.location === ville_donnee.location;
    }).map(function(Obtenir) {
  
    return Obtenir.etablissement;
    })
    };
    }).filter((valeur, Index, tableau) => {
 
    return tableau.map(Ville => Ville.location).indexOf(valeur.location) === Index;
  }));
});

app.get('/api/etablissement_secteur_ville', (req, res) => {                    // Obtention de tous les établissements en fonction du secteur et de la ville
  res.json(donnee_json.map(function(Ville) {
    return {
      location: Ville.location,
      etablissement_type: donnee_json.filter(function(c) {
      
    return c.location === Ville.location;
    }).filter((Valeur, INDEX, Tableau) => {
 
    return Tableau.map(secteur => secteur.etablissement_type).indexOf(Valeur.etablissement_type) == INDEX;
    }).map(function(secteur) {
  
    return secteur.etablissement_type;
    }),
      etablissement: donnee_json.filter(function(d) {
      
    return d.location === Ville.location;
    }).map(function(obtenir) {
  
    return obtenir.etablissement;
    }),
    };
    }).filter((value, index, tableau) => {
 
    return tableau.map(ville => ville.location).indexOf(value.location) == index;
  }));
});

app.delete('/api/etablissement_ville/:Ville', (req, res) => {                  // Suppression de tous les établissements d'une ville
  const ville = req.params.Ville;
  const index = donnee_json.filter(VILLE => VILLE.location == ville);
  
    donnee_json.filter(function(filtrer) {
  
    return filtrer.location == ville;
    }).map(function(suppr) {
  
    delete suppr["etablissement"];  
    });
    res.send({success: "La suppression de tous les établissements d'une ville a bien été effectué"}); 
});

app.delete('/api/etablissement_secteur/:Secteur', (req, res) => {              // Suppression de tous les établissements d'un secteur d'activité

  const secteur = req.params.Secteur;
  const Index = donnee_json.filter(SECTEUR => SECTEUR.etablissement_type === secteur);
  
    donnee_json.filter(function(Filtrer) {
  
    return Filtrer.etablissement_type === secteur;
    }).map(function(Suppr) {
  
    delete Suppr["etablissement"];  
    });
    res.send({success: "La suppression de tous les établissements d'un secteur d'activité a bien été effectué"}); 
});
   
app.get('/api/etablissement', (req, res) => {                              // Obtention de tous les éléments d'un tableau json.
    res.send(donnee_json);
});   
   
app.listen(port, () => {
  console.log(`Serveur à l'écoute sur le port ${port}`);
}); 
