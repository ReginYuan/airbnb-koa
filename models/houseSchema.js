const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
  id: Number, //id
  price: Number,//价格
  title: String, //手机号
  pictureUrl: String, //图片
  cityCode:String, //城市
  detail: {
    imgs: Array,
    info: Object,
    owner:Object
  } //登陆状态 1登录 0退出
});
module.exports = mongoose.model("house", houseSchema, "house");
