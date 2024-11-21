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
^https:\/\/(vip|account)(userinfo|\.wps\.cn\/p\/auth\/check)$ url script-request-header https://raw.githubusercontent.com/wf021325/qx/master/task/wps.js

[task_local]
1 0 * * * https://raw.githubusercontent.com/wf021325/qx/master/task/wps.js, tag= WPS_PC签到, enabled=true

[mitm]
hostname = *.wps.cn
====================================
 */
const $ = new Env("联通日常签到");
// const _key = 'wps_pc_val';
// const ckval = $.toObj($.getEnv(_key));
// $.is_debug = 'true-'
// $.messages = [];

// $.data = {"@chavy_boxjs_userCfgs.httpapi": "@chavy_boxjs_userCfgs.httpapi222"};
// $.writedata()

// const cookie1 = $.loaddata();
// console.log(cookie1);

const cookie = "ecs_cook=f1acf44e299c2e3ae244701e0c625ecc; PvSessionId=20241118192545D82E2C1B-7F41-4F59-8031-7EB31A8666E9; a_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzI1MzU5MjYsInRva2VuIjp7ImxvZ2luVXNlciI6IjEzMTIzMTg1NTEyIiwicmFuZG9tU3RyIjoieWg3ODExOTYxNzMxOTMxMTI2In0sImlhdCI6MTczMTkzMTEyNn0.GRnarByCqCQphlmiRNmuc9Ht7m-CVp6GUMd2WpriWN7XQmQ2JDaqwrN3RSf4qkg2iF3PGKhevwnD6zJV8L02EQ; c_id=71577ee37650f756bfafe99e3e01de8a9e7a79727bda42fe441c18a489184735; c_mobile=13123185512; c_version=iphone_c@11.0800; channel=GGPD; city=038|380|90411425|-99; cw_mutual=7064d003eb3c8934e769e430ecf3d64ac82c634186eaf0d6d7823ff9e48f8a8af916bf1556edf9df193f242c1b50f6407ed7dc19992640c8a7fae7e44ec46bcb; devicedId=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; ecs_token=eyJkYXRhIjoiYmIwMmVmY2E2NmNkNmNjN2E0MGFjMTliMjY1Y2E5ZjQwMWE5YTIwNzg2MmJkZDBkN2Y3NTMxNjAxYTcxYWEyMTY0YzVjMWZjZTE1OThhNWNlMGZkYmEwNWM3YTJmMTZkZGE0YjU0ZDExNmU4NmJhZjFlYzJjMzhmYjVmNjE3NzkyMmNhNjQzZDI3NzA5MWE5YTc5MDA2MTk2MTI3M2E2YTIxMThhZjRjNzFhYjJmNjAwMjczNDc4YmFkZGRhMWZjOTE0MGJmOWE0ZWY1OWU5NDYwYzY1MmY2N2U3MTkxNmY3ZmJiNTNhN2NmN2ExZDIwZTc5YzNmYTM3MTMzMzllNzUxNjkzOGVjOTM3MTZlODVmZGNkMmJkYWMxY2YyYmEyY2RkNWJjMjMzYjdlNzg0MmY5Yjk5YTUwMzVmYmNlZjUiLCJ2ZXJzaW9uIjoiMDAifQ==; enc_acc=gYkU9ne/ap/c/k/bW4X/TuYK9EWO5fM6FMIJlThzyXOd9vSq+tYvqhwSL/VzFqpiA4GGjJXPW7gYWrryVglg+j3zru5zl19qrf8z41ikTFyzHEBamtMHe+HopRSC6l4RuIiFDBgJEzxxpvPV1+ndEBgy7hNzxXjef7Zl2LS9dOo=; invalid_at=52cd2687eb263a09d7e9c6aeb93c86d2d2c62dec64d31624c6c70e82da05ee74; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIxMzEyMzE4NTUxMiIsInBybyI6IjAzOCIsImNpdHkiOiIzODAiLCJpZCI6ImYyZDc4Y2ExODM3NmRmNjRlOGIxNmNmMmI5YzI2NzQxIn0.uaa_gH2r1V1bY87UNVdcLHewNnCzkILb9xpSO0M356I; login_type=06; random_login=0; t3_token=06e80c228a027174ee212f7f7a0c7199; third_token=eyJkYXRhIjoiMTMyYzJlNGFmOTFiOWU0ZTRmMmMyMDQwOWVkNWU5NDJjZGYzNWYxZDYwMjIyZDczMWRiMTMwM2FmYmQyMzI0NWVjMDMzOGFkZTBkZjZkNDBiMjQ1Mjg0ZThkNWQzODgwOTgwMGMxM2FjZWNiYjgxOTMwMGI2ZGZhNTNkN2MwZmM1ZTU2MjlkMjAyMGNhNjVmYjJlMjhmZWUxNWMyNjg1NCIsInZlcnNpb24iOiIwMCJ9; u_account=13123185512; u_areaCode=; wo_family=0; SHOP_PROV_CITY=; tfstk=fp7mDnXVMp4n1_ornu8bbQ6iAkXDcjT17O39BFpa4LJWDh-27_8y1LQvHsL2QdXOpGpABR_kQt6SHKJADNfNF9v96EejSd5wFdnvHNBkUIOC5snvWYn5H1XMfS99QdXO_id0JyCfGFTNSJULJeLPHKQDQALwU9w-SJeLJzCfGFTaptH4iGik1LR2_FuaZ4RHUcuVQK-rUCO67F8NQ3zy9Ckqgm8ZazJW_FJNQFRtovpAUT_zHppzez6ZmZdDmdbeEcm86I-DLsJkNQ_u5nvFgL0gp6KyrdKGZ-uBCg8VKESuUqYAnaWHug2roeSCMEIPuQoUROg6a5Qof0K2NQvKynrP90yc7lFuZD5M0QOzk7Vofct2NQvLZ7mUYnRWarC..; tianjin_ip=0; tianjincity=11|110; sdkuuid=041ddd536a1b4620a8cbd9e2c2bd1c2d; SUCCESSBANNER=; SUCCESSPOPUP=; mallcity=38|380; GUESS_NUM=NTk5NzA5MTg=; MUT=359fb174-a854-4db1-982b-9f6aebc98e5b; TOKEN_NET=UNI; TOKEN_UID=a1vVBAr3LHRNKD2e5kAywA==; TOKEN_UID_ALL=%%7B%%22userNick%%22%%3A%%22%%25E9%%2599%%2586%%25E5%%25BB%%25BA%%22%%2C%%22phoneNum%%22%%3A%%2213123185512%%22%%2C%%22certNum%%22%%3A%%22352228********4516%%22%%7D; TOKEN_UID_NAME=jRhG4NJcYKQnHIKVpih99nAxWE64vzV0gpU4+R18XQqkxX5xg14RbuR2Z+VFqjY0HUPC3KstIMlNOKpD3auySIf2MsU2yanVfOnW8onXnJEjjTdTmisLww00PsFuUXuRWt0T5lZKXtKIHeoXBD2gkD9xt5cVeGZSbHkb/eLNZsE7hDN0xzu2IuNAYPj2oEYXVKgfV3YB8uJ7+8ZEiXEZWNXOVJpoudTwuq7JpH95ziQ=; TOKEN_UID_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; TOKEN_USER_NET=1; TOKEN_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; usercity=38|380; cdn_area=38|380; MUT_V=iphone_c%%254011.0800; _agent_r_n=90d9ca1efe9b6ab2a499d2e12a264f84cd2943e8d6afc63b252b561a57ed3513; _uop_id=npfauth_num7cpvr4cd2ab795446f6564fe67027e660e235ojm8582b; MALL_P_C_N=38%%7C380%%7CUNI; MHistoryGoodsInfo=; gipgeo=38|380; d_deviceCode=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; ecs_acc=cKMzqpdajsrAl4nY64806NfnE2ZOyrd9UVLOKOgf8SIntqt7PjSZh76bLPiIIVenT54x9tR2LhmjJRkZ3OlfNTxVm+Upy0/gRNOiaZgGxvpyyUJfkpCQDEccHVDGFuCZF/FeruuxbPGX2oxdNGEUBt0Ap4r3vI7hmOODpbQTbr4=; sensorsdata2015jssdkcross=%%7B%%22distinct_id%%22%%3A%%22191c27d9ba21c4-0a7669c56cee83-b3b2e3e-396328-191c27d9ba39d%%22%%2C%%22first_id%%22%%3A%%22%%22%%2C%%22props%%22%%3A%%7B%%7D%%2C%%22%%24device_id%%22%%3A%%22191c27d9ba21c4-0a7669c56cee83-b3b2e3e-396328-191c27d9ba39d%%22%%7D";
const signCookie = "PvSessionId=20241119081325D82E2C1B-7F41-4F59-8031-7EB31A8666E9; a_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzI1ODAwMDYsInRva2VuIjp7ImxvZ2luVXNlciI6IjEzMTIzMTg1NTEyIiwicmFuZG9tU3RyIjoieWg2ZDI5NzkxNzMxOTc1MjA2In0sImlhdCI6MTczMTk3NTIwNn0.9ic52jaDYcBl8uqvNApQ--63GBcnhEH1uXyDgEns8iymZ-jOGZcUSXYvbJdbwkFlo1GjWlV41HEqDEqn-F2h0w; c_id=71577ee37650f756bfafe99e3e01de8a44df4d28df6e2b139ec2d483e8b9b857; c_mobile=13123185512; c_version=iphone_c@11.0800; channel=GGPD; city=038|380|90411425|-99; cw_mutual=7064d003eb3c8934e769e430ecf3d64ac82c634186eaf0d6d7823ff9e48f8a8af916bf1556edf9df193f242c1b50f6407ed7dc19992640c8a7fae7e44ec46bcb; devicedId=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; ecs_token=eyJkYXRhIjoiYmIwMmVmY2E2NmNkNmNjN2E0MGFjMTliMjY1Y2E5ZjQwMWE5YTIwNzg2MmJkZDBkN2Y3NTMxNjAxYTcxYWEyMTY0YzVjMWZjZTE1OThhNWNlMGZkYmEwNWM3YTJmMTZkZGE0YjU0ZDExNmU4NmJhZjFlYzJjMzhmYjVmNjE3NzlmZDc2N2ZjYmMxMDRjNTc3YTk1ZGEzNTc1OTkxYmY3ZjE5YTFlZDE1NGRmYjMyYzlmYzRmZGNhOTc0NTY1NGM2YTFhYmI5ZGQ4NzNmZDA2OTJkZjM5MjhkNWQ2YmJmMTIzYTVkYTk1ZWNmNWI2ODFlOGM2MTEwODZkM2RhNzkwY2I3MWY2YTk5MWQzYzkxYmRlYzUxMWNkMzkxNjBhYzc2MWIxMDk1NzJhZDc5ODI2MjE0ZmI2OTk3YTAyZWU0YTUiLCJ2ZXJzaW9uIjoiMDAifQ==; enc_acc=TthZfNJYrI6beAgu7Syuy/AySbNlIWziqSHVSR1pEhVMV9SV3uVxM+kPXX7QcyfXvfKu/WBSzujxC1wu4Wxr51l0bGZty3anAdD6ULKtjczoZS9hdqq1VULlLOGiytiboMfiqAD2HKUHTn1CH9KOaReHMG6eCHPuM/MBxohq0x0=; invalid_at=6b623118db47c41cdaed28c228c18872afdace982a6c692c76be654e7fc953ef; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIxMzEyMzE4NTUxMiIsInBybyI6IjAzOCIsImNpdHkiOiIzODAiLCJpZCI6ImE5NzVlY2M1NjJlMzE1NmYwMjU2NWEzOTJkNDEyM2IxIn0.5robFTBXPiqCbXihzBZf6my_KHQA7kaUI8cs4B1nMNQ; login_type=06; random_login=0; t3_token=2dea7c48679837ff94564ab6e08ee659; third_token=eyJkYXRhIjoiMTMyYzJlNGFmOTFiOWU0ZTRmMmMyMDQwOWVkNWU5NDJhYTE1ZjJjNzA1NjBkNjRjMTAzZTRhZTFiMTQwMWE5ZGU1OWUyNjg2M2M0OGMzYTkwMTAwNGVmZTA4ZDAxYzc1N2QzZjc1OGFhNzljZmYwMGFiNGRhMWI5MzJiNzA0YmE2NjBmN2VkYjU2ZjY0YTQ3NDZkYWU2YmMwNzE0NmQ3NiIsInZlcnNpb24iOiIwMCJ9; u_account=13123185512; u_areaCode=; wo_family=0; GUESS_NUM=NTk5NzA5MTg=; MUT=d3e3d9f2-9b54-4bf4-9fa5-b7893827c04e; SHOP_PROV_CITY=38; TOKEN_NET=UNI; TOKEN_UID=a1vVBAr3LHRNKD2e5kAywA==; TOKEN_UID_ALL=%%7B%%22userNick%%22%%3A%%22%%25E9%%2599%%2586%%25E5%%25BB%%25BA%%22%%2C%%22phoneNum%%22%%3A%%2213123185512%%22%%2C%%22certNum%%22%%3A%%22352228********4516%%22%%7D; TOKEN_UID_NAME=jRhG4NJcYKQnHIKVpih99nAxWE64vzV0gpU4+R18XQqkxX5xg14RbuR2Z+VFqjY0HUPC3KstIMlNOKpD3auySIf2MsU2yanVfOnW8onXnJEjjTdTmisLww00PsFuUXuRWt0T5lZKXtKIHeoXBD2gkD9xt5cVeGZSbHkb/eLNZsE7hDN0xzu2IuNAYPj2oEYXVKgfV3YB8uJ7+8ZEiXEZWNXOVJpoudTwuq7JpH95ziQ=; TOKEN_UID_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; TOKEN_USER_NET=1; TOKEN_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; cdn_area=38|390; ecs_cook=17374a8de94e94bf92630224c5c56c2a; tianjin_ip=0; tianjincity=11|110; usercity=38|380; d_deviceCode=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; ecs_acc=TthZfNJYrI6beAgu7Syuy/AySbNlIWziqSHVSR1pEhVMV9SV3uVxM+kPXX7QcyfXvfKu/WBSzujxC1wu4Wxr51l0bGZty3anAdD6ULKtjczoZS9hdqq1VULlLOGiytiboMfiqAD2HKUHTn1CH9KOaReHMG6eCHPuM/MBxohq0x0=; tfstk=fp7mDnXVMp4n1_ornu8bbQ6iAkXDcjT17O39BFpa4LJWDh-27_8y1LQvHsL2QdXOpGpABR_kQt6SHKJADNfNF9v96EejSd5wFdnvHNBkUIOC5snvWYn5H1XMfS99QdXO_id0JyCfGFTNSJULJeLPHKQDQALwU9w-SJeLJzCfGFTaptH4iGik1LR2_FuaZ4RHUcuVQK-rUCO67F8NQ3zy9Ckqgm8ZazJW_FJNQFRtovpAUT_zHppzez6ZmZdDmdbeEcm86I-DLsJkNQ_u5nvFgL0gp6KyrdKGZ-uBCg8VKESuUqYAnaWHug2roeSCMEIPuQoUROg6a5Qof0K2NQvKynrP90yc7lFuZD5M0QOzk7Vofct2NQvLZ7mUYnRWarC..; sdkuuid=041ddd536a1b4620a8cbd9e2c2bd1c2d; SUCCESSBANNER=; SUCCESSPOPUP=; mallcity=38|380; MALL_P_C_N=38%%7C380%%7CUNI; gipgeo=38|380; sensorsdata2015jssdkcross=%%7B%%22distinct_id%%22%%3A%%22191c27d9ba21c4-0a7669c56cee83-b3b2e3e-396328-191c27d9ba39d%%22%%2C%%22first_id%%22%%3A%%22%%22%%2C%%22props%%22%%3A%%7B%%7D%%2C%%22%%24device_id%%22%%3A%%22191c27d9ba21c4-0a7669c56cee83-b3b2e3e-396328-191c27d9ba39d%%22%%7D";

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

