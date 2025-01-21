const express = require('express');
const { connectDB, pool } = require('./config/db');

const app = express();
const axios = require('axios');
const port = 9000; // Port yang akan digunakan

// const responsePopup = require("./data/sample_popup.json");
const { getLayerList, getPopupDetail, getDetailLayerList } = require('./services');
const { buildTree } = require('./utils/common');
const { response_error, response_success } = require('./utils/response');
const { Point, Radius, PointToBuffer, FeatureToWKT } = require('./utils/geometry');

// Connect to the database
connectDB();

// allow cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Middleware untuk parsing body dari JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Start Application');
});

// Endpoint to fetch WMS data from GeoServer
app.get('/wmsdata', async (req, res) => {
  try {
    const params = req.query;
    
    const url = `http://localhost:8080/geoserver/gis/wms`;
    const response = await axios.get(url, { params, responseType: 'arraybuffer'});
    res.send(response.data);
  } catch (error) {
    
  }
});

// Endpoint to fetch details of a specific feature where coordinates are provided
app.get('/popup', async (req, res) => {
  try {
    const { latitude, longitude, layers } = req.query;
    const parsedLayers = JSON.parse(layers);
    const point = Point(parseFloat(latitude), parseFloat(longitude));
    const buffered = PointToBuffer(point, 20);
    const wkt = FeatureToWKT(buffered);    

    const responsePopup = [];
    if(parsedLayers.length > 0) {
      for(i = 0; i < parsedLayers.length; i++) {
        const configLayer = await getDetailLayerList(parsedLayers[i]);
        const list_field = configLayer.map((item) => {
          if(item.field_name === "geom") {
            return "st_astext(geom) as geom";
          }

          return item.field_name;
        });
        
        const result = await getPopupDetail(wkt, parsedLayers[i], list_field);

        const fieldAliases = configLayer.reduce((acc, item) => {
          acc[item.field_name] = item.field_alias;
          return acc;
        }, {});

        if(fieldAliases.geom) {
          delete fieldAliases.geom;
        }

        const attributes = result.map((item) => {
          return configLayer.reduce((acc, field) => {
            acc[field.field_name] = item[field.field_name];
            return acc;
          }, {});
        })[0];

        if(attributes.geom) {
          delete attributes.geom;
        }
        
        const transformedResponse = {
          displayTitle: configLayer[0].name,
          fieldAliases: fieldAliases,
          attributes: attributes,
          geometryType: configLayer[0].geometry_type,
          geometry: result[0].geom,
        }

        responsePopup.push(transformedResponse);
      }
    }

    res.send(response_success({ message: 'Popup detail', data: responsePopup }));
  } catch (error) {
    
  }
});

app.get('/layerlist', async (req, res) => {
  try {
      const layers = await getLayerList();
      const layerTree = buildTree(layers);
      res.json(response_success({ message: 'List of layers', data: layerTree }));
  } catch (error) {
      console.error(error);
      res.status(500).json(response_error({ code: 500, message: 'Internal server error' }));
  }
});

// Running server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
