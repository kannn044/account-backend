import * as Knex from 'knex';

export class UsersModel {

  getUsers(db: Knex) {
    return db('users');
  }

  saveUsers(db: Knex, data: any) {
    return db('users').insert(data);
  }

  updateUsers(db: Knex, data: any, userId: any) {
    return db('users').update(data).where('id', userId);
  }

  deleteUsers(db: Knex, userId: any) {
    return db('users').del().where('id', userId);
  }

}