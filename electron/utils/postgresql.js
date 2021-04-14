/**
 * CREAR ARCHIVOS DE CONFIGURACION
 */

 const fs = require('fs');

 const dataJSON = [
     {
         user: 'postgres',
         host: 'localhost',
         port: 5432,
         database: '',
         password: 'fulltime'
     }
 ]
 
 fs.readFile('bdd.conf.json', 'utf8', (error, data) => {
     if(error) {
         fs.appendFile('bdd.conf.json', JSON.stringify(dataJSON), function (err) {
             if (err) throw err;
             console.log('Archivo de configuración creado!');
         })
         throw console.warn(error);
     } else {
         console.log(data);
         fs.writeFile('bdd.conf.json', data, function (err) {
             if (err) throw err;
             console.log('Archivo de configuaracion actualizado!');
         })
     }   
 });
 
const Pool = require('pg-pool');

let pool;

try {

  const credenciales = fs.readFileSync('bdd.conf.json','utf8');
  console.log(credenciales);
  const [ obj ] = JSON.parse(credenciales)
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log(obj);
  console.log(obj.user);
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  pool = new Pool({
    user: obj.user,
    host: obj.host,
    port: obj.port,
    database: obj.database,
    password: obj.password
  });  
  
} catch (error) {
  const [ cred ] = dataJSON 
  pool = new Pool(cred)
  console.log('linea 57 > ');
  console.log('+++++++++++++++++++++++++++++++++++++++++++++');
  console.log(error);
  console.log('+++++++++++++++++++++++++++++++++++++++++++++');
}

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log("Error durante la conexión", err)
  } else {
    console.log("Conexion exitosa")
  }
});

module.exports = {
  pool
}