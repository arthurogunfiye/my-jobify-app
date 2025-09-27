import multer from 'multer';
import path from 'path';
import DataParser from 'datauri/parser.js';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads');
//   },
//   filename: function (req, file, cb) {
//     const fileName = file.originalname;
//     cb(null, fileName);
//   }
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = file => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;

// console.log(file) - formatImage parameter

// Output

// {
//   fieldname: 'avatar',
//   originalname: 'ArthurOgunfuye.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 06 06 06 06 07 06 07 08 08 07 0a 0b 0a 0b 0a 0f 0e 0c 0c 0e 0f 16 10 11 10 ... 229577 more bytes>,
//   size: 229627
// }
