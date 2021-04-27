const { Credenciales } = require('../utils/credenciales');
const SHA256 = require('crypto-js/sha256');

function calcularHash(block) {
    return SHA256(
        block.index +
        block.timestamp +
        block.hashAnterior +
        JSON.stringify(block.data)
    ).toString() //para transformar el resultado a string
}

class Block {
    
    index
    hashAnterior
    timestamp
    data
    hash

    constructor(index, timestamp, data, hashAnterior = "") {
        this.index = index;
        this.hashAnterior = hashAnterior;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = calcularHash(this);
    }

}

class Blockchain {
    
    chain = [];

    constructor() {
        const genesisBlock = new Block(0, new Date().getTime(), 'Bloque Genesis', "");
        this.chain = [genesisBlock];
    }

    getUltimoBloque() {
        return this.chain[this.chain.length - 1];
    }

    crearNuevoBloque(data) {
        const ultimoBloque = this.getUltimoBloque();
        const nuevoBloque = new Block(
            ultimoBloque.index + 1, 
            new Date().getTime(),
            data,
            ultimoBloque.hash 
        );
        return this.agregarBloque(nuevoBloque);
    }

    agregarBloque(nuevoBloque) {
        const ultimoBloque = this.getUltimoBloque();

        if (ultimoBloque.index + 1 !== nuevoBloque.index) {
            console.log('Indice no valido');
        } else if (nuevoBloque.hashAnterior !== ultimoBloque.hash) {
            console.log('Hash anterior no corresponde');
        } else if (nuevoBloque.hash !== calcularHash(nuevoBloque)) {
            console.log('No minaste el bloque apropiadamente');            
        } else {
            this.chain.push(nuevoBloque);
        }
        return nuevoBloque.hash
    }

    imprimir() {
        this.chain.forEach((block) => console.log(`${JSON.stringify(block)} \n`));
        return this.chain;
    }
}

const blockchain = new Blockchain();

const getLicencias = async () => {
    const newPool = Credenciales('licencias');
    try {
        const response = await newPool.query('SELECT id, name_database, empresa, public_key, private_key, CAST(fec_activacion AS VARCHAR), CAST(fec_desactivacion AS VARCHAR) FROM licenciasAdmin').then(result => { return result.rows })
        return response
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const obtenerLicencia = async (name_database) => {
    const newPool = Credenciales('licencias');
    try {
        const [ response ] = await newPool.query('SELECT name_database, empresa, public_key, private_key, CAST(fec_activacion AS VARCHAR), CAST(fec_desactivacion AS VARCHAR) FROM licenciasAdmin WHERE name_database = $1',[name_database]).then(result => { return result.rows })
        return response
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const createLicencia = async(data) => {
    const newPool = Credenciales('licencias');

    const { name_database, empresa, fec_activacion, fec_desactivacion } = data;
    const public_key = SHA256( name_database, empresa, fec_activacion, fec_desactivacion ).toString()
    const private_key = blockchain.crearNuevoBloque(data);
    blockchain.imprimir();    

    try {
        const [ response ] = await newPool.query('INSERT INTO licenciasAdmin(name_database, empresa, public_key, private_key, fec_activacion, fec_desactivacion) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name_database, empresa, public_key, private_key, CAST(fec_activacion AS VARCHAR), CAST(fec_desactivacion AS VARCHAR)',
            [name_database, empresa, public_key, private_key, fec_activacion, fec_desactivacion])
            .then(result => { return result.rows })
        return response
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

module.exports = {
    getLicencias,
    obtenerLicencia,
    createLicencia
}