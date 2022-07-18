/**
 * 所有民宿接口模块
 */

const router = require("koa-router")();
const House = require("../models/houseSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
router.prefix("/house");

router.get("/all", async (ctx, next) => {
  try {
    // 查询所有数据
    const { pageNum, pageSize, cityCode } = ctx.request.query;
    const query = House.find({ cityCode });
    // 根据前端数据快速查询页面和下一个索引
    const { page, skipIndex } = util.pager(pageNum, pageSize);
    // 统计数据总条数
    let total = await House.countDocuments({ cityCode });
    let list;
    // 从skipIndex开始查询数据,page.pageSize条数据
    let skipNum = total - (pageNum - 1) * pageSize;
    if (skipNum > 10) {
      list = await query.skip(skipIndex).limit(page.pageSize);
    } else {
      list = await query.skip(skipIndex).limit(skipNum);
    }

    if (query) {
      let msg = "民宿列表信息";
      ctx.body = util.success(
        {
          page: {
            ...page,
            total
          },
          list
        },
        msg
      );
    } else {
      ctx.body = util.fail("获取数据失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
