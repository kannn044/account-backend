import * as Knex from 'knex';

export class UsersModel {

  getUsers(db: Knex) {
    return db('um_users as u')
      .select('t.title_name', 'p.fname', 'p.lname', 'po.position_name', 'u.username', 'u.password', 'u.user_id', 'u.type')
      .join('um_people as p', 'p.people_id', 'u.people_id')
      .join('um_positions as po', 'po.position_id', 'p.position_id')
      .join('um_titles as t', 't.title_id', 'p.title_id')
      .where('u.is_active', 'Y');
  }

  getTitles(db: Knex) {
    return db('um_titles');
  }

  getPositions(db: Knex) {
    return db('um_positions');
  }

  getPeoples(db: Knex) {
    return db('um_people');
  }

  saveUsers(db: Knex, data: any) {
    return db('users').insert(data);
  }

  saveTitles(db: Knex, data: any) {
    return db('um_titles').insert(data);
  }

  savePositions(db: Knex, data: any) {
    return db('um_positions').insert(data);
  }

  savePeoples(db: Knex, data: any) {
    return db('um_people').insert(data);
  }

  updateUsers(db: Knex, data: any, userId: any) {
    return db('users').update(data).where('id', userId);
  }

  deleteUsers(db: Knex, userId: any) {
    return db('users').update('is_active', 'N').where('id', userId);
  }

  deleteTitles(db: Knex, Id: any) {
    return db('um_titles').del().where('title_id', Id);
  }

  deletePositions(db: Knex, Id: any) {
    return db('um_positions').del().where('position_id', Id);
  }

  deletePeoples(db: Knex, Id: any) {
    return db('um_people').del().where('people_id', Id);
  }

  search(db: Knex, query: any) {
    let _query = `%` + query + `%`;
    return db(`um_people`)
    .whereRaw(`fname LIKE '${_query}'`)
    .orWhereRaw(`lname LIKE '${_query}'`);
  }

  searchPosition(db: Knex, query: any) {
    let _query = `%` + query + `%`;
    return db(`um_positions`)
    .whereRaw(`position_name LIKE '${_query}'`);
  }
}