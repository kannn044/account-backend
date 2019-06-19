/// <reference path="../../typings.d.ts" />
import { Router, Request, Response } from 'express';
import { UsersModel } from '../models/users';
import * as _ from 'lodash';
import * as moment from 'moment';

const usersModel = new UsersModel();
const router: Router = Router();

moment.locale('th')
let date = moment(new Date()).format('D MMMM ') + (moment(new Date()).get('year') + 543);

router.get('/salary', async (req: Request, res: Response) => {
    let db = req.db;
    let salaryId = req.query.id;

    salaryId = Array.isArray(salaryId) ? salaryId : [salaryId];
    try {
        // let rs = await usersModel.getSalarySearch(db, date, query);
        res.render('report-salary', {
            date: date
        });
    } catch (error) {
        res.send({ ok: false, message: error })
    }
});

export default router;