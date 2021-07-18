const inquirer = require("inquirer");
const colors = require("colors");

const preguntas = [{
    type: "list",
    name: "opcion",
    message: "Seleccione una Opción:",
    choices: [{
            value: 1,
            name: `${"1.".green} Buscar Ciudad`,
        },
        {
            value: 2,
            name: `${"2.".green} Consultar Historial`,
        },
        {
            value: 0,
            name: `${"0.".green} Salir`,
        },
    ],
}, ];

const inquirerMenu = async() => {
    console.clear();
    console.log("==========================".blue);
    console.log("Aplicación del Clima".white);
    console.log("==========================\n".blue);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
};

const pausa = async() => {
    const question = [{
        type: "input",
        name: "enter",
        message: `Presiones ${"ENTER".blue} para continuar`,
    }, ];

    console.log("\n");
    await inquirer.prompt(question);
};

const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,
        };
    });

    choices.unshift({
        value: "0",
        name: `${"0.".green} Cancelar`,
    });

    const preguntas = [{
        type: "list",
        name: "id",
        message: "Seleccione",
        choices,
    }, ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
};

const confirmar = async(message = "") => {
    const question = [{ type: "confirm", name: "ok", message }];
    const { ok } = await inquirer.prompt(question);
    return ok;
};

const leerInput = async(message) => {
    const question = [{
        type: "input",
        name: "desc",
        message,
        validate(value) {
            if (value.lenght === 0) console.log("Por favor ingrese un valor");
            return true;
        },
    }, ];
    const { desc } = await inquirer.prompt(question);
    return desc;
};

const mostrarListadoCheckList = async(tareas) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: tarea.completadoEn ? true : false,
        };
    });

    const pregunta = [{
        type: "checkbox",
        name: "ids",
        message: "Seleccione",
        choices,
    }, ];

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
};

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList,
};