import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const verifyLogin = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(403).json("pls login in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err || userInfo.id !== req.body.id)
      return res.status("invalid token. Pls re login");

    const q = "SELECT * FROM users WHERE id = $1";
    db.query(q, [userInfo.id], (err, { rows: data }) => {
      if (err) return res.status(500).json(err);

      const { password, ...others } = data[0];
      return res.status(200).json(others);
    });
  });
};

export const register = (req, res) => {
  //Check if user exists
  // console.log("register");
  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, { rows: data }) => {
    // console.log("first");
    if (err) {
      // console.log("register L31");
      return res.status(500).json(err);
    }
    if (data.length) {
      //username already exits
      return res.status(409).json({ code: "User already exists" });
    }
    // create a new user
    // Hash Password

    const { salt } = bcrypt.genSalt(10);
    const { username, email, password, name, profile, cover } = req.body;
    // console.log(req.body);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const q =
      "INSERT INTO users (username,email,password, name, profilepic, coverpic) VALUES ($1,$2,$3,$4,$5,$6)";
    db.query(
      q,
      [username, email, hashedPassword, name, profile, cover],
      (err, { rows: data }) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json("user created successfully.");
      }
    );
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, { rows: data }) => {
    console.log(data);
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ code: "user not found" });
    // console.log(data);
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(401).json({ code: "wrong password" });

    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("user logged out");
};
