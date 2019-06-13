/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { UsersModel } from '../models/users';
import * as crypto from 'crypto';
import * as _ from 'lodash';

const usersModel = new UsersModel();
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  let db = req.db;

  try {
    let rs: any = await usersModel.getUsers(db);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.get('/peoples', async (req: Request, res: Response) => {
  let db = req.db;

  try {
    let rs: any = await usersModel.getPeoples(db);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.get('/titles', async (req: Request, res: Response) => {
  let db = req.db;

  try {
    let rs: any = await usersModel.getTitles(db);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.get('/positions', async (req: Request, res: Response) => {
  let db = req.db;

  try {
    let rs: any = await usersModel.getPositions(db);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.post('/', async (req: Request, res: Response) => {
  let db = req.db;
  let people_id = req.body.people_id;
  let username = req.body.username;
  let password = req.body.password;
  let type = req.body.type;

  let checkDup = await usersModel.getUsers(db);
  let idx = _.findIndex(checkDup, { 'username': username });
  password = crypto.createHash('md5').update(password).digest('hex');

  try {
    if (idx > -1) {
      res.send({ ok: false });
    } else {
      const obj = {
        people_id: people_id,
        username: username,
        password: password,
        type: type
      }
      await usersModel.saveUsers(db, obj);
      res.send({ ok: true });
    }
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.post('/titles', async (req: Request, res: Response) => {
  let db = req.db;
  let titleName = req.body.title_name;

  try {
    await usersModel.saveTitles(db, { title_name: titleName });
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error });
  }
});

router.post('/positions', async (req: Request, res: Response) => {
  let db = req.db;
  let positionName = req.body.position_name;

  try {
    await usersModel.savePositions(db, { position_name: positionName });
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error });
  }
});

router.post('/people', async (req: Request, res: Response) => {
  let db = req.db;
  let fname = req.body.fname;
  let lname = req.body.lname;

  try {
    await usersModel.savePeoples(db, { fname: fname, lname: lname });
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error });
  }
});

router.put('/', async (req: Request, res: Response) => {
  let db = req.db;
  let username = req.body.username;
  let password = req.body.password;
  let type = req.body.type;
  let user_id = req.body.user_id;

  password = crypto.createHash('md5').update(password).digest('hex');

  try {
    const obj = {
      username: username,
      password: password,
      type: type
    }
    await usersModel.updateUsers(db, obj, user_id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.put('/delete', async (req: Request, res: Response) => {
  let db = req.db;
  let user_id = req.body.user_id;

  try {
    await usersModel.deleteUsers(db, user_id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.delete('/delete/titles/:Id', async (req: Request, res: Response) => {
  let db = req.db;
  let Id = req.params.Id;

  try {
    await usersModel.deleteTitles(db, Id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.delete('/delete/peoples/:Id', async (req: Request, res: Response) => {
  let db = req.db;
  let Id = req.params.Id;

  try {
    await usersModel.deletePeoples(db, Id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.delete('/delete/positions/:Id', async (req: Request, res: Response) => {
  let db = req.db;
  let Id = req.params.Id;

  try {
    await usersModel.deletePositions(db, Id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.get('/search', async (req: Request, res: Response) => {
  let db = req.db;
  let query = req.query.query;

  try {
    let rs = await usersModel.search(db, query);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.get('/search/position', async (req: Request, res: Response) => {
  let db = req.db;
  let query = req.query.query;

  try {
    let rs = await usersModel.searchPosition(db, query);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

export default router;