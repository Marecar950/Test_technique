const express = require('express')
const app = express()
const cors = require('cors')
const donnee_json = require('./MOCK_DATA.json')
const port = 3001

app.use(express.json())
app.use(cors())

app.post('/api/utilisateur', (req, res) => {                                 // Création d'un nouvel élément.
  const newUtilisateur = {
    id: donnee_json.length + 1,
    etablissement_type: req.body.etablissement_type,
    etablissement: req.body.etablissement,
    location: req.body.location,
    address: req.body.address,
    mail: req.body.mail
  }

  if(!req.body.etablissement_type || !req.body.etablissement || !req.body.location || !req.body.address || !req.body.mail) {
    return res.status(401).send({ erreur: 'Veuillez remplir tous les champs !'})
  } 
    
  else {
    donnee_json.push(newUtilisateur)
    res.status(201).send(newUtilisateur)
  }
})
 
app.delete('/api/utilisateur/:utilisateurID', (req, res) => {               // Suppression d'un élémént à l'aide de son ID.      
  const id = Number(req.params.utilisateurID)
  const index = donnee_json.findIndex(user => user.id === id)
  
    if (index === -1) {
      res.send({ erreur: "id n'a pas été trouvé !"})
  } 
    else {
      donnee_json.splice(index,1)
      res.status(200).send(donnee_json[index])
  }
})

app.put('/api/utilisateur/:utilisateurID', (req, res) => {                 // Modification d'un élémént à l'aide de son ID.
  const id = Number(req.params.utilisateurID)
  const index = donnee_json.find(user => user.id === id)  
  
  if(index === -1) {
    return res.status(404).send({ erreur: "id n'a pas été trouvé !"})
 } 
  else {
  
   index.etablissement_type = req.body.etablissement_type,
   index.etablissement = req.body.etablissement,
   index.location = req.body.location,
   index.address = req.body.address,
   index.mail = req.body.mail,
   
   res.status(200).send(index)
 }
}) 

app.get('/api/utilisateur/:etablissement', (req, res) => {               // Obtention d'un élément à l'aide de son nom.
  const etablissement = req.params.etablissement
  const data = donnee_json.find(user => user.etablissement === etablissement)
  
  if (!data) {
    return res.status(404).send({ erreur: "Les données n'ont pas été trouvés !"})
 }  
  else {
    res.status(200).send(data)
 }
}) 

app.get('/api/utilisateur', (req, res) => {                              // Obtention de tous les éléments d'un tableau json.
    res.status(200).send(donnee_json)
})     

app.get('/api/etablissement', (req, res) => {                           // Obtention de la somme d'un secteur d'activité donné.
  res.json(donnee_json.reduce((etablissement_secteur, current) => {
    
  if (etablissement_secteur[current.etablissement] === current.location ) {
    etablissement_secteur[current.etablissement] ++ 
 }
  else {
    etablissement_secteur[current.etablissement] = 1
 }
   return etablissement_secteur
 }, {}))
})

app.get('/api/location', (req, res) => {                             // Obtention de la somme d'une ville donnée.
  res.json(donnee_json.reduce((ville, current) => {
    
  if (ville[current.location]) {
    ville[current.location]++
 }
  else {
    ville[current.location] = 1
 }
   return ville
 }, {}))
})
 
app.get('/api/secteur_ville', (req, res) => {                        // Obtention de la somme d'un secteur d'activité dans une ville donnée
  res.json(donnee_json.map(function(ville) {
    return {
      location: ville.location,
      etablissement_type: donnee_json.filter(function(a) {
        return a.location === ville.location
 }).reduce(function(somme, b) {
   
  if (somme[b.etablissement_type]) {
    somme[b.etablissement_type]++
 }
  else {
    somme[b.etablissement_type] = 1
 }
   return somme
  }, {})
  };
 }).filter((objet, position, array) => {
      return array.map(mapObjet => mapObjet.location).indexOf(objet.location) == position
 }))
})
   
app.get('/api/etablissement_Ville', (req, res) => {       // Obtention de tous les établissements en fonction d'une ville donnée
  res.json(donnee_json.map(function(ville_donnee) {
    return {
      location: ville_donnee.location,
      etablissement_type: donnee_json.filter(function(b) {
      
    return b.location === ville_donnee.location
 }).map(function(Obtenir) {
  
    return Obtenir.etablissement_type
 })
  };
 }).filter((obj, pos, arr) => {
 
    return arr.map(mapObjet => mapObjet.location).indexOf(obj.location) == pos
 }))
})

app.get('/api/etablissement_secteur_ville', (req, res) => {    // Obtention de tous les établissements en fonction du secteur et de la ville
  res.json(donnee_json.map(function(Ville) {
    return {
      location: Ville.location,
      etablissement: donnee_json.filter(function(d) {
      
    return d.location === Ville.location
 }).map(function(Obtenir) {
  
    return Obtenir.etablissement
 }),
      etablissement_type: donnee_json.filter(function(c) {
      
    return c.location === Ville.location
 }).filter((OBJ, POS, ARR) => {
 
    return ARR.map(mapObjet => mapObjet.etablissement_type).indexOf(OBJ.etablissement_type) == POS
 }).map(function(secteur) {
  
    return secteur.etablissement_type
 })
 };
 }).filter((Obj, Pos, Arr) => {
 
    return Arr.map(MapObjet => MapObjet.location).indexOf(Obj.location) == Pos
 }))
})

app.delete('/api/etablissement_ville/:Ville', (req, res) => {     // Suppression de tous les établissements d'une ville
  const ville = req.params.Ville
  const index = donnee_json.filter(VILLE => VILLE.location === ville)
  
    donnee_json.filter(function(filtrer) {
  
    return filtrer.location === ville
 }).map(function(suppr) {
  
    return delete suppr["etablissement"]  
 })
   res.status(200).send(index); 
})

app.delete('/api/etablissement_secteur/:Secteur', (req, res) => {    // Suppression de tous les établissements d'un secteur d'activité

  const secteur = req.params.Secteur
  const Index = utilisateur.filter(SECTEUR => SECTEUR.etablissement_type === secteur)
  
    donnee_json.filter(function(filtrer) {
  
    return filtrer.etablissement_type === secteur
 }).map(function(Suppr) {
  
    return delete Suppr["etablissement"]  
 })
  res.status(200).send(Index); 
})
   
app.listen(port, () => {
  console.log("Serveur à l'écoute sur le port " + port + ".")
}) 
