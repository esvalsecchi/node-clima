require("dotenv").config();
const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    console.clear();

    let opt;
    const busquedas = new Busquedas();
    busquedas.leerDB();

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1: //Buscar ciudad
                console.log("Buscar Ciudad");
                // Pedir la ciudad
                const lugar = await leerInput("Ciudad:");
                //Buscar los lugares
                const lugares = await busquedas.buscarCiudades(lugar);
                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id == "0") continue;
                const lugarSel = lugares.find((l) => l.id == id);
                busquedas.agregarHistorial(lugarSel.nombre);
                // Clima
                const clima = await busquedas.getClima(lugarSel.lng, lugarSel.lat);
                //Mostrar los resultados

                console.clear();
                console.log("\n Informacion de la ciudad\n".green);
                console.log("Ciudad:", lugarSel.nombre.green);
                console.log("Lat:", lugarSel.lat);
                console.log("Long:", lugarSel.lng);
                console.log("Temperatura:", clima.temp);
                console.log("Temp. Minima:", clima.min);
                console.log("Temp Maxima:", clima.max);
                console.log("Cómo está el clima?", clima.desc.green);
                break;
            case 2: //Mostrar historial
                busquedas.historial.forEach((lugar, i) => {
                    const ind = `${i + 1}.`.green;
                    console.log(`${ind} ${lugar}`);
                });
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0);
};

main();