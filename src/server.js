import express from 'express';
import cors from 'cors';
import { sinhalaSinglishSwearWords, sinhalaUnicodeSwearWords } from './constants/words';
import FuzzySet from 'fuzzyset.js';

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

    this.app.get('/check/:string', (req, res) => {
      const { string } = req.params;
      const allSwearWords = [...sinhalaSinglishSwearWords, ...sinhalaUnicodeSwearWords];
      let fs = FuzzySet(allSwearWords, false);
      const matched = fs.get(string);

      let data;

      if (matched === null) {
        data = {
          score: 0.0,
          level: 'no-risk',
          match: null,
        }
      } else {
        data = {
          score: matched[0][0],
          level: 'risk',
          match: matched[0][1]
        }
      }

      return res.json(data)
    })
  }


  server() {
    this.app.listen(5000);
  }

}


export default new Server();
