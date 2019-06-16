/// <reference path="../../typings.d.ts" />
import { Router } from 'express';
import { Import } from '../models/import';
import { Jwt } from '../models/jwt';
import * as path from 'path';
import * as multer from 'multer';
import * as fse from 'fs-extra';
import xlsx from 'node-xlsx';

import * as co from 'co-express';

const importModel = new Import();
const jwt = new Jwt();

const router: Router = Router();

let uploadDir = path.join(process.env.UPLOAD, 'salary');
var moment = require('moment');
fse.ensureDirSync(uploadDir);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    let _ext = path.extname(file.originalname);
    cb(null, Date.now() + _ext)
  }
})

let upload = multer({ storage: storage });

router.post('/salary', upload.single('file'), co(async (req, res, next) => {
  let db = req.db;
  let filePath = req.file.path;

  const workSheetsFromFile = xlsx.parse(`${filePath}`);

  try {
    let excelData = workSheetsFromFile[0].data;
    let maxRecord = excelData.length;
    let header = excelData[0];

    res.send({ ok: true, rs: excelData })
  } catch (error) {
    console.log(error);
    
  }

  // // remove file
  // rimraf.sync(filePath);

  // let excelData = workSheetsFromFile[0].data;
  // let maxRecord = excelData.length;

  // let header = excelData[0];

  // // check headers 
  // if (header[0].toUpperCase() === 'DATE_SERV' &&
  //   header[1].toUpperCase() === 'SEQ' &&
  //   header[2].toUpperCase() === 'HN' &&
  //   header[3].toUpperCase() === 'DRUG_CODE' &&
  //   header[4].toUpperCase() === 'QTY' &&
  //   header[5].toUpperCase() === 'WAREHOUSE_CODE') {

  //   let _data: any = [];
  //   // x = 0 = header      
  //   for (let x = 1; x < maxRecord; x++) {
  //     if (excelData[x][1] && excelData[x][2] && excelData[x][3] && excelData[x][4] != 0 && excelData[x][5]) {

  //       let conversion = await hisTransactionModel.getConversionHis(db, hospcode, excelData[x][3]);
  //       let qty;
  //       if (conversion.length) {
  //         if (excelData[x][4] > 0) {
  //           qty = Math.ceil(excelData[x][4] / conversion[0].conversion);
  //         } else {
  //           let _qty = excelData[x][4] * -1;
  //           qty = Math.ceil(_qty / conversion[0].conversion);
  //           qty = qty * -1;
  //         }
  //       } else {
  //         qty = 0;
  //       }

  //       let obj: any = {
  //         date_serv: moment(excelData[x][0], 'YYYYMMDD').format('YYYY-MM-DD'),
  //         seq: excelData[x][1],
  //         hn: excelData[x][2],
  //         drug_code: excelData[x][3],
  //         qty: qty,
  //         his_warehouse: excelData[x][5],
  //         mmis_warehouse: warehouseId,
  //         hospcode: hospcode,
  //         people_user_id: req.decoded.people_user_id,
  //         created_at: moment().format('YYYY-MM-DD HH:mm:ss')
  //       }
  //       _data.push(obj);
  //     }
  //   }

  //   if (_data.length) {
  //     try {
  //       // await hisTransactionModel.removeHisTransaction(db, hospcode);
  //       await hisTransactionModel.saveHisTransactionTemp(db, _data);

  //       res.send({ ok: true });
  //     } catch (error) {
  //       res.send({ ok: false, error: error.message })
  //     } finally {
  //       db.destroy();
  //     }
  //   } else {
  //     res.send({ ok: false, error: 'ไม่พบข้อมูลที่ต้องการนำเข้า' })
  //   }
  // } else {
  //   res.send({ ok: false, error: 'Header ไม่ถูกต้อง' })
  // }

}));

export default router;