// 每日签到
// $.post({url:"https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign",headers:headerPv,
//     method: 'POST'},
// (err, resp, data) => {
//     try {
//         let res = JSON.parse(data);
//         if (res.code !== '0000' && res.code !== '0002') {
//             $.msg("联通签到失败", "每日签到结束", "");
//             $.log(data);
//         } else {
//             $.log( "* 每日签到成功  " + (res.code === '0000' ? res.data.statusDesc + res.data.redSignMessage : res.desc));
//         }
//     } catch (e) {
//         $.log(e);
//         $.msg("联通签到失败", "详情", e); // Error!e
//     } finally {
//     }
// });

// 任务签到
$.post({url: "https://activity.10010.com/sixPalaceGridTurntableLottery/task/taskList?type=2", headers: headerEcs,
    method: 'GET'},
    (err, resp, data) => {
    try {
        let res = JSON.parse(data);
        if (res.code === '0000') {
            //循环任务列表
            res.data.tagList.forEach(item => {
                $.log("开始" + item.tagName);
                item.taskDTOList.forEach(task => {
                    completeTask(task);
                })
            })
        } else {
            $.msg("联通签到失败", "获取任务列表失败", "");
        }
    } catch (e) {
        $.log(e);
        $.msg("联通签到失败", "详情", e); // Error!e
    } finally {
    }
})


