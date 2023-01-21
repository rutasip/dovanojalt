const jwt = require("jsonwebtoken");

const auth = (request, result, next) => {
  try {
    const token = request.header("x-auth-token");
    if (!token) {
      return result.status(401).json({
        message: "Nėra autentifikacijos žetono, autorizacja nepavyko",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return result.status(401).json({
        message: "Žetono patvirtinimas nepavyko, autorizacija atmesta",
      });
    }

    request.user = verified.id;
    next();
    return undefined;
  } catch (error) {
    return result.status(500).json({ error: error.message });
  }
};

module.exports = auth;
