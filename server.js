const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const connectSqlite = require("connect-sqlite3");
const ContactsManager = require("./SQLiteContactsManager");
const UsersManager = require("./SQLiteUsersManager");

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

const app = express();
const SQLiteStore = connectSqlite(session);

app.use(
  session({
    store: new SQLiteStore({
      db: "sessions",
      table: "sessions",
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(cors());
app.use(express.json());

const contactsManager = new ContactsManager();
const usersManager = new UsersManager();

// Route for user-register
app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;

  bcrypt.hash(enteredPassword, 10, async (err, hash) => {
    const newUser = { username: username, password: hash };
    await usersManager.addUser(newUser).then(() => {
      req.session.regenerate(() => {
        res.redirect("/api/users");
        req.session.user = newUser;
      });
    });
  });
});

// Route for user-login
app.post("/api/users/login", async (req, response) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;

  await usersManager.getUser(username).then((found) => {
    console.log(username);
    if (found) {
      console.log("User's username was found in the database");
      console.log(found);
      bcrypt.compare(enteredPassword, found.password, (err, res) => {
        console.log(found.password);
        if (res) {
          req.session.regenerate(() => {
            console.log("password matches ! Redirecting...");
            response.redirect("/api/users");
            req.session.found = found.username;
            req.session.isAuth = true;
            console.log(req.session);
          });
        } else {
          console.log("password did not match... redirecting to  register");
          response.redirect("/api/users");
        }
      });
    } else {
      console.log("username did not match... redirecting to register");
      response.redirect("/api/users");
    }
  });
});

//Route for log-out
app.post("api/users/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error;
    console.log("User logout");
    res.redirect("/");
  });
});

// Route for getting all users
app.get("/api/users", async (req, res, err) => {
  if (req.session) {
    const users = await usersManager.getUsers();
    users.forEach((user) => {
      user.href = `/api/users/${user.id}`;
    });
    res.status(200).send(users);
    console.log("getting all users");
  } else {
    res.status(401);
    res.redirect("/");
    console.log("err");
  }
});

//Route for getting an user by id
app.get("/api/users/:id", async (req, res) => {
  if (req.session) {
    const id = parseInt(req.params.id);
    const user = await usersManager.getUserById(id);
    if (user) {
      res.status(200).send(user);
      console.log("showing an user");
    } else {
      res.status(404).send();
    }
  }
});

// Route for adding contact
app.post("/api/contacts", async (req, res) => {
  if (req.session) {
    const contact = req.body;
    const id = await contactsManager.addContact(contact);
    contact.href = `/api/contacts/${id}`;
    res.status(201).location(`/api/contacts/${id}`).send(contact);
  } else {
    res.status(401);
    res.redirect("/");
    console.log("err");
  }
});

//Route for showing all contacts
app.get("/api/contacts", async (req, res) => {
  const contacts = await contactsManager.getContacts();
  contacts.forEach((contact) => {
    contact.href = `/api/contacts/${contact.id}`;
  });
  res.status(200).send(contacts);
});

// Route for showing a contact by id
app.get("/api/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const contact = await contactsManager.getContact(id);
  if (contact) {
    res.status(200).send(contact);
  } else {
    res.status(404).send();
    // const { isNotAuth, isAuth, currentUser } = require("./appMiddleware");
  }
});

// Route for updating a contact
app.put("/api/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const existingContact = await contactsManager.getContact(id);
  if (existingContact) {
    const contact = req.body;
    await contactsManager.updateContact(id, contact);
    res.status(200).send();
  } else {
    const contact = req.body;
    const id = await contactsManager.addContact(contact);
    res.status(200).location(`/api/contacts/${id}`).send();
  }
});

// Route for deleting a contact
app.delete("/api/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await contactsManager.deleteContact(id);
  res.status(200).send();
});

// End of routes
const server = app.listen(PORT, () => {
  console.log(`web service laueft unter http://${HOST}:${PORT}`);
});

/*   usersManager.getUser(email, async (err, user) => {
    if (err) return res.status(500).send("Server error!");
    if (!user) return res.status(404).send("User not found!");
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(401).send("Password not valid!");

    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: expiresIn,
    });
    res
      .status(200)
      .send({ user: user, access_token: accessToken, expires_in: expiresIn });
  }); */