function completeTask({id, taskName,buttonName, orderId }) {
    if (buttonName === "去领取") {
        //领取奖励
        $.post({
                url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/getTaskReward?taskId=${id}`,
                headers: headerPv,
                method: 'GET'},
            (err, resp, data) => {
                try {
                    let res = JSON.parse(data);
                    if (res.code === '0000') {
                        $.log("*  " + taskName + "  签到" + res.data.statusDesc + (res.data.code === '0000' ? res.data.prizeNameRed : res.data.desc));
                    } else {
                        $.log(data);
                    }
                } catch (e) {
                    $.log(e);
                    $.msg("联通签到失败", "详情", e); // Error!e
                } finally {
                }
            })
    }else if (buttonName === "已完成") {
        $.log("*  " + taskName + "  签到已完成");
    }else {
        $.post({
                url: `https://activity.10010.com/sixPalaceGridTurntableLottery/task/completeTask?taskId=${id}&orderId=&systemCode=QDQD`,
                headers: headerEcs,
                method: 'GET'
            },
            (err, resp, data) => {
                try {
                    let res = JSON.parse(data);
                    if (res.code === '0000' || res.code === '0311') {
                        //完成任务 领取奖励
                        setTimeout(() => {
                            $.log("*  等待两秒");
                        }, 2000); // 2000 毫秒 = 2 秒

                        $.post({
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