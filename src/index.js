import express from 'express';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import 'dotenv/config';
import 'colors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './models/db.js';
import favicon from 'serve-favicon';
import { router } from './controllers/studentController.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import RateLimit from 'express-rate-limit';


const __dirname = dirname(fileURLToPath(import.meta.url));

// * connect to database
connectDB();

const app = express();

// * give access to the views folder
app.set('views', path.join(__dirname, '/views/'));

// * allow to display views according to data from form input
// ! allow you to access prototype methods and properties of the input object from the template, e.g. {{this.fullName}}

app.engine('hbs', exphbs.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: 'hbs',
  defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts/'
}));

app.set('view engine', 'hbs');

// * allow access to public for favicon thanks to 'serve-favicon' package
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

// * to avoid CORS issues
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// * Body parser middlewares
app.use(express.urlencoded({ extended: true })); // for input values to be encoded
app.use(express.json());

app.use('/student', router);

// * display welcome message at 1st load
app.get('/', (req, res) => {
  res.send(`<h2>Welcome to Students database!</h2>
		<h3>Click here to get access to the
			<b><a href='/student/list'>Database</a></b></h3>`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port ' + port));


