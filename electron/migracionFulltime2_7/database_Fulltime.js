const Pool = require('pg-pool');

async function CrearConexionFulltime3(data) {

  const { datname, host, port, user, password } = data;
  const dataConnection = {
    user: user,
    host: host,
    port: parseInt(port),
    database: datname,
    password: password
  }

  try {

    const db_fulltime = new Pool(dataConnection)

    const result = await db_fulltime.query('SELECT NOW()')
      .then(res => { return res.rows[0] })
      .catch(err => { return {err}})

    // console.log('Resultado options: ',db_fulltime.options);
    if (result.err) return result;

    return dataConnection

  } catch (error) {
    console.log('°°°°°°°°°°°°°°°', error);
    return { err: error.toString() }
  }
}



module.exports = {
  CrearConexionFulltime3,
}