/**
 * 用户接口模块
 */

const router = require("koa-router")();
const Users = require("../models/userSchema");
const util = require("../utils/util");
const jwt = require("jsonwebtoken");
router.prefix("/users");

router.post("/login", async (ctx, next) => {
  try {
    const { mobile, password } = ctx.request.body;
    const res = await Users.findOne(
      {
        mobile,
        password
      },
      "mobile status"
    );
    if (res) {
      const res1 = await Users.findOneAndUpdate(
        {
          mobile: mobile //Matching condition
        },
        {
          $set: {
            status: "1" //Updates the matched element in the array
          }
        },
        { new: true, select: "mobile status" }
      );
      const data = res1;
      const token = jwt.sign(
        {
          data
        },
        "ReginYuan",
        { expiresIn: "1h" }
      );
      data.token = token;
      let msg = "登陆成功";
      ctx.body = util.success(data, msg);
    } else {
      ctx.body = util.fail("账号或密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

/**
 * 注册用户
 */
router.post("/sign", async (ctx, next) => {
  try {
    const { mobile, password } = ctx.request.body;
    const res = await Users.findOne(
      {
        mobile,
        password
      },
      "mobile"
    );
    if (res && res.mobile == mobile) {
      let msg = "用户已存在,请输入新账号";
      ctx.body = util.success(res, msg);
    } else {
      const res1 = await Users.insertMany({ mobile, password }, "mobile");
      let msg = "注册成功,请登录";
      ctx.body = util.success(res1, msg);
    }
  } catch (error) {
    ctx.body = util.fail("注册失败", error.msg);
  }
});

/**
 * 用户退出
 */
router.post("/logout", async (ctx, next) => {
  try {
    const { mobile, password } = ctx.request.body;
    const res = await Users.findOneAndUpdate(
      {
        mobile: mobile //Matching condition
      },
      {
        $set: {
          status: "0" //Updates the matched element in the array
        }
      },
      { new: true, select: "mobile status" }
    );
    if (res) {
      let msg = "退出成功";
      ctx.body = util.success(res, msg);
    }
  } catch (error) {
    ctx.body = util.fail("退出失败", error.msg);
  }
});

module.exports = router;
