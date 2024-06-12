import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userid FROM likes WHERE postid = $1";

  db.query(q, [req.query.postid], (err, { rows: data }) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userid));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (userid,postid) VALUES ($1,$2)";
    const values = [userInfo.id, req.body.postid];

    db.query(q, values, (err) => {
      if (err) return res.status(500).json(err);
      const q1 = "UPDATE posts SET totallikes=totallikes+1 WHERE id=$1";
      db.query(q1, [req.body.postid], (err) => {
        console.log(err);
      });
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log("like 40");
    const q = "DELETE FROM likes WHERE userid = $1 AND postid = $2";

    db.query(q, [userInfo.id, req.query.postid], (err) => {
      if (err) return res.status(500).json(err);
      const q1 = "UPDATE posts SET totallikes=totallikes-1 WHERE id=$1";
      db.query(q1, [req.query.postid], (err) => {
        if (err) return res.status(500).json(err);
      });
      return res.status(200).json("Post has been disliked.");
    });
  });
};
