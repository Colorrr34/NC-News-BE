exports.invalidPathHandler = (req, res) => {
  res.status(400).send({ msg: "Invalid Path" });
};

exports.errorStatusHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid query" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: `Not Found` });
  }
};

exports.status500Handler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internet Server Error" });
};
