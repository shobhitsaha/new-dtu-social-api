import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import userRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
cloudinary.config({
  cloud_name: "dcixsckwx",
  api_key: "776976824986822",
  api_secret: "BWmEgvp4rp_LiUbYDHOPeWsdsJg",
});

// app.use(cors())
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));



// app.use(cookieParser());
app.use(cookieParser({
  sameSite: 'None', // Set SameSite attribute to None
  secure: true, // Ensure cookies are only sent over HTTPS
}));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/relationships", relationshipRoutes);

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "upload");
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.fieldname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
    // console.log(result, "index");
    res.status(200).json(result.secure_url);
  });
});

// app.use("/upload", express.static(path.join(__dirname, "upload")));

app.listen(process.env.PORT || 8800, () => {
  console.log(`API Working on port ${process.env.PORT || 8800}`);
});

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });
