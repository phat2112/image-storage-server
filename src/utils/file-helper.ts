import { extname } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';

export const editFileName = (req, file: Express.Multer.File, cb) => {
  const reqUrlSplit = req.url.split('/');
  const userId = reqUrlSplit[reqUrlSplit.length - 1];
  const fileExtName = extname(file.originalname);
  const imageStorageType = reqUrlSplit[reqUrlSplit.length - 2];
  let subImgName = imageStorageType;
  if (imageStorageType === 'update-user') {
    const length = readdirSync(`./public/${userId}`).length;
    subImgName = `${imageStorageType}-${length + 1}`;
  }

  cb(null, `image-${userId}-${subImgName}${fileExtName}`);
};

export const imageFileFilter = (req, file: Express.Multer.File, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed'), false);
  }

  return cb(null, true);
};

export const storageFolder = (req, file: Express.Multer.File, cb) => {
  const reqUrlSplit = req.url.split('/');
  const userId = reqUrlSplit[reqUrlSplit.length - 1];
  const newFolderDir = `./public/${userId}`;
  if (!existsSync(newFolderDir)) {
    mkdirSync(newFolderDir);
  }

  cb(null, `${newFolderDir}`);
};
