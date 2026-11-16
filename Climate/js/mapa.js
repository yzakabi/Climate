const map = L.map('map').setView([-14.235, -51.9253], 4); // centro do Brasil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let estadosLayer = {};
let geojsonLayer;

fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson')
    .then(res => res.json())
    .then(data => {
        geojsonLayer = L.geoJSON(data, {
            style: {
                color: '#333',
                weight: 1,
                fillColor: '#ddd',
                fillOpacity: 0.6
            },
            onEachFeature: (feature, layer) => {
                const sigla = getSiglaFromName(feature.properties.name);
                if (sigla) estadosLayer[sigla] = layer;

                layer.on({
                    mouseover: e => e.target.setStyle({ fillColor: '#4caf50' }),
                    mouseout: e => e.target.setStyle({ fillColor: '#ddd' })
                });
            }
        }).addTo(map);
    });

function getSiglaFromName(nome) {
    const mapa = {
        "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
        "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
        "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
        "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
        "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
        "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
        "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
    };
    return mapa[nome];
}

// Seletor de estado
const estadoSelect = document.getElementById('estadoSelect');
const spContent = document.getElementById('sp-content');

estadoSelect.addEventListener('change', function () {
    const sigla = this.value;

    // Mostrar ou esconder conteúdo extra
    spContent.style.display = (sigla === 'SP') ? 'flex' : 'none';

    // Destacar no mapa
    if (sigla && estadosLayer[sigla]) {
        const layer = estadosLayer[sigla];
        map.fitBounds(layer.getBounds());

        geojsonLayer.eachLayer(l => geojsonLayer.resetStyle(l));
        layer.setStyle({ fillColor: '#2196f3', fillOpacity: 0.8 });
    }
});
