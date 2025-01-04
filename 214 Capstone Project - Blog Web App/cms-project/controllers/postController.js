let posts = [];

exports.newPost = (req, res) => {
  res.render('post', { title: 'New Post', post: null });
};

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.redirect('/');
};

exports.editPost = (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id == postId);
  res.render('post', { title: 'Edit Post', post });
};

exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  let post = posts.find(p => p.id == postId);
  if (post) {
    post.title = title;
    post.content = content;
  }
  res.redirect('/');
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  posts = posts.filter(p => p.id != postId);
  res.redirect('/');
};

exports.getPosts = (req, res) => {
  res.render('index', { title: 'Home', posts });
};

exports.getPostById = (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id == postId);
  res.render('postDetail', { title: post.title, post });
};
