import React, {useState, useEffect} from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, ChakraProvider} from '@chakra-ui/react';
import Axios from 'axios';

const Application = () => {

  const [data, setData] = useState([]);
  
   useEffect(() => {
    Axios.get('https://nodejs-express-json.herokuapp.com/api/etablissement').then(res => {          // Récupération des données de BackEnd avec axios.
      setData(res.data);
     });
    }, [data]);
     
  const Supprimer = (id) => {                                                                       // Suppression de la donnée sur BackEnd avec un bouton.
    Axios.delete(`https://nodejs-express-json.herokuapp.com/api/etablissement/${id}`);
  }; 

  const Affichage = () => {
    return data.map((donnee, index) => {
      return (

        <Tr key={index}>
          <Td>{donnee.id}</Td>
          <Td>{donnee.etablissement_type}</Td>
          <Td>{donnee.etablissement}</Td> 
          <Td>{donnee.location}</Td> 
          <Td>{donnee.address}</Td> 
          <Td>{donnee.mail}</Td>
          <Td><button className="bouton_supprimer" onClick={() => Supprimer(donnee.id)}>Supprimer</button></Td>
        </Tr>
      );
    });
  };

  return (
   <div>
    <ChakraProvider>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>etablissement_type</Th>
              <Th>etablissement</Th>
              <Th>location</Th>
              <Th>address</Th>
              <Th>mail</Th>
            </Tr>
          </Thead>
          
          <Tbody>
            {Affichage()}
          </Tbody>
        </Table>
    </ChakraProvider>
   </div>
  );
};

export default Application;
