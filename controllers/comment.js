import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getComments = (req, res) => {
  const q =
    "SELECT c.*, name, profilepic  FROM comments AS c  JOIN users AS u ON c.userid=u.id WHERE postid =$1 ORDER BY c.createdat DESC";
  db.query(q, [req.query.postid], (err, { rows: data }) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

export const addComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(403).json("pls login in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status("invalid token. Pls re login");
    const q =
      "INSERT INTO comments(descr, createdat,postid, userid) VALUES ($1,$2,$3,$4)";
    const values = [
      req.body.descr,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      parseInt(req.query.postid),
      userInfo.id,
    ];
    console.log(values);
    db.query(q, values, (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("comment added");
    });
  });
};
