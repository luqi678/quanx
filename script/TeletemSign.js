/*
WPS_PC签到
仅测试Quantumult-X，nodejs，其他自测
2024-10-16 先这样写着能用，后期看情况再改

脚本参考 @小 白脸
https://t.me/NobyDa/896
https://raw.githubusercontent.com/githubdulong/Script/master/WPS_checkin.js

抓cookie(手机用qx，loon，surge等可以自动抓cookie，请自行配置)
用手机或者电脑进入https://vip.wps.cn/home登录后，找到cookie里面的wps_sid，格式如下
# 青龙环境变量     wps_pc_val = {"cookie":"wps_sid=xxxxxxxxxxxx"}

======调试区|忽略======
# ^https:\/\/(vip|account)(userinfo|\.wps\.cn\/p\/auth\/check)$ url script-request-header http://192.168.2.170:8080/wps.js
======调试区|忽略======

====================================
[rewrite_local]
^https:\/\/(vip|account)(userinfo|\.wps\.cn\/p\/auth\/check)$ url script-request-header https://raw.githubusercontent.com/luqi678/quanx/refs/heads/main/script/TeletemSign.js

[task_local]
1 0 * * * https://raw.githubusercontent.com/luqi678/quanx/refs/heads/main/script/TeletemSign.js, tag= WPS_PC签到, enabled=true

[mitm]
hostname = *.wps.cn
====================================
 */
const $ = new Env("联通日常签到");

// 在pc环境测试直接写入值
// $.data = {"@YaYa_10010.cookie": "@chavy_boxjs_userCfgs.httpapi222"};
// $.writedata();
// 建议这样写
// $.setdata('xxx', _key);
// $.writedata();

//获取boxjs环境变量
// 全量获取
// const loaddata = $.loaddata();
// console.log(loaddata);
// const ckval = $.toObj($.loaddata());
// 单key获取
//const ckval = $.getdata(_key);
//console.log(ckval);

// $.is_debug = 'true-'
// $.messages = [];
const newCookie = $.getdata("@ChinaUnicom.10010v4.cookie");

const cookie = newCookie;
const signCookie = newCookie;
const drawCookie = newCookie;

const headerEcs = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@11.0800}',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Host': 'activity.10010.com',
    'Connection': 'keep-alive',
    'Cookie': cookie,
    'Referer': 'https://img.client.10010.com/',
};
const headerPv = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@11.0800}',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Host': 'activity.10010.com',
    'Connection': 'keep-alive',
    'Cookie': signCookie,
    'Referer': 'https://img.client.10010.com/',
};

const headerDraw = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@11.0800}',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'epay.10010.com',
    'Cookie': drawCookie,
    'Referer': 'https://epay.10010.com/ci-mcss-party-web/rainbow/?templateName=20241025QYCJ&bizFrom=225&bizChannelCode=225&channelType=QDQP&rptid=rpt-e89934a9f9974c85b4aec9e184bd6609-prx',
};

const headerPrize = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@12.0200}',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'act.10010.com',
    'Connection': 'keep-alive',
    'Cookie': cookie,
    'Referer': 'https://img.client.10010.com/',
};


// 每日签到
$.post({url:"https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign",headers:headerPv,
        method: 'POST'},
    (err, resp, data) => {
        try {
            let res = JSON.parse(data);
            if (res.code !== '0000' && res.code !== '0002') {
                $.msg("联通签到失败", "每日签到结束", "");
                $.log(data);
            } else {
                $.log( "* 每日签到成功  " + (res.code === '0000' ? res.data.statusDesc + res.data.redSignMessage : res.desc));
            }
        } catch (e) {
            $.log(e);
            $.msg("联通签到失败", "详情", e); // Error!e
        } finally {
        }
    });

