import React, { useEffect, useState } from 'react'
import PokemonThumb from './components/PokemonThumb'
import PokemonDetails from './components/PokemonDetails'
import './App.css';
import axios from 'axios';

const App = () => {

   const[allPokemons, setAllPokemons] = useState([])
   const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=20')

  const [pokemonName,setPokemonName] = useState("");
  const [pokemonChosen,setPokemonChosen]=useState(false);
  const [pokemon, setPokemon] = useState({
    name:"",
    species:"",
    img:"",
    hp:"",
    attack:"",
    defense:"",
    type:"",
  });

  const searchPokemon=()=>{
    console.log(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(
      (response)=>{
        setPokemon({
          name:pokemonName,
          species: response.data.species.name,
          img: response.data.sprites.front_default,
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        setPokemonChosen(true)
      }
    )
  }

  const getAllPokemons = async () => {
    const res = await fetch(loadMore)
    const data = await res.json()

    setLoadMore(data.next)

    function createPokemonObject(results)  {
      results.forEach( async pokemon => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const data =  await res.json()
        setAllPokemons( currentList => [...currentList, data])
        await allPokemons.sort((a, b) => a.id - b.id)
      })
    }
    createPokemonObject(data.results)
  }

 useEffect(() => {
  getAllPokemons()
 }, [])

  return (
    <div className="app-contaner">
      
      <div className="pokemon-container">
      <div className='App'>
        <div className='TitleSection'>
          <h1>Pokemon State</h1>
          <input
          type="text"
          onChange={(event)=>{
            setPokemonName(event.target.value);
          }}
          />
          <button onClick={searchPokemon}>Search Pokemon</button>
        </div>
        <div>
          {!pokemonChosen ? (
            <h1>Please choose a pokemon</h1>
          ):(
            <>
              <h1>{pokemon.name}</h1>
              <img>src={pokemon.img}</img>
              <h3>species={pokemon.species}</h3>
              <h3>type={pokemon.type}</h3>
              <h4>type={pokemon.hp}</h4>
              <h4>attack={pokemon.attack}</h4>
              <h4>defense{pokemon.defense}</h4>
            </>
          )}
        </div>
       </div>

        <div className="all-container">
          {allPokemons.map( (pokemonStats, index) => 
            <PokemonThumb
              key={index}
              id={pokemonStats.id}
              image={pokemonStats.sprites.other.dream_world.front_default}
              name={pokemonStats.name}
              type={pokemonStats.types[0].type.name}
              
            />
            )}
        </div> 
        
          <button className="load-more" onClick={() => getAllPokemons()}>Load more</button>
      </div>
    </div>
  );
}

export default App;