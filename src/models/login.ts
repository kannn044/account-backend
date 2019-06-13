import * as Knex from 'knex';

export class Login {
  login(db: Knex, username: string, password: string) {
    return db('um_users as u')
      .select('t.title_name', 'p.fname', 'p.lname', 'po.position_name', 'u.*')
      .join('um_people as p', 'p.people_id', 'u.people_id')
      .join('um_positions as po', 'po.position_id', 'p.position_id')
      .join('um_titles as t', 't.title_id', 'p.title_id')
      .where('u.username', username)
      .where('u.password', password)
      .limit(1);
  }
}