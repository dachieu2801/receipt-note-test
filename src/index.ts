import express from 'express'
import bodyParser from 'body-parser'
import db from './config/db'
import routes from './routes/index'
import { engine } from 'express-handlebars';
import path from 'path';


const app = express();

const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect postgreSQL
db.connect()

// Set up Handlebars as the view engine
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));



// routes
routes(app)

app.listen(port);


export default app