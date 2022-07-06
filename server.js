const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const port = process.env.PORT || 3001;

const app = jsonServer.create();
const router = jsonServer.router("db.json");

app.db = router.db;

const rules = auth.rewriter({
  users: 644,
  movies: 644,
  books: 644,

  // "/:userId/books": "/userBooks?userId=:userId",

  "/owner/books/:userId/:id": "/books?userId=:userId&id=:id",
  "/owner/movies/:userId/:id": "/movies?userId=:userId&id=:id",

  "/owner/:userId/books": "/users/:userId?_embed=books",
  "/owner/:userId/movies": "/users/:userId?_embed=movies",
});

app.use(`/test/:userId/books`, (req, res) => {
  const data = JSON.parse(JSON.stringify(app.db)).books;
  let count = 0;

  const dataFilter = data
    .filter((item) => item.userId === req.params.userId)
    .map((item) => {
      count++;
      return { ...item, userBook: count };
    });

  res.json(dataFilter);
});

app.use(`/change/:idTest/:userId`, (req, res) => {
  console.log(req.params.idTest);
  const data = JSON.parse(JSON.stringify(app.db)).books;
  const dataFilter = data.filter((item) => item.userId === req.params.idTest);
  res.json(dataFilter);
});

app.use(cors());
app.use(rules);
app.use(auth);
app.use(router);
app.listen(port);

console.log("Server is running on port:", port);

/* A senha do Kenzinho é 123456 */
