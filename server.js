const path = require('path');
const express = require('express');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const session = require('express-session');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
const fileUpload = require('express-fileupload');
// const formData = require('express-form-data');

const app = express();
const PORT = process.env.PORT || 3001;
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// creating the sess object
const sess = {
  secret: 'A secret is a secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({db: sequelize})
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(fileUpload());

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(routes);

// turn on connection to DB
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listning on PORT ${PORT}`));
});
