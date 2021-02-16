if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI: "mongodb+srv://admin:admin123@cluster0.5xsqf.mongodb.net/projeto-7-prod?retryWrites=true&w=majority"
  }
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/blogapp"
  }
}