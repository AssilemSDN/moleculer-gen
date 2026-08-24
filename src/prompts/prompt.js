/*
  PATH /src/prompts/prompt.js
*/
import inquirer from 'inquirer'

export const prompt = (questions) =>
  inquirer.prompt(
    questions.map(question => ({
      prefix: '',
      ...question
    }))
  )
