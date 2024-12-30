const { getUsers, addNewUser } = require("../db/dbOperations");
const { generateToken } = require("../jwtHelper");
const bcrypt = require("bcrypt");

module.exports = {
  signup: async (args) => {
    const { full_name, password } = args.userInput;
    const existingUserArray = await getUsers(full_name);

    if (existingUserArray.length > 0) {
      throw new Error("User already exist");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const data = {
      full_name,
      password: hashedPassword,
    };
    const newUser = await addNewUser(data);
    return newUser;
  },
  login: async (args) => {
    const { full_name, password } = args.userInput;
    const existingUserArray = await getUsers(full_name);

    if (existingUserArray.length === 0) {
      throw new Error("There is no user with such name", full_name);
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
      return token;
    }
    else{
        throw new Error("Wrong credentials");
    }
  }
}