import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (req, res) => {
  const userid = req.query.userid;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("pls login");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token not valid");
    const q =
      userid !== "undefined"
        ? "SELECT p.*, u.id AS userid, name, profilepic FROM posts AS p JOIN users AS u ON (u.id = p.userid) WHERE p.userid = $1 ORDER BY p.createdat DESC"
        : "SELECT p.*, u.id AS userid, name, profilepic FROM posts AS p JOIN users AS u ON (u.id = p.userid) LEFT JOIN relationships AS r ON (p.userid = r.followedUserId) WHERE r.followerUserId= $1 OR p.userid =$2 ORDER BY p.createdat DESC";

    const values =
      userid !== "undefined" ? [userid] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, { rows: data }) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  // return res.status(200).json("Post has been created.");

  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("pls login");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token not valid");
    const q =
      "INSERT INTO posts(descr, img, createdat, userid) VALUES ($1,$2,$3,$4)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, values, (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const delPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE id=$1 AND userid = $2";

    db.query(q, [req.params.id, userInfo.id], (err, { rows: data }) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
