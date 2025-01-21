const buildTree = (layers) => {
    const map = {};
    
    // Buat map dari layer dengan key sebagai identifier
    layers.forEach(layer => {
        map[layer.key] = { ...layer, children: [] };
    });
    
    const items = Object.values(map);
    const mapById = {};

    // Initialize the map by id
    items.forEach(item => {
        mapById[item.id] = { ...item, children: [] };
    });

    const result = [];

    // Build the hierarchy
    items.forEach(item => {
        if (item.parent_id === null) {
        result.push(mapById[item.id]);
        } else {
        mapById[item.parent_id].children.push(mapById[item.id]);
        }
    });

    return result;
};

module.exports = { buildTree };