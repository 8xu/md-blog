const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const md = require('markdown-it')()
const fs = require('fs');
const matter = require('gray-matter');


const postsFolder = path.join(__dirname, 'posts');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static( path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    const posts = fs.readdirSync(postsFolder).map((file) => {
        const postFile = matter.read(path.join(postsFolder, file));
        return {
            id: file.replace('.md', ''),
            data: postFile.data
        };
    });
    // console.log(posts);

    return res.status(200).render('index', {
        posts: posts
    });

});

app.get('/posts/:id', (req, res) => {
    const id = req.params.id;

    const requestedPost = path.join(postsFolder, `${id}.md`);

    if (!fs.existsSync(requestedPost)) {
        return res.status(404).render('404');
    }

    const postFile = matter.read(requestedPost);
    

    const data = postFile.data;
    const content = md.render(postFile.content);

    return res.status(200).render('post', {
        data: data,
        content: content
    });
});

app.use((req, res) => {
    return res.status(404).render('404');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. 🚀`);
});