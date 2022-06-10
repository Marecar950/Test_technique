import React, {useState} from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, ChakraProvider} from '@chakra-ui/react';
import Axios from 'axios';

const Application = () => {

  const [data, setData] = useState([]);
  
    Axios.get('http://localhost:3001/api/utilisateur').then(res => setData(res.data));    // Récupération des données avec axios.
    
  const Supprimer_element = (id) => {               // Suppression de la donnée sur BackEnd avec un bouton.
  const response = Axios.delete(`http://localhost:3001/api/utilisateur/${id}`);
 
  if (response.data) {
    setData(response.data);
  }
};

  const Affichage = () => {
    return data.map(donnee => {
      return (
        <Tr>
          <Td>{donnee.id}</Td>
          <Td>{donnee.etablissement_type}</Td>
          <Td>{donnee.etablissement}</Td> 
          <Td>{donnee.location}</Td> 
          <Td>{donnee.address}</Td> 
          <Td>{donnee.mail}</Td>
          <Td><button className="bouton_supprimer" onClick={() => Supprimer_element(donnee.id)}>Supprimer</button></Td>
        </Tr>
      )
    })
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
        <Tbody>{Affichage()}</Tbody>
      </Table>
    </ChakraProvider>
    </div>
  )
};

export default Application;
