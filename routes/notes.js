const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const {v4 : uuidv4} = require('uuid')

notes.get('/', (req, res) => {
    console.log(`${req.method} request for database`)
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

//Gets the element with matching id
notes.get('/:id', (req, res) => {
    console.log(`${req.method} request for database`)
    const requestedId = req.params.id;

    readFromFile('./db/db.json').then((data) =>{ 
        const returnedJson = JSON.parse(data)
        for (let i = 0; i < returnedJson.length; i++) {
            if (requestedId === returnedJson[i].id) {
                return res.json(returnedJson[i])
            }
        }
    })
})

notes.post('/', (req, res) => {
    console.log(`${req.method} request for database`)
    
    const {title, text} = req.body;

    if(title && text) {
        const newTip = {
            title,
            text,
            id: uuidv4()
        }

        readAndAppend(newTip, './db/db.json')
        res.json('New tip added to database succesfully')
    } else {
        res.json('Error in adding tip')
    }


})

notes.delete('/:id', (req, res) => {
    res.send(`${req.method} received`)
    //assign id of note
    const requestedId = req.params.id;
    let modifiedJSON;
    readFromFile('./db/db.json').then((data) =>{ 
        const returnedJson = JSON.parse(data)
        for (let i = 0; i < returnedJson.length; i++) {
            if (requestedId === returnedJson[i].id) {
                console.log(`${returnedJson[i].title} tip has been deleted.`)
                returnedJson.splice(i, 1);
                return modifiedJSON = returnedJson;
            }
        }  
    }).then((data) => {
        writeToFile('./db/db.json', data)
    })

})

module.exports = notes