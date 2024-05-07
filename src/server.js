require('dotenv').config();
const valueFormat = require('./utils.js')

const http = require('http')
const odbc = require('odbc')
const url = require('url')

async function connectAndCall(req, res, data) {
  const cnx = await odbc.connect('DSN=personne')
  const parsedUrl = url.parse(req.url, true);

  try {
    if (req.method === 'POST' && parsedUrl.pathname == '/add') {
      const dNom = valueFormat(data.nom);
      const dPrenom = valueFormat(data.prenom);
      const dNum = valueFormat(data.num);
      const dVoie = valueFormat(data.voie);
      const dCP = valueFormat(data.cp);
      const dVille = valueFormat(data.ville);
      const dSociete = valueFormat(data.societe);
      const dFonction = valueFormat(data.fonction);

      sql = `INSERT INTO personne (nom, prenom, template) VALUES ('${dNom}', '${dPrenom}', 0)`
      await cnx.query(sql);

      const sqlId = await cnx.query(`SELECT @@IDENTITY as id`);
      itemId = sqlId[0].id;

      sql = `INSERT INTO adresse (num, voie, cp, ville, idpersonne) VALUES ('${dNum}', '${dVoie}', '${dCP}', '${dVille}', ${itemId})`
      await cnx.query(sql);
      sql = `INSERT INTO travail (societe, fonction, idpersonne) VALUES ('${dSociete}', '${dFonction}', ${itemId})`
      await cnx.query(sql);

      getItem = 'True';
    } else if (req.method === 'POST' && parsedUrl.pathname == '/update') {
      const dNom = valueFormat(data.nom);
      const dPrenom = valueFormat(data.prenom);
      const dNum = valueFormat(data.num);
      const dVoie = valueFormat(data.voie);
      const dCP = valueFormat(data.cp);
      const dVille = valueFormat(data.ville);
      const dSociete = valueFormat(data.societe);
      const dFonction = valueFormat(data.fonction);

      sql = `UPDATE personne SET nom='${dNom}', prenom='${dPrenom}' WHERE Id=${data.id}`
      await cnx.query(sql);
      sql = `UPDATE adresse SET num='${dNum}', voie='${dVoie}', cp='${dCP}', ville='${dVille}'WHERE idpersonne=${data.id}`
      await cnx.query(sql);
      sql = `UPDATE travail SET societe='${dSociete}', fonction='${dFonction}' WHERE idpersonne=${data.id}`
      await cnx.query(sql);

      itemId = data.id;
      getItem = 'True';
    } else if (req.method === 'POST' && parsedUrl.pathname == '/delete') {
      sql = `UPDATE personne SET template=${data.deltype} WHERE Id=${data.id}`
      await cnx.query(sql);
      itemId = data.id;
      getItem = 'True';
    } else if (req.method === 'GET' && parsedUrl.pathname == '/item') {
      itemId = parsedUrl.query.id;
      getItem = 'True';
    } else if (req.method === 'GET' && parsedUrl.pathname == '/items') {
      sql = `SELECT p.id, p.nom, p.prenom, a.num, a.voie, a.cp, a.ville, t.societe, t.fonction FROM personne p, adresse a, travail t WHERE a.idpersonne=p.id and t.idpersonne = p.id AND p.template<>2`
      getItem = 'False';
    }

    if (getItem == 'True') {
      // http://localhost:3001/item?id=1
      sql = `SELECT p.id, p.nom, p.prenom, a.num, a.voie, a.cp, a.ville, t.societe, t.fonction FROM personne p, adresse a, travail t WHERE a.idpersonne=p.id and t.idpersonne = p.id AND p.id=${itemId}`

    }

    const rows = await cnx.query(sql);
    const newRows = rows.map((res) => {
      const personne = { nom: res.nom, prenom: res.prenom }
      const adresse = { num: res.num, voie: res.voie, cp: res.cp, ville: res.ville }
      const travail = { societe: res.societe, fonction: res.fonction }
      const result = {
        id: res.id,
        personne,
        adresse,
        travail
      };
      return result;
    })
    const jsonData = JSON.stringify(newRows);
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200;
    res.end(jsonData);
  } catch (error) {
    console.error(error);
  } finally {
    cnx.close();
  }
}

const port = process.env.PORT;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  } else if (req.method === 'GET') {
    await connectAndCall(req, res, null);
  } else if (req.method === 'POST') {
    req.on('data', async data => {
      await connectAndCall(req, res, JSON.parse(data));
    })
    req.on('end', () => { });
  }
})

server.listen(port, () => {
  console.log('listening... on ' + port);
})