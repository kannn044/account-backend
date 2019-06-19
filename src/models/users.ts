import * as Knex from 'knex';

export class UsersModel {

  getUsers(db: Knex) {
    return db('um_users as u')
      .select('p.people_id', 't.title_name', 'p.fname', 'p.lname', 'po.position_name', 'u.username', 'u.password', 'u.user_id', 'u.type')
      .join('um_people as p', 'p.people_id', 'u.people_id')
      .join('um_positions as po', 'po.position_id', 'p.position_id')
      .join('um_titles as t', 't.title_id', 'p.title_id')
      .where('u.is_active', 'Y');
  }

  getUsersInfo(db: Knex, query: any) {
    let _query = `%` + query + `%`;
    return db('um_users as u')
      .select('p.people_id', 't.title_name', 'p.fname', 'p.lname', 'po.position_name', 'u.username', 'u.password', 'u.user_id', 'u.type')
      .join('um_people as p', 'p.people_id', 'u.people_id')
      .join('um_positions as po', 'po.position_id', 'p.position_id')
      .join('um_titles as t', 't.title_id', 'p.title_id')
      .where('u.is_active', 'Y')
      .whereRaw(`fname LIKE '${_query}'`)
      .orWhereRaw(`lname LIKE '${_query}'`);
  }

  getTitles(db: Knex) {
    return db('um_titles');
  }

  getPositions(db: Knex) {
    return db('um_positions');
  }

  getPeoples(db: Knex) {
    return db('um_people as u')
      .select('u.*', 'p.position_name')
      .join('um_positions as p', 'p.position_id', 'u.position_id');
  }

  saveUsers(db: Knex, data: any) {
    return db('um_users').insert(data);
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
    return db('um_users').update(data).where('user_id', userId);
  }

  deleteUsers(db: Knex, userId: any) {
    return db('um_users').update('is_active', 'N').where('user_id', userId);
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

  getSalary(db: Knex, date: any) {
    let _date = `%` + date + `%`;
    return db(`salary as s`)
      .select('s.*', 'p.fname', 'p.lname')
      .join(`um_people as p`, `p.people_id`, `s.people_id`)
      .whereRaw(`s.date_serv LIKE '${_date}'`)
  }

  removeSalary(db: Knex, date: any) {
    let _date = `%` + date + `%`;
    return db(`salary`).del()
      .whereRaw(`date_serv LIKE '${_date}'`)
  }

  getSalarySearch(db: Knex, date: any, query: any) {
    let _date = `%` + date + `%`;
    let _query = `%` + query + `%`;
    return db(`salary as s`)
      .select('s.*', 'p.fname', 'p.lname')
      .join(`um_people as p`, `p.people_id`, `s.people_id`)
      .whereRaw(`fname LIKE '${_query}'`)
      .whereRaw(`s.date_serv LIKE '${_date}'`)
      .orWhereRaw(`lname LIKE '${_query}'`)
      .whereRaw(`s.date_serv LIKE '${_date}'`)
  }
}