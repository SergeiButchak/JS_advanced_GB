const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.append('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.append('Access-Control-Expose-Headers', 'Content-Length');
    res.append('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get('/catalogData', (req, res) => {
    fs.readFile('catalog.json', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.get('/cartData', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        res.send(data);
    });
});


app.post('/addItem', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{[]}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;
            let is_new = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i]['product_name'] === item['product_name']) {
                    cart[i]['quantity'] += item['quantity'];
                    is_new = false;
                    break;
                }
            }

            if (is_new)
                cart.push(item);

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.sendStatus(500);
                    res.send('{"result": "Sorry, we have some problem."}')
                } else {
                    console.log('The file has been saved!');
                    res.send(cart);
                }
            });
        }
    });
});

app.post('/deleteItem', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{[]}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;
            let new_cart = [];

            for (let i = 0; i < cart.length; i++) {
                if (cart[i]['product_name'] !== item['product_name']) {
                    new_cart.push(cart[i]);
                }
            }

            fs.writeFile('cart.json', JSON.stringify(new_cart), (err) => {
                if (err) {
                    res.sendStatus(500);
                    res.send('{"result": "Sorry, we have some problem."}')
                } else {
                    console.log('The file has been saved!');
                    res.send(new_cart);
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log('server is running on port 3000!');
});

