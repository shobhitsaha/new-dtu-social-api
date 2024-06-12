import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId=$1";
  db.query(q, [req.query.followedUserId], (err, { rows: data }) => {
    if (err) return res.status(403).json(err);

    return res
      .status(200)
      .json(data.map((relation) => relation.followeruserid));
  });
};

export const addRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Plz login");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token expired");

    const q1 =
      "SELECT followerUserId FROM relationships WHERE followedUserId=$1";
    db.query(q1, [req.body.userid], (err, { rows: data }) => {
      if (err) return res.status(403).json(err);

      if (data.length > 0) return res.status(200).json("Already Following");

      const q2 =
        "INSERT INTO relationships(followerUserId,followedUserId) VALUES($1,$2)";
      db.query(q2, [userInfo.id, req.body.userid], (err) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json("following");
      });
    });
  });
};

export const deleteRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Plz login");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token expired");

    const q =
      "DELETE FROM relationships WHERE (followerUserId=$1 AND followedUserId=$2)";
    db.query(q, [userInfo.id, req.query.userid], (err) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("unfollowing");
    });
  });
};
