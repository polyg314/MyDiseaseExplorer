const express = require('express');

const app = express();


app.use(express.static('./dist'));

// console.log("HI2")

// app.use(function(request, response){
//     if(request.secure){
//         console.log("WHATTT")
//       response.redirect("http://" + request.headers.host + request.url);
//     }
// });


app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/'}),
);



app.listen(process.env.PORT || 8080);