// 生成抢购uuid 为后面抢购做准备
async function queryPrizeList() {
    return new Promise((resolve, reject) => {
        $.post({
            url: "https://act.10010.com/SigninApp/new_convert/prizeList",
            headers: headerPrize,
            method: 'POST'
        }, async (err, resp, data) => {
            try {
                let res = JSON.parse(data);
                if (res.status !== '0000') {
                    $.msg("联通余额兑换", "查询余额失败", "");
                    $.log(data);
                    reject(err);
                } else {
                    const tabItems = res.data.datails.tabItems;
                    let targetProducts = [];
                    
                    // 遍历所有时间段
                    for (const tab of tabItems) {
                        // 找到"即将开始"的时间段
                        if (tab.state === "即将开始") {
                            // 遍历该时间段的所有商品
                            for (const product of tab.timeLimitQuanListData) {
                                // 找到话费充值抵扣券
                                if (product.product_name.includes("元话费充值抵扣券") && product.stockSurplus > 0) {
                                    targetProducts.push(product);
                                    $.log("* 找到目标商品: " + product.product_name);
                                    await generateUUID(product.product_id, product.product_name);
                                }
                            }
                        }
                    }
                    resolve(targetProducts);
                }
            } catch (e) {
                $.log(e);
                $.msg("联通余额兑换失败", "详情", e);
                reject(e);
            }
        });
    });
}

// 生成抢购uuid
function generateUUID(productId, product_name) {
    return new Promise((resolve, reject) => {
        $.post({
            url: "https://act.10010.com/SigninApp/convert/prizeConvert",
            headers: headerPrize,
            body: "product_id=" + productId,
            method: 'POST'
        }, (err, resp, data) => {
            try {
                let res = JSON.parse(data);
                if (res.status !== '0000') {
                    $.msg("联通余额兑换", "生成uuid失败", "");
                    $.log(data);
                    reject(err);
                } else {
                    $.log("* 生成uuid成功: " + res.data.uuid);
                    // 获取到uuid后不立即执行兑换，而是保存后为后面抢购做准备
                    let key = "@UnicomPrizeConvert.uuid" + product_name.replace("元话费充值抵扣券", "");
                    $.setdata(res.data.uuid, key);
                    resolve(res.data.uuid);
                }
            } catch (e) {
                $.log(e);
                $.msg("联通余额兑换失败", "详情", e);
                reject(e);
            }
        });
    });
}

// 每日登陆领取抽奖
async function dailyLogin() {
    return new Promise((resolve, reject) => {
        $.post({
            url: "https://epay.10010.com/ci-mcss-party-front/v1/rainbow/unifyDraw?activityId=BKQY2024CJ03&isBigActivity=1&bigActivityId=&bizFrom=225",
            headers: headerDraw,
            method: 'POST'
        }, (err, resp, data) => {
            try {
                let res = JSON.parse(data);
                if (res.code !== '0000') {
                    $.msg("联通签到失败", "每日登陆结束", "");
                    $.log(data);
                    reject(err);
                } else {
                    $.log("*  每日登陆成功  " + res.msg + res.txId);
                    resolve(res);
                }
            } catch (e) {
                $.log(e);
                $.msg("联通签到失败", "详情", e);
                reject(e);
            }
        });
    });
}

// 任务签到函数
async function taskSign() {
    return new Promise((resolve, reject) => {
        $.post({
            url: "https://activity.10010.com/sixPalaceGridTurntableLottery/task/taskList?type=2",
            headers: headerEcs,
            method: 'GET'
        }, async (err, resp, data) => {
            try {
                let res = JSON.parse(data);
                if (res.code === '0000') {
                    //循环任务列表
                    for (const item of res.data.tagList) {
                        $.log("开始" + item.tagName);
                        for (const task of item.taskDTOList) {
                            await completeTask(task);
                        }
                    }
                    resolve();
                } else {
                    $.msg("联通签到失败", "获取任务列表失败", data);
                    reject(err);
                }
            } catch (e) {
                $.log(e);
                $.msg("联通签到失败", "详情", e);
                reject(e);
            }
        });
    });
}

