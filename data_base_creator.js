const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

let food = [{ name: "Milk", title: "Prostokvashino" }, { name: "Sausage", title: "Salami fouet" }, { name: "Bread", title: "Fitness" }];

mongoClient.connect(function (err, client) {
    const db = client.db("fooddb");
    const collection = db.collection("food");

    collection.insertMany(food, function (err, results) {
        if (err) { return console.log(err); }

        collection.find().toArray(function (err, results) {
            console.log(results);
            client.close();
        });
    });
});