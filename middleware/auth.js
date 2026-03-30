const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");

const auth = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(403).json({ msg: "unauthorized!" });
  }

  if (!cookies?.acess_token && !cookies?.refresh_token) {
    return res.status(403).json({ msg: "unauthorized!" });
  }

  let resultBody;

  if (!cookies?.acess_token && cookies.refresh_token) {
    try {
      const result = jwt.verify(cookies.refresh_token, process.env.REFRESH_KEY);
      const isexist = await sessionModel.findOne({
        _id: result?.session_id,
        valid: true,
      });

      if (!isexist) {
        return res.status(401).json({ msg: "session expired!" });
      }

      const isexistUser = await userModel.findOne({ _id: isexist.user_id });
      const acess_token = jwt.sign(
        { user_id: isexistUser.id, role: isexistUser?.role ?? "user" },
        process.env.JWT_KEY,
        { expiresIn: "2h" },
      );

      res.cookie("acess_token", acess_token, {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 60 * 60 * 1000,
      });

      resultBody = {
        user_id: isexistUser.id,
        role: isexistUser?.role ?? "user",
      };
    } catch (err) {
      return res.status(403).json({ msg: "unauthorized!", err: err.message });
    }
  } else {
    try {
      resultBody = jwt.verify(cookies.acess_token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(403).json({ msg: "unauthorized!", err: err.message });
    }

    const isexist = await userModel.findOne({ _id: resultBody.user_id });

    if (!isexist) {
      return res.status(403).json({ msg: "unauathorized!" });
    }
  }

  req.user = resultBody;
  req.body = req.body ?? {};
  req.body.user_id = resultBody.user_id;

  next();
};

module.exports = { auth };
