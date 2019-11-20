const fs = require('fs');
const JSZip = require('JSZip');
const rimraf = require('rimraf');

const resourcesPath = './public/resources/';
const challengesPath = './public/challenges/';

const logError = err => {
  console.error(err);
  return false;
};

const getAllQuestions = () => fs.readdirSync(resourcesPath);

const deleteQuestion = questionFile => fs.unlinkSync(resourcesPath + questionFile);

const uninstallQuestion = questionDir => rimraf.sync(questionDir);

const installQuestion = async (questionFile) => {

  const folderToUnzip = questionFile.split('.')[0];
  const pathToUnzip = challengesPath + folderToUnzip + '/';

  const zip = new JSZip();

  const zipFile = fs.readFileSync(resourcesPath + questionFile);

  fs.mkdirSync(pathToUnzip);

  const questionWasCreated = await zip.loadAsync(zipFile)
    .then(async (content) => {

      const fileNames = Object.keys(content.files);

      for (const fileName of fileNames) {

        const filePath = pathToUnzip + fileName;

        if (fileName[fileName.length - 1] === '/') {
          fs.mkdirSync(filePath);
        }

        else {
          const fileWasCreated = await zip.file(fileName).async('nodebuffer')
            .then(fileData => {
              fs.writeFileSync(filePath, fileData);
              return true;
            })
            .catch(logError);

          if (!fileWasCreated) {
            return false;
          }
        }

      }
      return true;
    })
    .catch(logError);

  if (!questionWasCreated) {
    return {
      status: 400,
      error: 'One of the files is corrupted'
    };
  }
  return {
    status: 201,
    message: 'The question was succesfully installed'
  }
};

module.exports = {
  getAllQuestions,
  installQuestion,
  deleteQuestion,
  logError,
  resourcesPath,
  challengesPath,
  uninstallQuestion
};