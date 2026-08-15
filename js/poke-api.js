const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKE_API_VERSION_ENDPOINT = 'version/13';

const POKEMON_API_NAME_BY_PRODUCT_ID = {
    2: 'mewtwo',
    5: 'pikachu',
    7: 'pikachu',
    8: 'pikachu',
    9: 'pikachu',
    10: 'pikachu',
    11: 'pikachu',
    12: 'rayquaza',
    13: 'raichu',
    14: 'pikachu',
    15: 'greninja',
    16: 'miraidon',
    17: 'pikachu',
    18: 'pikachu',
    19: 'charmander',
    21: 'venusaur',
    22: 'dialga'
};

const POKEMON_NAME_KEYWORDS = [
    'pikachu',
    'mewtwo',
    'rayquaza',
    'raichu',
    'greninja',
    'miraidon',
    'charmander',
    'venusaur',
    'dialga'
];

async function fetchPokeApi(endpoint) {
    const cleanEndpoint = String(endpoint || '').replace(/^\/+|\/+$/g, '');

    if (!cleanEndpoint) {
        throw new Error('PokeAPI endpoint is required.');
    }

    const response = await fetch(`${POKE_API_BASE_URL}/${cleanEndpoint}/`);

    if (!response.ok) {
        throw new Error(`PokeAPI request failed with status ${response.status}.`);
    }

    return response.json();
}

function getPokemonApiName(product) {
    if (!product) return null;
    if (POKEMON_API_NAME_BY_PRODUCT_ID[product.id]) {
        return POKEMON_API_NAME_BY_PRODUCT_ID[product.id];
    }

    const productName = product.name.toLowerCase();
    return POKEMON_NAME_KEYWORDS.find(name => productName.includes(name)) || null;
}

function formatPokeApiLabel(value) {
    return String(value || '')
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function escapePokeApiHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function renderPokemonApiMessage(message) {
    const apiContent = document.getElementById('pokemon-api-content');
    if (!apiContent) return;

    apiContent.innerHTML = `<p class="pokemon-api-message">${message}</p>`;
}

function getEnglishVersionName(version) {
    const englishName = version.names?.find(nameItem => nameItem.language?.name === 'en');
    return englishName?.name || formatPokeApiLabel(version.name);
}

function getDominantImageColor(imagePath) {
    return new Promise(resolve => {
        if (!imagePath) {
            resolve(null);
            return;
        }

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });
            const size = 48;
            canvas.width = size;
            canvas.height = size;
            context.drawImage(image, 0, 0, size, size);

            const pixels = context.getImageData(0, 0, size, size).data;
            let redTotal = 0;
            let greenTotal = 0;
            let blueTotal = 0;
            let count = 0;

            for (let index = 0; index < pixels.length; index += 16) {
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const tooLight = red > 238 && green > 238 && blue > 238;
                const tooDark = red < 18 && green < 18 && blue < 18;

                if (alpha < 180 || tooLight || tooDark) continue;

                redTotal += red;
                greenTotal += green;
                blueTotal += blue;
                count += 1;
            }

            if (count === 0) {
                resolve(null);
                return;
            }

            const red = Math.round(redTotal / count);
            const green = Math.round(greenTotal / count);
            const blue = Math.round(blueTotal / count);
            resolve(rgbToHex(red, green, blue));
        };
        image.onerror = () => resolve(null);
        image.src = imagePath;
    });
}

function rgbToHex(red, green, blue) {
    return `#${[red, green, blue]
        .map(value => value.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()}`;
}

function renderPokemonApiCard(pokemon) {
    const types = pokemon.types
        .map(typeItem => formatPokeApiLabel(typeItem.type.name))
        .join(', ');
    const abilities = pokemon.abilities
        .slice(0, 3)
        .map(abilityItem => formatPokeApiLabel(abilityItem.ability.name))
        .join(', ');
    const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
    const pokemonName = escapePokeApiHtml(formatPokeApiLabel(pokemon.name));

    return `
        <div class="pokemon-api-card">
            ${imageUrl ? `<img src="${escapePokeApiHtml(imageUrl)}" alt="${pokemonName} official artwork" width="110" height="110" loading="lazy" decoding="async">` : ''}
            <div>
                <h4>${pokemonName}</h4>
                <dl>
                    <div>
                        <dt>Type</dt>
                        <dd>${escapePokeApiHtml(types || 'Unknown')}</dd>
                    </div>
                    <div>
                        <dt>Height</dt>
                        <dd>${pokemon.height / 10} m</dd>
                    </div>
                    <div>
                        <dt>Weight</dt>
                        <dd>${pokemon.weight / 10} kg</dd>
                    </div>
                    <div>
                        <dt>Abilities</dt>
                        <dd>${escapePokeApiHtml(abilities || 'Unknown')}</dd>
                    </div>
                </dl>
            </div>
        </div>
    `;
}

function renderPokemonVersionCard(version, imageColor) {
    const versionName = escapePokeApiHtml(getEnglishVersionName(version));
    const versionGroup = escapePokeApiHtml(formatPokeApiLabel(version.version_group?.name));
    const colorValue = imageColor ? escapePokeApiHtml(imageColor) : 'Unavailable';

    return `
        <div class="pokemon-api-version-card">
            <h4>Game Version API</h4>
            <dl>
                <div>
                    <dt>Version ID</dt>
                    <dd>${version.id}</dd>
                </div>
                <div>
                    <dt>Name</dt>
                    <dd>${versionName}</dd>
                </div>
                <div>
                    <dt>Version Group</dt>
                    <dd>${versionGroup || 'Unknown'}</dd>
                </div>
                <div>
                    <dt>Color</dt>
                    <dd class="pokemon-color-value">
                        ${imageColor ? `<span class="pokemon-color-swatch" style="background-color: ${colorValue};"></span>` : ''}
                        ${colorValue}
                    </dd>
                </div>
            </dl>
        </div>
    `;
}

async function renderPokemonApiInfo(product) {
    const apiContent = document.getElementById('pokemon-api-content');
    if (!apiContent) return;

    const pokemonName = getPokemonApiName(product);
    renderPokemonApiMessage('Loading PokeAPI data...');

    try {
        const [pokemonResult, versionResult, colorResult] = await Promise.allSettled([
            pokemonName ? fetchPokeApi(`pokemon/${pokemonName}`) : Promise.resolve(null),
            fetchPokeApi(POKE_API_VERSION_ENDPOINT),
            getDominantImageColor(product?.image)
        ]);
        const imageColor = colorResult.status === 'fulfilled' ? colorResult.value : null;
        const contentBlocks = [];

        if (pokemonResult.status === 'fulfilled' && pokemonResult.value) {
            contentBlocks.push(renderPokemonApiCard(pokemonResult.value));
        } else {
            contentBlocks.push('<p class="pokemon-api-message">No matching Pokemon profile could be loaded for this product.</p>');
        }

        if (versionResult.status === 'fulfilled') {
            contentBlocks.push(renderPokemonVersionCard(versionResult.value, imageColor));
        } else {
            contentBlocks.push('<p class="pokemon-api-message">Pokemon version data could not be loaded right now.</p>');
        }

        apiContent.innerHTML = contentBlocks.join('');
    } catch (error) {
        renderPokemonApiMessage('PokeAPI data could not be loaded right now.');
    }
}
