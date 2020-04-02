const express = require('express');
const axios = require('axios');
const utils = require('./server/utils')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const queryString = require('querystring');
const uuid = require('uuid');
// const cookieParser = require('cookie-parser');
const userCache = new Map();

// app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json())

app.get('/search', (req, res) => {
    console.log('/search invoked');
    const place = req.query.place;
    const url = utils.mapPlaceSearchUrl(place)
    axios.get(url).then((response) => {
        console.log(response.data.predictions);
        const results =  response.data.predictions.map((place) => ({description:place.description, placeId : place.place_id}))
        res.send(results);
    });
    
});

app.get('/place/:placeId', (req,res)=> {
    const placeId = req.params.placeId;
    const url = utils.placeByPlaceIdUrl(placeId);
    console.log('/place/:placeId invoked', placeId);
    axios.get(url).then((response) => {
        res.send({placeId: response.data.result.place_id, 
            formattedAddress:response.data.result.formatted_address,
            location: response.data.result.geometry.location
        });
    });
})


app.post('/auth/code', (req, res) => {
    if(req.body.code) { 
        const queryParams = queryString.stringify({
            client_id : process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: req.body.code,
            redirect_uri: process.env.REDIRECT_URL
        })

        const accessTokenUrl = `${process.env.FB_ACCESS_TOKEN_URL}?${queryParams}`;
        axios.get(accessTokenUrl).then(accessTokenResp => {
            const accessToken = accessTokenResp.data.access_token;
            const userDetailUrl = `${process.env.USER_DETAIL_URL}?access_token=${accessToken}`;
            axios.get(userDetailUrl).then(userDetailResp => {
                const user = userDetailResp.data;
                console.log('/auth/code invoked', user);
                const sessionId = uuid.v4();
                userCache.set(sessionId, user);
                res.send({"sessionId": sessionId});
            }).catch(ex => {
                console.log('exception while getting userDetailUrl', ex);
                res.send({error:'error while getting user detail'});
            })
        }).catch(ex=> {
            console.log('exception while getting access token', ex);
            res.send({error:'error while getting access token'});
        })
    } else {
        const error = req.body.error;
        //TODO need to think aout this scenario
        res.send('Error code recieved');
    }

});

app.post('/user', (req, res) => {
    const userSession = req.body.userSession;
    console.log('user session', userSession);
    console.log('/user invoked', userCache.get(userSession))
    let user = {};
    if(userSession && userCache.get(userSession)) {
        user = {
            isAuthenticated : true,
            name: userCache.get(userSession).name
        }
    } else {
        user = {
            isAuthenticated : false
        }
    }
    res.send(user);
});


app.listen(process.env.PORT, () => console.log('serer started at port:',  process.env.PORT));
