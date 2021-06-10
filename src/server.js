import express from 'express';
import cors from 'cors';
import { sinhalaSinglishSwearWords, sinhalaUnicodeSwearWords } from './constants/words';

class Server {
  constructor() {
    this.app = express();
    this.server();
    this.routes();
  }

  routes() {
    this.app.use(express.json());
    this.app.use(cors());


    // Return all the swear words.
    this.app.get('/words', (req, res) => {
      return res.json([...sinhalaSinglishSwearWords, ...sinhalaUnicodeSwearWords])
    })

    this.app.get('/words/singlish', (req, res) => {
      return res.json(sinhalaSinglishSwearWords)
    })

    this.app.get('/words/unicode', (req, res) => {
      return res.json(sinhalaUnicodeSwearWords)
    })

    // check for swear words and get detailed description
    this.app.get('/check/:string', (req, res) => {
      const { string } = req.params;
      const words = string.split(' ');
      let matcher = [];
      const allSwearWords = [...sinhalaSinglishSwearWords, ...sinhalaUnicodeSwearWords];
      let data;
      let badWords = [];
      let wordIndexes = [];
      var Filter = require('bad-words');
      var filter = new Filter({ list: allSwearWords });

      words.map(word => {
        const check = allSwearWords.includes(word);
        matcher = [...matcher, check]
        allSwearWords.filter(bad => bad === word).map(bad => {
          badWords.push(bad);
          wordIndexes.push(words.indexOf(bad));
        })
      });

      data = {
        containsSwearWords: matcher.includes(true),
        words: badWords.length > 0 ? badWords : null,
        wordIndexes: wordIndexes,
        cleaned: filter.clean(string)
      };

      return res.json(data)
    })
  }

  server() {
    this.app.listen(5000);
  }

}


export default new Server();
