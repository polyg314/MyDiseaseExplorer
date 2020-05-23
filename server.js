const express = require('express');

const app = express();

app.use(express.static('./dist'));

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') === 'https')
        res.redirect(`http://${req.header('host')}${req.url}`)
      else
        next()
    })
  }

app.get('*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/'}),
);


app.listen(process.env.PORT || 8080);

