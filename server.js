const express = require('express');
const _ = require('lodash');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json()) // new

app.get('/api/blog-stats', async (req, res) => {
    try {
        // Define the URL of the external blog data source
        const blogDataUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    
        // Define headers (replace with your actual headers)
        const headers = {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        };

        const response = await axios.get(blogDataUrl, { headers } );

        const searchWord = "privacy";
        const blogs = response.data['blogs'];
        const sortedData = _.sortBy(blogs, 'title');
        const numberOfBlogs = _.size(blogs);
        const blogByLongestTitle =  _.maxBy(blogs, (obj) => obj.title.length);
        const titleContainsPrivacy = _.filter(blogs, (obj) => _.includes(obj.title.toLowerCase(), searchWord.toLowerCase()));
        const countOfBlogsWithPrivacy = _.size(titleContainsPrivacy);
        const uniqueBlogs = _.uniqBy(blogs, 'title');
        const countOfUniqueBlogs = uniqueBlogs.length;

        const jsonData = {
            numberOfBlogs,
            blogByLongestTitle,
            countOfBlogsWithPrivacy,
            countOfUniqueBlogs,
        };

        res.json(jsonData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/search', (req, res) => {
    res.render('index');
});

app.get('/api/blog-search', async (req, res) => {
    try {
        // Get the 'query' parameter from the request URL
        const searchQuery = req.query.query;

        // Define the URL of the external blog data source
        const blogDataUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';

        // Define headers (replace with your actual headers)
        const headers = {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        };

        // Fetch the blog data from the external source
        const response = await axios.get(blogDataUrl, { headers });

        // Get the 'blogs' data from the response
        const blogs = response.data['blogs'];

        // Filter blogs that contain the search query in their title
        const matchingBlogs = _.filter(blogs, (blog) =>
        _.includes(blog.title.toLowerCase(), searchQuery.toLowerCase())
        );

        // Send the matching blogs as a JSON response
        res.json(matchingBlogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})