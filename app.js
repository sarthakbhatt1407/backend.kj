const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const mysql = require("mysql");
const app = express();

function handleDisconnect() {
  const connection = mysql.createConnection({
    port: 3306,
    host: "103.110.127.141", // Change this to your MySQL server address
    user: "beatlebuddy_kj_user", // Change this to your MySQL username
    password: "%@?AuQl[.(9[", // Change this to your MySQL password
    database: "beatlebuddy_kj", // Change this to your MySQL database name
    connectTimeout: 10000,
  });

  // connection.connect((error) => {
  //   if (error) {
  //     console.error("Error connecting to MySQL database:", error);
  //   } else {
  //     app.listen(port, () => {
  //       console.log(`listening on port:${port}`);
  //     });
  //     console.log("Connected to MySQL database!");
  //   }
  // });

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      app.listen(port, () => {
        console.log(`listening on port:${port}`);
      });
      console.log("Connected to MySQL database!");
    }
  });
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

const baseUploadsPath = path.join(__dirname, "uploads");
const cors = require("cors");
// const videoRoutes=require('./Routes/videoRoutes.js');
const audioBookRoutes = require("./Routes/audioBookRoutes.js");
const categoryRoutes = require("./Routes/categoryRoutes.js");
const ebookRoutes = require("./Routes/eBookRoutes.js");
const shopRoutes = require("./Routes/shopRoutes.js");
const podcastRoutes = require("./Routes/podcastRoutes.js");
const shikshaRoutes = require("./Routes/shikshaRoutes.js");
const circleRoutes = require("./Routes/circleRoutes.js");
const communityRoutes = require("./Routes/communityRoutes.js");
const karyashalaRoutes = require("./Routes/karyashalaRoutes.js");
const pathshalaRoutes = require("./Routes/pathshalaRoutes.js");
const eventsRoutes = require("./Routes/eventsRoutes.js");
const creatorRoutes = require("./Routes/creatorRoutes.js");
const otherRoutes = require("./Routes/otherRoutes.js");
const channelRoutes = require("./Routes/channelRoutes.js");
const interestRoutes = require("./Routes/interestRoutes.js");
const liveRoutes = require("./Routes/liveRoutes.js");
const authRoutes = require("./Routes/authRoutes.js");

const port = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());

// image folders
app.use("/images/shop", express.static(path.join(baseUploadsPath, "shop")));
app.use(
  "/images/podcasts",
  express.static(path.join(baseUploadsPath, "podcasts"))
);
app.use("/images/ebooks", express.static(path.join(baseUploadsPath, "ebooks")));
app.use(
  "/images/audiobooks",
  express.static(path.join(baseUploadsPath, "audiobooks"))
);
app.use("/images/ebooks", express.static(path.join(baseUploadsPath, "ebooks")));
app.use("/images/events", express.static(path.join(baseUploadsPath, "events")));
app.use(
  "/images/karyashala",
  express.static(path.join(baseUploadsPath, "karyashala"))
);
app.use(
  "/images/pathshala",
  express.static(path.join(baseUploadsPath, "pathshala"))
);
app.use("/images/lives", express.static(path.join(baseUploadsPath, "lives")));
// app.use("/videos",videoRoutes);
app.use("/audiobooks", audioBookRoutes);
app.use("/category", categoryRoutes);
app.use("/ebooks", ebookRoutes);
app.use("/shop", shopRoutes);
app.use("/podcasts", podcastRoutes);
app.use("/shiksha", shikshaRoutes);
app.use("/circles", circleRoutes);
app.use("/communities", communityRoutes);
app.use("/karyashala", karyashalaRoutes);
app.use("/pathshala", pathshalaRoutes);
app.use("/events", eventsRoutes);
app.use("/creator", creatorRoutes);
app.use("/others", otherRoutes);
app.use("/channels", channelRoutes);
app.use("/interests", interestRoutes);
app.use("/lives", liveRoutes);
app.use("/auth", authRoutes);
app.use("/", (req, res) => {
  res.send("<h2>Hello beatlebuddy, Your app is live.");
  console.log("App is live.");
});
