if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI: "mongodb+srv://admin:admin123@cluster0.5xsqf.mongodb.net/Cluster0?retryWrites=true&w=majority"
  }
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/blogapp"
  }
}