// 主函数
async function main() {
    try {
        // 先执行查询奖品列表
        await queryPrizeList();
        
        // 执行每日登录
        await dailyLogin();
        
        // 执行任务签到
        await taskSign();
    } catch (e) {
        $.log(e);
    } finally {
        $.done();
    }
}

// 启动主函数
main();

async function completeTask({id, taskName, buttonName, orderId}) {
    if (buttonName === "去领取") {
        //领取奖励
        let reward = await postPromise({
            url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/getTaskReward?taskId=${id}`,
            headers: headerPv,
            method: 'GET'
        });
        let rewardObj = JSON.parse(reward);
        if (rewardObj.code === '0000') {
            $.log("*  " + taskName + "  签到" + rewardObj.data.statusDesc + (rewardObj.data.code === '0000' ? rewardObj.data.prizeNameRed : rewardObj.data.desc));
        } else {
            $.log(reward);
        }
    } else if (buttonName === "已完成") {
        $.log("*  " + taskName + "  签到已完成");
    } else {

        let complete = await postPromise({
            url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/completeTask?taskId=${id}&orderId=&systemCode=QDQD`,
            headers: headerEcs,
            method: 'GET'
        });
        let completeObj = JSON.parse(complete);
        if (completeObj.code === '0000' || completeObj.code === '0311') {
            //完成任务 领取奖励
            await setTimeout(() => {
                $.log("*  等待两秒");
            }, 1000); // 2000 毫秒 = 2 秒
            let reward = await postPromise({
                url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/getTaskReward?taskId=${id}`,
                headers: headerPv,
                method: 'GET'
            })
            let rewardObj = JSON.parse(reward);
            if (rewardObj.code === '0000') {
                $.log("*  " + taskName + "  签到" + rewardObj.data.statusDesc + (rewardObj.data.code === '0000' ? rewardObj.data.prizeNameRed : rewardObj.data.desc));
            } else {
                $.log(reward);
            }
        } else {
            $.log("*  " + taskName + "  签到任务失败" + completeObj.desc);
        }

        await $.post({
                url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/completeTask?taskId=${id}&orderId=&systemCode=QDQD`,
                headers: headerEcs,
                method: 'GET'
            },
            async (err, resp, data) => {
                try {
                    let res = JSON.parse(data);
                    if (res.code === '0000' || res.code === '0311') {
                        //完成任务 领取奖励
                        await setTimeout(() => {
                            $.log("*  等待两秒");
                        }, 2000); // 2000 毫秒 = 2 秒

                        await $.post({
                                url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/getTaskReward?taskId=${id}`,
                                headers: headerPv,
                                method: 'GET'
                            },
                            (err, resp, data2) => {
                                try {
                                    let res2 = JSON.parse(data2);
                                    if (res2.code === '0000') {
                                        $.log("*  " + taskName + "  签到" + res2.data.statusDesc + (res2.data.code === '0000' ? res2.data.prizeNameRed : res2.data.desc));
                                    } else {
                                        $.log(res2);
                                    }
                                } catch (e) {
                                    $.log(e);
                                    $.msg("联通签到失败", "详情", e); // Error!e
                                } finally {
                                }
                            })
                    } else {
                        $.log("*  " + taskName + "  签到任务失败" + res.desc);
                    }
                } catch (e) {
                    $.log(e);
                    $.msg("联通签到失败", "详情", e); // Error!e
                } finally {
                }
            });
    }
}


async function postPromise(request) {
    return new Promise((resolve, reject) => {
        $.post(request, (err, resp, data) => {
            if (err) {
                reject(err); // 如果出错，Promise reject
            } else {
                resolve(data); // 成功时，Promise resolve 返回响应和正文
            }
        });
    });
}



function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }

        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? {url: opts} : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }

            const delayPromise = (promise, delay = 1000) => {
                return Promise.race([
                    promise,
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error('请求超时'))
                        }, delay)
                    })
                ])
            }

            const call = new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(resp)
                })
            })

            return opts.timeout ? delayPromise(call, opts.timeout) : call
        }

        get(opts) {
            return this.send.call(this.env, opts)
        }

        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }

    return new (class {
        constructor(name, opts) {
            this.logLevels = {debug: 0, info: 1, warn: 2, error: 3}
            this.logLevelPrefixs = {
                debug: '[DEBUG] ',
                info: '[INFO] ',
                warn: '[WARN] ',
                error: '[ERROR] '
            }
            this.logLevel = 'info'
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.encoding = 'utf-8'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name}, 开始!`)
        }

        getEnv() {
            if ('undefined' !== typeof $environment && $environment['surge-version'])
                return 'Surge'
            if ('undefined' !== typeof $environment && $environment['stash-version'])
                return 'Stash'
            if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
            if ('undefined' !== typeof $task) return 'Quantumult X'
            if ('undefined' !== typeof $loon) return 'Loon'
            if ('undefined' !== typeof $rocket) return 'Shadowrocket'
        }

        isNode() {
            return 'Node.js' === this.getEnv()
        }

        isQuanX() {
            return 'Quantumult X' === this.getEnv()
        }

        isSurge() {
            return 'Surge' === this.getEnv()
        }

        isLoon() {
            return 'Loon' === this.getEnv()
        }

        isShadowrocket() {
            return 'Shadowrocket' === this.getEnv()
        }

        isStash() {
            return 'Stash' === this.getEnv()
        }

        toObj(str, defaultValue = null) {
            try {
                return JSON.parse(str)
            } catch {
                return defaultValue
            }
        }

        toStr(obj, defaultValue = null, ...args) {
            try {
                return JSON.stringify(obj, ...args)
            } catch {
                return defaultValue
            }
        }

        getjson(key, defaultValue) {
            let json = defaultValue
            const val = this.getdata(key)
            if (val) {
                try {
                    json = JSON.parse(this.getdata(key))
                } catch {
                }
            }
            return json
        }

        setjson(val, key) {
            try {
                return this.setdata(JSON.stringify(val), key)
            } catch {
                return false
            }
        }

        getScript(url) {
            return new Promise((resolve) => {
                this.get({url}, (err, resp, body) => resolve(body))
            })
        }

        runScript(script, runOpts) {
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata(
                    '@chavy_boxjs_userCfgs.httpapi_timeout'
                )
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout =
                    runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http://${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: {
                        'X-Key': key,
                        'Accept': '*/*'
                    },
                    policy: 'DIRECT',
                    timeout: httpapi_timeout
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }

        loaddata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(
                    process.cwd(),
                    this.dataFile
                )
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile =
                    !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile
                        ? curDirDataFilePath
                        : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(
                    process.cwd(),
                    this.dataFile
                )
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile =
                    !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }

        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }

        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
            path
                .slice(0, -1)
                .reduce(
                    (a, c, i) =>
                        Object(a[c]) === a[c]
                            ? a[c]
                            : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
                    obj
                )[path[path.length - 1]] = value
            return obj
        }

        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }

        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey
                    ? objdat === 'null'
                        ? null
                        : objdat || '{}'
                    : '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }

        getval(key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.read(key)
                case 'Quantumult X':
                    return $prefs.valueForKey(key)
                case 'Node.js':
                    this.data = this.loaddata()
                    return this.data[key]
                default:
                    return (this.data && this.data[key]) || null
            }
        }

        setval(val, key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.write(val, key)
                case 'Quantumult X':
                    return $prefs.setValueForKey(val, key)
                case 'Node.js':
                    this.data = this.loaddata()
                    this.data[key] = val
                    this.writedata()
                    return true
                default:
                    return (this.data && this.data[key]) || null
            }
        }

        initGotEnv(opts) {
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if (opts) {
                opts.headers = opts.headers ? opts.headers : {}
                if (opts) {
                    opts.headers = opts.headers ? opts.headers : {}
                    if (
                        undefined === opts.headers.cookie &&
                        undefined === opts.headers.Cookie &&
                        undefined === opts.cookieJar
                    ) {
                        opts.cookieJar = this.ckjar
                    }
                }
            }
        }

        get(request, callback = () => {
        }) {
            if (request.headers) {
                delete request.headers['Content-Type']
                delete request.headers['Content-Length']

                // HTTP/2 全是小写
                delete request.headers['content-type']
                delete request.headers['content-length']
            }
            if (request.params) {
                request.url += '?' + this.queryStr(request.params)
            }
            // followRedirect 禁止重定向
            if (
                typeof request.followRedirect !== 'undefined' &&
                !request['followRedirect']
            ) {
                if (this.isSurge() || this.isLoon()) request['auto-redirect'] = false // Surge & Loon
                if (this.isQuanX())
                    request.opts
                        ? (request['opts']['redirection'] = false)
                        : (request.opts = {redirection: false}) // Quantumult X
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, {'X-Surge-Skip-Scripting': false})
                    }
                    $httpClient.get(request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, {hints: false})
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null,
                                {status, statusCode, headers, body, bodyBytes},
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    this.got(request)
                        .on('redirect', (resp, nextOpts) => {
                            try {
                                if (resp.headers['set-cookie']) {
                                    const ck = resp.headers['set-cookie']
                                        .map(this.cktough.Cookie.parse)
                                        .toString()
                                    if (ck) {
                                        this.ckjar.setCookieSync(ck, null)
                                    }
                                    nextOpts.cookieJar = this.ckjar
                                }
                            } catch (e) {
                                this.logErr(e)
                            }
                            // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                        })
                        .then(
                            (resp) => {
                                const {
                                    statusCode: status,
                                    statusCode,
                                    headers,
                                    rawBody
                                } = resp
                                const body = iconv.decode(rawBody, this.encoding)
                                callback(
                                    null,
                                    {status, statusCode, headers, rawBody, body},
                                    body
                                )
                            },
                            (err) => {
                                const {message: error, response: resp} = err
                                callback(
                                    error,
                                    resp,
                                    resp && iconv.decode(resp.rawBody, this.encoding)
                                )
                            }
                        )
                    break
            }
        }

        post(request, callback = () => {
        }) {
            const method = request.method
                ? request.method.toLocaleLowerCase()
                : 'post'

            // 如果指定了请求体, 但没指定 `Content-Type`、`content-type`, 则自动生成。
            if (
                request.body &&
                request.headers &&
                !request.headers['Content-Type'] &&
                !request.headers['content-type']
            ) {
                // HTTP/1、HTTP/2 都支持小写 headers
                request.headers['content-type'] = 'application/x-www-form-urlencoded'
            }
            // 为避免指定错误 `content-length` 这里删除该属性，由工具端 (HttpClient) 负责重新计算并赋值
            if (request.headers) {
                delete request.headers['Content-Length']
                delete request.headers['content-length']
            }
            // followRedirect 禁止重定向
            if (
                typeof request.followRedirect !== 'undefined' &&
                !request['followRedirect']
            ) {
                if (this.isSurge() || this.isLoon()) request['auto-redirect'] = false // Surge & Loon
                if (this.isQuanX())
                    request.opts
                        ? (request['opts']['redirection'] = false)
                        : (request.opts = {redirection: false}) // Quantumult X
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, {'X-Surge-Skip-Scripting': false})
                    }
                    $httpClient[method](request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    request.method = method
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, {hints: false})
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null,
                                {status, statusCode, headers, body, bodyBytes},
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    const {url, ..._request} = request
                    this.got[method](url, _request).then(
                        (resp) => {
                            const {statusCode: status, statusCode, headers, rawBody} = resp
                            const body = iconv.decode(rawBody, this.encoding)
                            callback(
                                null,
                                {status, statusCode, headers, rawBody, body},
                                body
                            )
                        },
                        (err) => {
                            const {message: error, response: resp} = err
                            callback(
                                error,
                                resp,
                                resp && iconv.decode(resp.rawBody, this.encoding)
                            )
                        }
                    )
                    break
            }
        }

        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {string} fmt 格式化参数
         * @param {number} 可选: 根据指定时间戳返回格式化日期
         *
         */
        time(fmt, ts = null) {
            const date = ts ? new Date(ts) : new Date()
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            }
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length)
                )
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                    )
            return fmt
        }

        /**
         *
         * @param {Object} options
         * @returns {String} 将 Object 对象 转换成 queryStr: key=val&name=senku
         */
        queryStr(options) {
            let queryString = ''

            for (const key in options) {
                let value = options[key]
                if (value != null && value !== '') {
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    }
                    queryString += `${key}=${value}&`
                }
            }
            queryString = queryString.substring(0, queryString.length - 1)

            return queryString
        }

        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts = {}) {
            const toEnvOpts = (rawopts) => {
                const {$open, $copy, $media, $mediaMime} = rawopts
                switch (typeof rawopts) {
                    case undefined:
                        return rawopts
                    case 'string':
                        switch (this.getEnv()) {
                            case 'Surge':
                            case 'Stash':
                            default:
                                return {url: rawopts}
                            case 'Loon':
                            case 'Shadowrocket':
                                return rawopts
                            case 'Quantumult X':
                                return {'open-url': rawopts}
                            case 'Node.js':
                                return undefined
                        }
                    case 'object':
                        switch (this.getEnv()) {
                            case 'Surge':
                            case 'Stash':
                            case 'Shadowrocket':
                            default: {
                                const options = {}

                                // 打开URL
                                let openUrl =
                                    rawopts.openUrl || rawopts.url || rawopts['open-url'] || $open
                                if (openUrl)
                                    Object.assign(options, {action: 'open-url', url: openUrl})

                                // 粘贴板
                                let copy =
                                    rawopts['update-pasteboard'] ||
                                    rawopts.updatePasteboard ||
                                    $copy
                                if (copy) {
                                    Object.assign(options, {action: 'clipboard', text: copy})
                                }

                                if ($media) {
                                    let mediaUrl = undefined
                                    let media = undefined
                                    let mime = undefined
                                    // http 开头的网络地址
                                    if ($media.startsWith('http')) {
                                        mediaUrl = $media
                                    }
                                        // 带标识的 Base64 字符串
                                    // data:image/png;base64,iVBORw0KGgo...
                                    else if ($media.startsWith('data:')) {
                                        const [data] = $media.split(';')
                                        const [, base64str] = $media.split(',')
                                        media = base64str
                                        mime = data.replace('data:', '')
                                    }
                                        // 没有标识的 Base64 字符串
                                    // iVBORw0KGgo...
                                    else {
                                        // https://stackoverflow.com/questions/57976898/how-to-get-mime-type-from-base-64-string
                                        const getMimeFromBase64 = (encoded) => {
                                            const signatures = {
                                                'JVBERi0': 'application/pdf',
                                                'R0lGODdh': 'image/gif',
                                                'R0lGODlh': 'image/gif',
                                                'iVBORw0KGgo': 'image/png',
                                                '/9j/': 'image/jpg'
                                            }
                                            for (var s in signatures) {
                                                if (encoded.indexOf(s) === 0) {
                                                    return signatures[s]
                                                }
                                            }
                                            return null
                                        }
                                        media = $media
                                        mime = getMimeFromBase64($media)
                                    }

                                    Object.assign(options, {
                                        'media-url': mediaUrl,
                                        'media-base64': media,
                                        'media-base64-mime': $mediaMime ?? mime
                                    })
                                }

                                Object.assign(options, {
                                    'auto-dismiss': rawopts['auto-dismiss'],
                                    'sound': rawopts['sound']
                                })
                                return options
                            }
                            case 'Loon': {
                                const options = {}

                                let openUrl =
                                    rawopts.openUrl || rawopts.url || rawopts['open-url'] || $open
                                if (openUrl) Object.assign(options, {openUrl})

                                let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                                if ($media?.startsWith('http')) mediaUrl = $media
                                if (mediaUrl) Object.assign(options, {mediaUrl})

                                console.log(JSON.stringify(options))
                                return options
                            }
                            case 'Quantumult X': {
                                const options = {}

                                let openUrl =
                                    rawopts['open-url'] || rawopts.url || rawopts.openUrl || $open
                                if (openUrl) Object.assign(options, {'open-url': openUrl})

                                let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                                if ($media?.startsWith('http')) mediaUrl = $media
                                if (mediaUrl) Object.assign(options, {'media-url': mediaUrl})

                                let copy =
                                    rawopts['update-pasteboard'] ||
                                    rawopts.updatePasteboard ||
                                    $copy
                                if (copy) Object.assign(options, {'update-pasteboard': copy})

                                console.log(JSON.stringify(options))
                                return options
                            }
                            case 'Node.js':
                                return undefined
                        }
                    default:
                        return undefined
                }
            }
            if (!this.isMute) {
                switch (this.getEnv()) {
                    case 'Surge':
                    case 'Loon':
                    case 'Stash':
                    case 'Shadowrocket':
                    default:
                        $notification.post(title, subt, desc, toEnvOpts(opts))
                        break
                    case 'Quantumult X':
                        $notify(title, subt, desc, toEnvOpts(opts))
                        break
                    case 'Node.js':
                        break
                }
            }
            if (!this.isMuteLog) {
                let logs = ['', '==============📣系统通知📣==============']
                logs.push(title)
                subt ? logs.push(subt) : ''
                desc ? logs.push(desc) : ''
                console.log(logs.join('\n'))
                this.logs = this.logs.concat(logs)
            }
        }

        debug(...logs) {
            if (this.logLevels[this.logLevel] <= this.logLevels.debug) {
                if (logs.length > 0) {
                    this.logs = [...this.logs, ...logs]
                }
                console.log(
                    `${this.logLevelPrefixs.debug}${logs.map((l) => l ?? String(l)).join(this.logSeparator)}`
                )
            }
        }

        info(...logs) {
            if (this.logLevels[this.logLevel] <= this.logLevels.info) {
                if (logs.length > 0) {
                    this.logs = [...this.logs, ...logs]
                }
                console.log(
                    `${this.logLevelPrefixs.info}${logs.map((l) => l ?? String(l)).join(this.logSeparator)}`
                )
            }
        }

        warn(...logs) {
            if (this.logLevels[this.logLevel] <= this.logLevels.warn) {
                if (logs.length > 0) {
                    this.logs = [...this.logs, ...logs]
                }
                console.log(
                    `${this.logLevelPrefixs.warn}${logs.map((l) => l ?? String(l)).join(this.logSeparator)}`
                )
            }
        }

        error(...logs) {
            if (this.logLevels[this.logLevel] <= this.logLevels.error) {
                if (logs.length > 0) {
                    this.logs = [...this.logs, ...logs]
                }
                console.log(
                    `${this.logLevelPrefixs.error}${logs.map((l) => l ?? String(l)).join(this.logSeparator)}`
                )
            }
        }

        log(...logs) {
            if (logs.length > 0) {
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.map((l) => l ?? String(l)).join(this.logSeparator))
        }

        logErr(err, msg) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                case 'Quantumult X':
                default:
                    this.log('', `❗️${this.name}, 错误!`, msg, err)
                    break
                case 'Node.js':
                    this.log(
                        '',
                        `❗️${this.name}, 错误!`,
                        msg,
                        typeof err.message !== 'undefined' ? err.message : err,
                        err.stack
                    )
                    break
            }
        }

        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
            this.log()
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                case 'Quantumult X':
                default:
                    $done(val)
                    break
                case 'Node.js':
                    process.exit(1)
            }
        }
    })(name, opts)
}