import express from 'express';
import cors from 'cors';
import { checkScore } from './utils/functions';
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

    this.app.get('/check/:string', (req, res) => {
      const { string } = req.params;
      const words = string.split(' ');
      let matcher = [];
      const allSwearWords = [...sinhalaSinglishSwearWords, ...sinhalaUnicodeSwearWords];
      const checkWords = req.query.wordWise;
      let data;
      let badWords = [];

      if (checkWords === '1') {
        words.map(word => {
          const check = allSwearWords.includes(word);
          matcher = [...matcher, check]
          allSwearWords.filter(bad => bad === word).map(bad => {
            badWords.push(bad);
          })

        });

        data = {
          containsSwearWords: matcher.includes(true),
          words: badWords.length > 0 ? badWords : null
        };

      } else {
        words.map(word => {
          matcher = checkScore(word);
        })

        if (matcher === null) {
          data = {
            score: 0.0,
            level: 'no-risk',
            match: null,
          }
        } else {
          data = {
            score: matcher[0][0],
            level: 'risk',
            match: matcher[0][1]
          }
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
