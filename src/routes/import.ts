/// <reference path="../../typings.d.ts" />
import { Router } from 'express';
import { Import } from '../models/import';
import { Jwt } from '../models/jwt';
import * as path from 'path';
import * as multer from 'multer';
import * as fse from 'fs-extra';
import xlsx from 'node-xlsx';

import * as co from 'co-express';

const json2xls = require('json2xls');
const fs = require('fs');

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

let statusDate_text = moment(new Date()).format('DD MMMM ') + (moment(new Date()).get('year') + 543);

let upload = multer({ storage: storage });

router.get('/export/salary', co(async (req, res, next) => {
  let db = req.db;
  let pids = req.query.pid;
  pids = Array.isArray(pids) ? pids : [pids];

  try {
    let rs: any = await importModel.getPeopleSalary(db, pids);
    let json = [];
    let row: number = 1;
    let setZero: number = 0;
    for (const v of rs) {
      let obj: any = {
        "ลำดับ": row,
        "ชื่อ-นามสกุล": v.fname + ' ' + v.lname,
        "ค่าจ้าง": setZero,
        "ปกส": setZero,
        "ค่าจ้างตกเบิก": setZero,
        "ปกส-ตกเบิก": setZero,
        "เงินเพิ่มพิเศษ": setZero,
        "ชันสูตรฯ": setZero,
        "ค่าเล่าเรียน": setZero,
        "ไข้นอกรัฐ": setZero,
        "ไข้ในเอกชน": setZero,
        "ไข้นอกเอกชน": setZero,
        "ฉ.11 ขรก": setZero,
        "ฉ.11 ลูกจ้าง": setZero,
        "พตส.ข้าราชการ": setZero,
        "รับอื่นๆ": setZero,
        "ภาษี": setZero,
        "กลุ่มลูกจ้าง": setZero,
        "AIA 1": setZero,
        "AIA 2": setZero,
        "AIA 3": setZero,
        "ฌกส": setZero,
        "สหกรณ์ สมทบ": setZero,
        "ธกส.": setZero,
        "จ่ายอื่นๆ": setZero,
        "สหกรณ์ รพ.": setZero,
        "หัก ออมสิน": setZero,
        "เงินกู้สหกรณ์ รพ.": setZero,
        "หักส่งพกส-ตกเบิก": setZero,
        "หักส่งพกส": setZero,
        "ค่าธรรมเนียม พกส": setZero,
        "ชมรมฟุตบอล": setZero,
        "ทัศนาภรณ์ทัวร์": setZero,
        "ค่าตอบแทนงบด่าน": setZero,
        "เลขบัญชี": setZero,
        "รหัสบุคลากร": v.people_id
      }
      json.push(obj);
      row += 1;
    }

    const xls = json2xls(json);
    const exportDirectory = path.join(process.env.UPLOAD, 'exports');
    // create directory
    fse.ensureDirSync(exportDirectory);
    const filePath = path.join(exportDirectory, 'ExportSalary ' + 'ณ วันที่' + statusDate_text + '.xlsx');
    fs.writeFileSync(filePath, xls, 'binary');
    // force download
    res.download(filePath, 'ExportSalary ' + 'ณ วันที่' + statusDate_text + '.xlsx');
    // res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: error })
    console.log(error);
  }
}));

router.post('/salary', upload.single('file'), co(async (req, res, next) => {
  let db = req.db;
  let filePath = req.file.path;
  let dateServ = req.query.date;
  
  const workSheetsFromFile = xlsx.parse(`${filePath}`);

  try {
    let excelData = workSheetsFromFile[0].data;
    let maxRecord = excelData.length;
    let data = [];

    for (let x = 1; x < maxRecord; x++) {
      for (let y = 2; y < excelData[x].length; y++) {
        if (excelData[x][y] === undefined) {
          excelData[x][y] = 0;
        }
      }
      let obj: any = {
        "salary": excelData[x][2],
        "date_serv": dateServ,
        "pgs": excelData[x][3],
        "salary_past": excelData[x][4],
        "pgs_past": excelData[x][5],
        "s_salary": excelData[x][6],
        "identify": excelData[x][7],
        "study": excelData[x][8],
        "s_out": excelData[x][9],
        "c_in": excelData[x][10],
        "c_out": excelData[x][11],
        "ch11_k": excelData[x][12],
        "ch11_emp": excelData[x][13],
        "pts_off": excelData[x][14],
        "other": excelData[x][15],
        "tax": excelData[x][16],
        "emp_group": excelData[x][17],
        "aia1": excelData[x][18],
        "aia2": excelData[x][19],
        "aia3": excelData[x][20],
        "ch_k_s": excelData[x][21],
        "cprt": excelData[x][22],
        "tks": excelData[x][23],
        "other_p": excelData[x][24],
        "cprt_hosp": excelData[x][25],
        "bank": excelData[x][26],
        "re_cprt": excelData[x][27],
        "p_pgs_past": excelData[x][28],
        "p_pgs": excelData[x][29],
        "fee_pgs": excelData[x][30],
        "football": excelData[x][31],
        "tour": excelData[x][32],
        "cpt": excelData[x][33],
        "sum": excelData[x][2] - excelData[x][3] + excelData[x][4] - excelData[x][5] + excelData[x][6] + excelData[x][7] + excelData[x][8] + excelData[x][9] + excelData[x][10] + excelData[x][11] + excelData[x][12] + excelData[x][13] + excelData[x][14] + excelData[x][15] - excelData[x][16] - excelData[x][17] - excelData[x][18] - excelData[x][19] - excelData[x][20] - excelData[x][21] - excelData[x][22] - excelData[x][23] - excelData[x][24] - excelData[x][25] - excelData[x][26] - excelData[x][27] - excelData[x][28] - excelData[x][29] - excelData[x][30] - excelData[x][31] - excelData[x][32] - excelData[x][33],
        "account": excelData[x][34],
        "people_id": excelData[x][35]
      }
      data.push(obj);
    }

    await importModel.saveSalary(db, data);

    res.send({ ok: true, rs: data })
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