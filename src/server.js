const Koa = require('koa')
const Router = require('koa-router')
var cors = require('koa2-cors')
const henryIV = require('./henry_iv.json')
const NaturalLanguageUnderstandingV1 = require(
  'watson-developer-cloud/natural-language-understanding/v1.js'
)
const natural_language_understanding = new NaturalLanguageUnderstandingV1({
  username: '<username>',
  password: '<password>',
  version_date: '2017-02-27'
})

const analyzeType = text => {
  if (text.indexOf('ACT ') === 0) {
    return {
      type: 'ACT',
      text
    }
  } else if (text.indexOf('SCENE ') === 0) {
    return {
      type: 'SCENE',
      text: text.substring(text.indexOf('. ') + 2)
    }
  } else if (text.indexOf('Enter ') === 0) {
    return {
      type: 'ENTRY',
      text: text.substring(text.indexOf('Enter ') + 6)
    }
  } else {
    return {
      type: 'OTHERS',
      text
    }
  }
}

const createDialog = (combined, current) => {
  // We are under the impression that no combined will ever be empty array
  const lastEntry = combined.story[combined.story.length - 1]
  if (lastEntry.speaker !== current.speaker) {
    combined.speakers[current.speaker] = combined.speakers[current.speaker] || {
      lines: 0,
      imageUrl: ''
    }
    combined.speakers[current.speaker].lines++
    combined.story.push({
      type: 'DIALOG',
      text: current.text_entry,
      speaker: current.speaker
    })
  } else {
    lastEntry.text += ' '+current.text_entry
  }
}

const transform = (combined, current) => {
  let { line_number, text_entry, speaker } = current
  const [chapter, scene, line] = line_number
    .split('.')
    .map(number => parseInt(number))
  if (speaker === '') {
    // TODO Move out
    // createEvent(combined, current)
    const analysis = analyzeType(text_entry)
    combined.story.push({
      text_entry,
      text: analysis.text,
      type: analysis.type
    })
  } else {
    createDialog(combined, current)
  }
  return combined
}
const json = henryIV.reduce((combined, current) => {
  if (combined.line_number !== undefined) {
    combined = transform(
      {
        speakers: {},
        story: []
      },
      combined
    )
  }
  combined = transform(combined, current)
  return combined
})

const emotionalJson = {
  ...json,
  story: json.story.map(entry => {
    if (entry.speaker) {
      // natural_language_understanding.analyze(parameters, function(err, response) {
      //     if (err){
      //         console.log('error:', err);
      //     } else {
      //         entry.emotion = response
      //     }
      // });
    }
  })
}

const analyze = text => {
  return new Promise((resolve, reject) => {
    var parameters = {
      text,
      features: {
        emotion: {}
      }
    }
    natural_language_understanding.analyze(parameters, function (err, response) {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

const app = new Koa()
var router = new Router()

const story = {
  json: async (ctx, next) => {
    ctx.body = json
    next()
  },

  emotion: async (ctx, next) => {
    const resp = await analyze(json.story[ctx.params.id].text)
    ctx.body = {
      text: json.story[ctx.params.id].text,
      resp,
      id: ctx.params.id
    }
  }
}

router.get('/story', story.json).get('/emotion/:id', story.emotion)

app.use(cors()).use(router.routes()).use(router.allowedMethods())

app.listen(4000)
console.log('listening on port 4000')
