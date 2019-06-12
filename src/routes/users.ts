/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { UsersModel } from '../models/users';
import * as crypto from 'crypto';

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

router.post('/', async (req: Request, res: Response) => {
  let db = req.db;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let username = req.body.username;
  let password = req.body.password;
  let type = req.body.type;

  password = crypto.createHash('md5').update(password).digest('hex');

  try {
    const obj = {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
      type: type
    }
    await usersModel.saveUsers(db, obj);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

router.put('/', async (req: Request, res: Response) => {
  let db = req.db;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let username = req.body.username;
  let password = req.body.password;
  let type = req.body.type;
  let user_id = req.body.user_id;

  password = crypto.createHash('md5').update(password).digest('hex');

  try {
    const obj = {
      first_name: first_name,
      last_name: last_name,
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

router.delete('/:user_id', async (req: Request, res: Response) => {
  let db = req.db;
  let user_id = req.params.user_id;

  try {
    await usersModel.deleteUsers(db, user_id);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
  }
});

export default router;