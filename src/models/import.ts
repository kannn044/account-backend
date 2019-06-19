import * as Knex from 'knex';

export class Import {
  getPeopleSalary(db: Knex, peopleIds: any) {
    return db('um_people').whereIn('people_id', peopleIds)
  }

  saveSalary(db: Knex, data: any) {
    return db('salary').insert(data);
  }
}