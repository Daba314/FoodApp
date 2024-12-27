const express = require("express");
const bcrypt = require("bcrypt");
const { getUsers, addNewUser } = require("../db/dbOperations");
const { generateToken } = require("../jwtHelper");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getUsers();

    return res.send(data);
  } catch (error) {
    const { message } = error;
    res.status(400).send({ message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { full_name, password } = req.body;

    const existingUserArray = await getUsers(full_name);

    if (existingUserArray.length === 0) {
      return res.sendStatus(404);
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUserArray[0].password
    );

    if (isPasswordMatch) {
      const user = {
        user_id: existingUserArray[0].id,
        user_name: existingUserArray[0].full_name,
      };
      
      const token = generateToken(user);
     
      res.send(token);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    const { message } = error;
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { full_name, password } = req.body;

    const existingUserArray = await getUsers(full_name);

    if (existingUserArray.length > 0) {
      return res.send("User already exist");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const data = {
      full_name,
      password: hashedPassword,
    };
    await addNewUser(data);
    res.sendStatus(200);
  } catch (error) {
    const { message } = error;
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

module.exports = router;
