const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonPopup = document.getElementById('pokemonPopup');
const detailName = document.getElementById('pokemonName');
const detailImage = document.getElementById('pokemonImage');
const detailStats = document.getElementById('pokemonStats');
const detailMoves = document.getElementById('pokemonMoves');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}" data-url="${pokemon.url}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function showPokemonDetails(pokemon) {
    document.getElementById('pokemonName').textContent = pokemon.name;
    document.getElementById('pokemonImage').src = pokemon.photo;

    document.getElementById('attackBar').style.width = `${pokemon.attack / 256 * 100}%`;
    document.getElementById('defenseBar').style.width = `${pokemon.defense / 256 * 100}%`;
    document.getElementById('specialAttackBar').style.width = `${pokemon.specialAttack / 256 * 100}%`;
    document.getElementById('specialDefenseBar').style.width = `${pokemon.specialDefense / 256 * 100}%`;
    document.getElementById('speedBar').style.width = `${pokemon.speed / 256 * 100}%`;

    document.getElementById('attackValue').textContent = pokemon.attack;
    document.getElementById('defenseValue').textContent = pokemon.defense;
    document.getElementById('specialAttackValue').textContent = pokemon.specialAttack;
    document.getElementById('specialDefenseValue').textContent = pokemon.specialDefense;
    document.getElementById('speedValue').textContent = pokemon.speed;

    document.getElementById('pokemonPopup').style.display = 'flex';
}

window.addEventListener('click', (event) => {
    if (event.target === pokemonPopup) {
        pokemonPopup.style.display = 'none';
    }
});

document.querySelector('.close-btn').addEventListener('click', () => {
    pokemonPopup.style.display = 'none';
});

function addPokemonClickEvent() {
    const pokemonItems = document.querySelectorAll('.pokemon');
    pokemonItems.forEach(item => {
        item.addEventListener('click', () => {
            const pokemonId = item.getAttribute('data-id');
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
            
            fetch(url)
                .then(response => response.json())
                .then(pokemonDetail => {
                    const pokemon = {
                        name: pokemonDetail.name,
                        photo: pokemonDetail.sprites.other['official-artwork'].front_default,
                        stats: pokemonDetail.stats.map(stat => ({
                            name: stat.stat.name,
                            base_stat: stat.base_stat
                        })),
                        moves: pokemonDetail.moves.slice(0, 5).map(move => move.move.name) 
                    };
                    openPopup(pokemon);
                })
                .catch(error => console.error('Error fetching Pokemon details:', error));
        });
    });
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
        addPokemonClickEvent();
    });
}

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

loadPokemonItens(offset, limit);

function closePopup() {
    pokemonPopup.style.display = 'none';
}

function openPopup(pokemon) {
    const popup = document.getElementById('pokemonPopup');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonImage = document.getElementById('pokemonImage');
    const pokemonStats = document.getElementById('pokemonStats');
    const pokemonMoves = document.getElementById('pokemonMoves');

    pokemonName.textContent = pokemon.name;
    pokemonImage.src = pokemon.photo;

    pokemonStats.innerHTML = '<h3>Stats</h3>';
    pokemon.stats.forEach(stat => {
        const statElement = document.createElement('p');
        statElement.textContent = `${stat.name}: ${stat.base_stat}`;
        pokemonStats.appendChild(statElement);
    });

    pokemonMoves.innerHTML = '';
    pokemon.moves.forEach(move => {
        const moveElement = document.createElement('li');
        moveElement.textContent = move;
        pokemonMoves.appendChild(moveElement);
    });

    popup.style.display = 'flex';
}

pokemonList.addEventListener('click', (event) => {
    const clickedElement = event.target.closest('li.pokemon');
    if (!clickedElement) return;

    const pokemonId = clickedElement.getAttribute('data-id');
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(pokemonDetail => {
            const pokemon = {
                name: pokemonDetail.name,
                photo: pokemonDetail.sprites.other['official-artwork'].front_default,
                stats: pokemonDetail.stats.map(stat => ({
                    name: stat.stat.name,
                    base_stat: stat.base_stat
                })),
                moves: pokemonDetail.moves.slice(0, 5).map(move => move.move.name) 
            };
            openPopup(pokemon);
        });
});

document.querySelector('.close-btn').addEventListener('click', closePopup);

pokemonPopup.addEventListener('click', (event) => {
    if (event.target === pokemonPopup) {
        closePopup();
    }
});
