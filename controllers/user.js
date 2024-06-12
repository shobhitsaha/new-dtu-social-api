import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getUser = (req, res) => {
  const userid = req.params.userid;
  const q = "SELECT * FROM users WHERE id=$1";

  db.query(q, [userid], (err, { rows: data }) => {
    if (err) return res.status(500).json(err);
    if (data.length == 0) return res.status(404).json("user not found");
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const getId = (req, res) => {
  const username = req.query.username;
  const q = "SELECT id FROM users WHERE username=$1";
  db.query(q, [username], (err, { rows: data }) => {
    if (err) return res.status(500).json(err);
    if (data.length == 0) return res.status(404).json(-1);
    const { id } = data[0];
    return res.status(200).json(id);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(403).json("pls login in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token invalidate");

    const q =
      "UPDATE users SET name=$1, city=$2, website=$3, profilepic=$4, coverpic=$5 WHERE id=$6";
    const { name, city, website, profile, cover } = req.body;
    const values = [name, city, website, profile, cover, userInfo.id];

    db.query(q, values, (err) => {
      const data = { affectedRows: 1 };
      if (err) res.status(500).json(err);
      // console.log(resp);
      else if (data.affectedRows > 0) {
        //Updating info in local storage.
        const q2 = "SELECT * FROM users WHERE id = $1";
        db.query(q2, [userInfo.id], (err, { rows: newData }) => {
          if (err) res.status(500).json(err);

          const { password, ...others } = newData[0];
          console.log(newData);
          res.status(200).json(others);
        });
        // res.status(200);
      } else res.status(403).json("You can update only your profile");
    });
  });
};
