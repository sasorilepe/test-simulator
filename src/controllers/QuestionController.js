'use strict';

const fs = require('fs');
const JSZip = require('JSZip');
const questionService = require('../services/QuestionService');

const checkIfIdIsValid = id => {
  const numericId = parseInt(id);
  return (new Date(numericId)).getTime() > 0;
};

const checkIfEmptyString = str => str.replace(/\s+/g, '').length;

const checkIfExists = file => fs.existsSync(file);

const checkIfIsZip = file => {
  const regex = /\.zip/g;
  return file.match(regex);
};

const checkIfChallengeFileIsValid = async (zip) => {

  const filesInZip = Object.keys(zip.files);

  return await zip.file('challenge.json').async('nodebuffer')
    .then(data => {

      const parsedData = data.toString();
      const parsedJSON = JSON.parse(parsedData);

      const challengePaths = parsedJSON.backend;
      const challengeName = parsedJSON.name;

      if (!checkIfIdIsValid(parsedJSON.id)) {
        return false;
      }

      if (typeof challengeName != 'string' || !checkIfEmptyString(challengeName)) {
        return false;
      }

      if (Array.isArray(challengePaths)) {

        for (const path of challengePaths) {
          if (!filesInZip.includes(path)) {
            return false;
          }
        }
      }
      else {
        return false;
      }

      return parsedJSON;
    })
    .catch(questionService.logError);
};

const checkIfZipIsValid = async (zipFile) => {

  const content = fs.readFileSync(questionService.resourcesPath + zipFile);

  return await JSZip.loadAsync(content)
    .then(async (zipData) => await checkIfChallengeFileIsValid(zipData))
    .catch(questionService.logError);
}

const checkIfInstalled = folder => {
  const folderPath = questionService.challengesPath + folder;
  const itExists = checkIfExists(folderPath);
  return itExists;
};

const editQuestion = questionId => {
  return questionService.editQuestion(questionId);
};

const getValidQuestions = async () => {

  const zipFiles = questionService.getAllQuestions();
  const validZipFiles = [];

  for (const zipFile of zipFiles) {

    if (checkIfIsZip(zipFile)) {

      const challengeData = await checkIfZipIsValid(zipFile);

      if (challengeData) {

        const isInstalled = checkIfInstalled(challengeData.id);
        const jsonFile = isInstalled ? questionService.getChallengeDataFromId(challengeData.id) : challengeData;

        const validZipFile = {
          zipFile,
          installed: isInstalled,
          challengeData: jsonFile
        };

        validZipFiles.push(validZipFile);
      }
    }
  }
  return validZipFiles;
};

const deleteQuestion = zipFile => {
  if (!checkIfExists(questionService.resourcesPath + zipFile)) {
    return {
      status: 404,
      error: 'The question does not exist'
    };
  }
  questionService.deleteQuestion(zipFile);
  return {
    status: 200,
    message: "The question was succesfully deleted"
  };
};

const uninstallQuestion = questionId => {
  const path = questionService.challengesPath + questionId + '/';
  if (!checkIfExists(path)) {
    return {
      status: 404,
      error: 'The challenge does not exist'
    };
  }
  questionService.uninstallQuestion(path);
  return {
    status: 200,
    message: "The challenge was succesfully uninstalled"
  };
};

const installQuestion = async (zipFile) => {
  if (!checkIfExists(questionService.resourcesPath + zipFile)) {
    return {
      status: 404,
      error: 'The challenge does not exist'
    };
  }
  if (!checkIfIsZip(zipFile)) {
    return {
      status: 400,
      error: 'This file is not a zip'
    };
  }

  const challengeData = await checkIfZipIsValid(zipFile);

  if (!challengeData) {
    return {
      status: 400,
      error: 'This zip file does not have a "challenge.json" or it is not valid'
    };
  }
  if (checkIfInstalled(challengeData.id)) {
    return {
      status: 400,
      error: 'This challenge was previously installed'
    };
  }
  const questionRes = questionService.installQuestion(zipFile);
  return questionRes;
};

module.exports = {
  getValidQuestions,
  installQuestion,
  deleteQuestion,
  uninstallQuestion,
  editQuestion
};