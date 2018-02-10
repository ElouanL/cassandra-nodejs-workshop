const {types} = require('cassandra-driver');
const {mapToCharacterDB} = require('./character.db.model');
const {CassandraClient} = require('../database/cassandra-client.database');

module.exports = {
  getAllCharactersDB() {
    const query = 'SELECT * FROM workshop.characters'
    return CassandraClient.execute(query)
      .then(result => {
        return result.rows.map(row => mapToCharacterDB(row.id, row.name, row.house, row.allegiance));
      });
  },

  getCharacterById(id) {
    const query = 'SELECT * FROM workshop.characters WHERE id=?';
    const params = [types.Uuid.fromString(id)];
    return CassandraClient.execute(query, params)
      .then(result => {
        const row = result.rows[0];
        return mapToCharacterDB(row.id, row.name, row.house, row.allegiance);
      });
  },

  insertCharacter(characterToAdd) {
    const query = 'INSERT INTO workshop.characters(id,name,house,allegiance) VALUES (?,?,?,?)';
    const newId = types.TimeUuid.now();
    const params = [newId, characterToAdd.name, characterToAdd.house, characterToAdd.allegiance];
    return CassandraClient.execute(query, params)
      .then(result => {
        return newId.toString();
      });
  },

  updateCharacter(id, characterToUpdate) {
    const query = 'UPDATE workshop.characters SET name=?, house=?, allegiance=? WHERE id=?';
    const params = [characterToUpdate.name, characterToUpdate.house, characterToUpdate.allegiance, types.Uuid.fromString(id)];
    return CassandraClient.execute(query, params)
      .then(result => {
        return id.toString();
      });
  },

  deleteCharacter(characterIdToDelete) {
    const query = 'DELETE FROM workshop.characters WHERE id=?';
    const params = [characterIdToDelete];
    return CassandraClient.execute(query, params)
      .then(result => {
        return characterIdToDelete.toString();
      });
  }
};