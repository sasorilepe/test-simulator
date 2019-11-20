'use strict';

const fs = require('fs');
const JSZip = require('JSZip');
const questionService = require('../services/QuestionService');

const checkIfExists = file => fs.existsSync(file);

const checkIfIsZip = file => {
  const regex = /\.zip/g;
  return file.match(regex);
};

const checkIfZipIsValid = async (file) => {

  const content = fs.readFileSync(questionService.resourcesPath + file);

  return await JSZip.loadAsync(content)
    .then(zip => {
      const filesInZip = Object.keys(zip.files);
      for (const fileInZip of filesInZip) {
        if (fileInZip === 'challenge.json') {
          return true;
        }
      }
      return false;
    })
    .catch(questionService.logError);
}

const checkIfInstalled = file => {
  const folder = file.split('.')[0];
  const folderPath = questionService.challengesPath + folder;
  return checkIfExists(folderPath);
};

const getValidQuestions = async () => {

  const questions = questionService.getAllQuestions();
  const validQuestions = [];
  for (const question of questions) {
    if (checkIfIsZip(question)) {
      if (await checkIfZipIsValid(question)) {
        const validQuestion = {
          question,
          installed: checkIfInstalled(question)
        };
        validQuestions.push(validQuestion);
      }
    }
  }
  return validQuestions;
};

const deleteQuestion = question => {
  if (!checkIfExists(questionService.resourcesPath + question)) {
    return {
      status: 404,
      error: 'The question does not exist'
    };
  }
  questionService.deleteQuestion(question);
  return {
    status: 200,
    message: "The question was succesfully deleted"
  };
};

const uninstallQuestion = question => {
  const folder = question.split('.')[0];
  const path = questionService.challengesPath + folder + '/';
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
  if (! await checkIfZipIsValid(zipFile)) {
    return {
      status: 400,
      error: 'This zip file does not have a "challenge.json" inside it'
    };
  }
  if (checkIfInstalled(zipFile)) {
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
  uninstallQuestion
};