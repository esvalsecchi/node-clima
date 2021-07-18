const axios = require("axios");
const fs = require("fs");

class Busquedas {
    historial = [];
    dbPath = "./db/database.json";
    constructor() {
        //TODO: LEER DB SI EXISTE
    }
    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: "5",
            language: "es",
        };
    }
    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: "metric",
            lang: "es",
        };
    }
    async buscarCiudades(lugar = "") {
        //peticion http
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
            });

            const resp = await instance.get();

            return resp.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return error;
        }
    }

    async getClima(lon, lat) {
        try {
            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: {...this.paramsOpenWeather, lat, lon },
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description,
            };
        } catch (error) {
            console.log(error);
        }
    }
    agregarHistorial(lugar = "") {
        if (this.historial.includes(lugar)) {
            return;
        } else {
            this.historial.unshift(lugar);
            this.historial = this.historial.splice(0, 5);
            this.guardarDB();
        }
    }
    guardarDB() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
    }
    leerDB() {
        if (!fs.existsSync(this.dbPath)) return null;

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
        this.historial = JSON.parse(info);
        return true;
    }
}

module.exports = Busquedas;