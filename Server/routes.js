var express = require('express')
var router = express.Router()
var pool = require('./db')


/*
    POSTS ROUTES SECTION
*/

// GET all posts
router.get('/api/get/allposts', (req, res, next) => {
  pool.query("SELECT * FROM myblog.posts ORDER BY date_created DESC", (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});

// GET a specific post
router.get('/api/get/post', (req, res, next) => {
  const post_id = req.query.post_id;

  pool.query(
    `SELECT * FROM myblog.posts
     WHERE pid = ?`,
    [post_id],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// PUT (update) a post
router.put('/api/put/post', (req, res, next) => {
  const values = [
    req.body.title,
    req.body.body,
    req.body.uid,
    req.body.pid,
    req.body.username
  ];

  pool.query(
    `UPDATE myblog,posts SET title = ?, body = ?, user_id = ?, author = ?, date_created = NOW()
     WHERE pid = ?`,
    values,
    (q_err, q_res) => {
      console.log(q_res);
      console.log(q_err);
      res.json(q_res);
    }
  );
});

// DELETE post comments
router.delete('/api/delete/postcomments', (req, res, next) => {
  const post_id = req.body.post_id;

  pool.query(
    `DELETE FROM myblog.comments
     WHERE post_id = ?`,
    [post_id],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// DELETE a post
router.delete('/api/delete/post', (req, res, next) => {
  const post_id = req.body.post_id;

  pool.query(
    `DELETE FROM myblog.posts WHERE pid = ?`,
    [post_id],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// ... Other routes ...

//module.exports = router;



/*
    COMMENTS ROUTES SECTION
*/


router.put('/api/put/commenttodb', (req, res, next) => {
  const values = [ req.body.comment, req.body.user_id, req.body.post_id, req.body.username, req.body.cid]

  pool.query(`UPDATE comments SET
              comment = $1, user_id = $2, post_id = $3, author = $4, date_created=NOW()
              WHERE cid=$5`, values,
              (q_err, q_res ) => {
                  res.json(q_res.rows)
                  console.log(q_err)
      })
})


router.delete('/api/delete/comment', (req, res, next) => {
  const cid = req.body.comment_id
  console.log(cid)
  pool.query(`DELETE FROM comments
              WHERE cid=$1`, [ cid ],
              (q_err, q_res ) => {
                  res.json(q_res)
                  console.log(q_err)
      })
})


router.get('/api/get/allpostcomments', (req, res, next) => {
  const post_id = String(req.query.post_id)
  pool.query(`SELECT * FROM comments
              WHERE post_id=$1`, [ post_id ],
              (q_err, q_res ) => {
                  res.json(q_res.rows)
      })
})
*/


// POST a new comment to the database
router.post('/api/post/commenttodb', (req, res, next) => {
  const values = [
    req.body.comment,
    req.body.user_id,
    req.body.username,
    req.body.post_id
  ];

  pool.query(
    `INSERT INTO myblog.comments(comment, user_id, author, post_id, date_created)
     VALUES(?, ?, ?, ?, NOW())`,
    values,
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// PUT (update) a comment in the database
router.put('/api/put/commenttodb', (req, res, next) => {
  const values = [
    req.body.comment,
    req.body.user_id,
    req.body.post_id,
    req.body.username,
    req.body.cid
  ];

  pool.query(
    `UPDATE myblog.comments SET
     comment = ?, user_id = ?, post_id = ?, author = ?, date_created = NOW()
     WHERE cid = ?`,
    values,
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// DELETE a comment from the database
router.delete('/api/delete/comment', (req, res, next) => {
  const cid = req.body.comment_id;

  pool.query(
    `DELETE FROM myblog.comments
     WHERE cid = ?`,
    [cid],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// GET all comments for a specific post
router.get('/api/get/allpostcomments', (req, res, next) => {
  const post_id = String(req.query.post_id);

  pool.query(
    `SELECT * FROM myblog.comments
     WHERE post_id = ?`,
    [post_id],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res);
    }
  );
});

// ... Other routes ...

//module.exports = router;

/*
  USER PROFILE SECTION
*/

router.post('/api/post/userprofiletodb', (req, res, next) => {
  const values = [
    req.body.profile.nickname,
    req.body.profile.email,
    req.body.profile.email_verified
  ];

  const query = `
    INSERT INTO myblog.users (username, email, email_verified, date_created)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE email_verified = VALUES(email_verified)`;

  pool.query(query, values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});


router.get('/api/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email;

  const query = `SELECT * FROM myblog.users
                 WHERE email = ?`;

  pool.query(query, [email], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});



router.get('/api/get/userposts', (req, res, next) => {
  const user_id = req.query.user_id;

  const query = `SELECT * FROM posts
                 WHERE user_id = ?`;

  pool.query(query, [user_id], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});

router.get('/api/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email;

  const query = `SELECT * FROM myblog.users
                 WHERE email = ?`;

  pool.query(query, [email], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});



  router.put('/api/put/likes', (req, res, next) => {
  const uid = req.body.uid;
  const post_id = String(req.body.post_id);

  const values = [uid, post_id];

  const query = `UPDATE myblog.posts
                 SET like_user_id = CONCAT(like_user_id, ?), likes = likes + 1
                 WHERE NOT FIND_IN_SET(?, like_user_id)
                 AND pid = ?`;

  pool.query(query, values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});


//Search Posts

router.get('/api/get/searchpost', (req, res, next) => {
  const search_query = String(req.query.search_query);
  const query = `SELECT * FROM myblog.posts
                 WHERE MATCH (title, body, author) AGAINST (? IN BOOLEAN MODE)`;
  pool.query(query, [search_query], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});


//Save posts to db


/* Retrieve another users profile from db based on username */

router.post('/api/post/posttodb', (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;
  const username = req.body.username;
  const uid = req.body.uid;

  const query = `INSERT INTO myblog.posts (title, body, search_vector, user_id, author, date_created)
                 VALUES (?, ?, MATCH (title, body, author) AGAINST (? IN BOOLEAN MODE), ?, ?, NOW())`;

  const values = [title, body, `${title} ${body} ${username}`, uid, username];

  pool.query(query, values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});




router.get('/api/get/otheruserprofilefromdb', (req, res, next) => {
  const username = String(req.query.username);
  const query = `SELECT * FROM myblog.users
                 WHERE username = ?`;
  pool.query(query, [username], (q_err, q_res) => {
    res.json(q_res);
  });
});


//Get another user's posts based on username
router.get('/api/get/otheruserposts', (req, res, next) => {
  const username = String(req.query.username);
  const query = `SELECT * FROM myblog.posts
                 WHERE author = ?`;
  pool.query(query, [username], (q_err, q_res) => {
    res.json(q_res);
  });
});


//Send Message to db
router.post('/api/post/messagetodb', (req, res, next) => {
  const from_username = String(req.body.message_sender);
  const to_username = String(req.body.message_to);
  const title = String(req.body.title);
  const body = String(req.body.body);

  const query = `INSERT INTO myblog.messages (message_sender, message_to, message_title, message_body, date_created)
                 VALUES (?, ?, ?, ?, NOW())`;

  const values = [from_username, to_username, title, body];

  pool.query(query, values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});



//Get another user's posts based on username
router.get('/api/get/usermessages', (req, res, next) => {
  const username = String(req.query.username);
  
  const query = `SELECT * FROM myblog.messages
                 WHERE message_to = ?`;

  pool.query(query, [username], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});


//Delete a message with the message id
router.delete('/api/delete/usermessage', (req, res, next) => {
  const mid = req.body.mid;

  const query = `DELETE FROM myblog.messages
                 WHERE mid = ?`;

  pool.query(query, [mid], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res);
  });
});



module.exports = router
