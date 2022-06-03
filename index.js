const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwauo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();

        const bookingRoomCollection = client.db('super-home').collection('booking-room-collection');


        app.post('/booking', async (req, res) => {
            const bookingInfo = req.body;
            const filter = { email: bookingInfo.email, room: bookingInfo.room, arrivalDate: bookingInfo.arrivalDate };
            const bookingExists = await bookingRoomCollection.findOne(filter);
            if (bookingExists) {
                return res.send({ success: false, exists: bookingExists })
            }
            const result = await bookingRoomCollection.insertOne(bookingInfo);
            res.send({ success: true, result })

            // res.send(result)

        })

        //get all booking by specific email
        app.get('/my-bookings/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);

        })

    }
    finally {

    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('super home server running');
})
app.listen(port, () => {
    console.log(port);
})
