import * as nodemailer from 'nodemailer';

export const transportEmail = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'nguyengiaphat13579@gmail.com',
    pass: 'phat2112a22mdc',
  },
});
