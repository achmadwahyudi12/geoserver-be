const { pool } = require('../config/db');

const getLayerList = async () => {
    const { rows } = await pool.query('SELECT * FROM layers');
    
    return rows;
};

const getDetailLayerList = async (layer) => {
    try {
        const { rows } = await pool.query(`select * from layers a join details_layers b on a.id = b.layer_id where a."key"='${layer}'`);
        // const { rows } = await pool.query(`select * from layers where "key"='${layer}'`);
        return rows;
    } catch (error) {
        console.error('Error in getDetailLayerList:', error);
        return null;
    }
};

const getPopupDetail = async (wkt, layer, list_field) => {
    try {
        const { rows } = await pool.query(`SELECT ${list_field} FROM ${layer} WHERE ST_Intersects(geom, ST_GeomFromText('${wkt}', 4326))`);
        // const { rows } = await pool.query(`SELECT ${list_field} FROM ${layer} WHERE ST_Intersects(shape, ST_GeomFromText('${wkt}', 4326))`);
        return rows;
    } catch (error) {
        console.error('Error in getPopupDetail:', error);
        return null;
    }
};

module.exports = { getLayerList, getPopupDetail, getDetailLayerList };