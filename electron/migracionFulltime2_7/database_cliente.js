const Pool = require('pg-pool');

async function CrearConexionClienteFulltime27(data) {

  const { datname, host, port, user, password } = data;
  const dataConnection = {
    user: user,
    host: host,
    port: parseInt(port),
    database: datname,
    password: password
  }

  try {

    const db_cliente = new Pool(dataConnection)

    const result = await db_cliente.query('SELECT NOW()')
      .then(res => { return res.rows[0] })
      .catch(err => { return {err}})

    // console.log('Resultado options: ',db_cliente.options);
    if (result.err) return result;

    return dataConnection

  } catch (error) {
    console.log('°°°°°°°°°°°°°°°', error);
    return { err: error.toString() }
  }
}



module.exports = {
  CrearConexionClienteFulltime27,
}