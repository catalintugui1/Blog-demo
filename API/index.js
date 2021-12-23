// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const { v4: uuidv4 } = require('uuid');

const fs = require("fs");

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());



app.get("/articles/:id", (req, res) => {
    const articlesList = readJSONFile();
    const id = req.params.id;
    // let article = articlesList.find(article => article.id == id);


    // for (let i = 0; i < articlesList.length; i++) {
    //     console.log(articlesList[i])
    // }
    let article;
    for (let i = 0; i < articlesList.length; i++) {
        if (articlesList[i].id == id) {
            const nextId = i === articlesList.length - 1 ? null : articlesList[i + 1].id;
            const prevId = i === 0 ? null : articlesList[i - 1].id;

            article = {...articlesList[i], prevId, nextId };
            console.log(article);
        }
    }

    res.json(article);
});



app.post("/articles", (req, res) => {
    const articlesList = readJSONFile();
    // const bodyInfo = req.body;
    // const newArticle = {

    //         ...bodyInfo
    //     }
    //     // modify articleList to add a new element
    // const newArticleList = [...articlesList, newArticle];
    // writeJSONFile(newArticleList);
    // res.json(newArticle);

    let title = req.body.title;
    let tag = req.body.tag;
    let author = req.body.author;
    let date = req.body.date;
    let imgUrl = req.body.imgUrl;
    let saying = req.body.saying;
    let content = req.body.content
        // save dogsList to file

    articlesList.push({
        "id": uuidv4(),
        "title": title,
        "tag": tag,
        "author": author,
        "date": date,
        "imgUrl": imgUrl,
        "saying": saying,
        "content": content
    })

    writeJSONFile(articlesList);
    res.json(articlesList);
});


// Read All

app.get("/articles", (req, res) => {
    const articlesList = readJSONFile();
    // res.json(articlesList);

    let indexStart = req.query.indexStart;
    let indexEnd = req.query.indexEnd;
    console.log(articlesList);
    console.log(req);
    if (indexStart === undefined || indexEnd === undefined) {
        // res.json(articlesList);
        let articlesListObject = {
            articles: articlesList,
            numberOfArticles: articlesList.length
        }
        res.json(articlesListObject);
    } else {
        let newArticlesList = articlesList.filter((article, index) => indexStart <= index && indexEnd >= index);
        // res.json(newArticlesList);
        let articlesListObject = {
            articlesList: newArticlesList,
            numberOfArticles: articlesList.length
        }
        res.json(articlesListObject);
        // res.json(newArticlesList)
    }

});

app.put("/articles/:id", (req, res) => {
    const articlesList = readJSONFile();
    const updatedArticleId = req.params.id;
    let index = "";
    articlesList.forEach((element, indexElement) => {
        if (element.id == updatedArticleId) {
            index = indexElement;
        }
    });
    const updatedArticle = req.body;
    articlesList[index] = {...updatedArticle, id: articlesList[index].id };
    writeJSONFile(articlesList);
    res.json(articlesList[index])
        // Fill in your code here
});

// Reading function from db.json file
function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["articles"];
}

// Writing function from db.json file
function writeJSONFile(content) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({ articles: content }),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

// Starting the server
app.listen("3007", () =>
    console.log("Server started at: http://localhost:3007")
);