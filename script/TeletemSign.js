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
const _key = '@YaYa_10010.cookie';

// 在pc环境测试直接写入值
// $.data = {"@YaYa_10010.cookie": "@chavy_boxjs_userCfgs.httpapi222"};
// $.writedata();
// 建议这样写
// $.setdata(_key,'xxx');
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
//let newCookie = "JSESSIONID=D5B58EA646827A92D1FFE564C883C6AA; acw_tc=ac11000117402072418408860e0048b172e93fe7f5055c8c9ccdc6d36cf728; tag-service=2824b6133c422dda73c79c6d8413cc1b; a_token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA4MDExNjIsInRva2VuIjp7ImxvZ2luVXNlciI6IjEzMTIzMTg1NTEyIiwicmFuZG9tU3RyIjoieWhkZmE4YjYxNzQwMTk2MzYyIn0sImlhdCI6MTc0MDE5NjM2Mn0.mM3PRMin-Jx1-saXZ-yD5Rp_cnGgeALUY5_YDs6HW_e8fg-1UgddzpBOt4gEdryMhsa1YukRY0nqcRtDIyt9XQ; c_id=71577ee37650f756bfafe99e3e01de8aa2dfe02b14203a45ea3fffe972cbfc92; c_mobile=13123185512; c_version=iphone_c@12.0100; city=038|380|90411425|-99; cw_mutual=7064d003eb3c8934e769e430ecf3d64ad3bcd7560f77a485ee6c6bcd616d8ab3f91b3e102143c46fafc8278e62950a9eb91d281c4eeeb71ab1720ca5113221ec; d_deviceCode=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; ecs_acc=YAOi6M5nNI7NJfhX7HlCsvwz9axWOZUEyjNL1RAjXa/g82BM8Kyn76xEhs+yC/XmnFspNhUJotBx8XFT0gaEdVB04uPaB3DXc+GAM2z6QL1hDGnPUPHsQzULxds24dTlPGWqSD6pGLVjXfHvxZewqFvqld3T9Z6uKOE0emE9Z/U=; ecs_cook=f50ea65ddcc8deaec36f55da1ce6efc2; ecs_token=eyJkYXRhIjoiYmIwMmVmY2E2NmNkNmNjN2E0MGFjMTliMjY1Y2E5ZjQwMWE5YTIwNzg2MmJkZDBkN2Y3NTMxNjAxYTcxYWEyMTY0YzVjMWZjZTE1OThhNWNlMGZkYmEwNWM3YTJmMTZkZGE0YjU0ZDExNmU4NmJhZjFlYzJjMzhmYjVmNjE3NzljNzY2NjhiMmI5M2NjMjExNTkzYzk2ZDM5YzNjMGQ3MzQ5YTc3NTk1ZDRiMjUzMTVlNWE3NTM0N2Q0ODcxZDM0NmM1ODhjZjg1YTUxNGZkZWY0YmI1ZjFiMTZmZTdlOTQ4OTY4Y2MzMWU4MjEwMzZjM2M2MzY2NGU2NWYwZjUwY2RhMzBlZjg5ZWRhZTI3NGY5NTVkODI0MmM0OTJiODQ0NjhiYWQ0NTQ0MTNmMTcxNzA4MWUyZGQwYzk4ZmNiYzkiLCJ2ZXJzaW9uIjoiMDAifQ==; enc_acc=YAOi6M5nNI7NJfhX7HlCsvwz9axWOZUEyjNL1RAjXa/g82BM8Kyn76xEhs+yC/XmnFspNhUJotBx8XFT0gaEdVB04uPaB3DXc+GAM2z6QL1hDGnPUPHsQzULxds24dTlPGWqSD6pGLVjXfHvxZewqFvqld3T9Z6uKOE0emE9Z/U=; invalid_at=88f3e8794b81f67cbe680dd6b58325be48ea76b2de65b58a022dc39327137f3e; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIxMzEyMzE4NTUxMiIsInBybyI6IjAzOCIsImNpdHkiOiIzODAiLCJpZCI6IjQ1ZWUyMWU4MzZlZWNiMWE5OTY4ODljOWEyMjgxZTA2In0.0dVNE3_U6eBOQ6SUuhEBLbg1cicUXZcgXsnMB2j7rik; login_type=06; random_login=0; t3_token=a12e27ee317084fa3fdfa7c76436dc8d; third_token=eyJkYXRhIjoiMTMyYzJlNGFmOTFiOWU0ZTRmMmMyMDQwOWVkNWU5NDJjMzMzNDc0ZThkZGQzNTU2NTJmODcxNjRlYWVmY2MzOTQ5MTdhYjk2YWVjN2Y2YzkxYzNiNDRjMWIwOGM4NDRmZTUwNjExMjNhNjBlNGJhNDczNGRlYjdkZjA0Y2IzNDg5MDZjYWMxMTY3MDQ5NmIwZTQ5ZjJmZGE4MzBjMTJkYyIsInZlcnNpb24iOiIwMCJ9; u_account=13123185512; u_areaCode=; wo_family=0; c_sfbm=234g_00; logHostIP=; sdkuuid=21d14a7d5fdf4e4c96d17347dfd0b88c; _agent_r_n=cc02f45d208b139b91670145ba40bc35f41e64c6e63efe9d9c0b871b3eae1eb4; _uop_id=npfauth_9yayhqvbdbd0a04f04cce938b1c45263ca3710ffmuhdzwx2; PvSessionId=20250222114939D82E2C1B-7F41-4F59-8031-7EB31A8666E9; channel=GGPD; devicedId=D82E2C1B-7F41-4F59-8031-7EB31A8666E9; MUT_V=iphone_c%254012.0100; MUT=4809b3f6-8f32-46f7-83c2-be4eba203604; SHOP_PROV_CITY=; TOKEN_NET=UNI; TOKEN_UID=a1vVBAr3LHRNKD2e5kAywA==; TOKEN_UID_ALL=%7B%22userNick%22%3A%22%25E9%2599%2586%25E5%25BB%25BA%22%2C%22phoneNum%22%3A%2213123185512%22%2C%22certNum%22%3A%22352228********4516%22%7D; TOKEN_UID_NAME=jRhG4NJcYKQnHIKVpih99nAxWE64vzV0gpU4+R18XQqkxX5xg14RbuR2Z+VFqjY0HUPC3KstIMlNOKpD3auySIf2MsU2yanVfOnW8onXnJEjjTdTmisLww00PsFuUXuRWt0T5lZKXtKIHeoXBD2gkD9xt5cVeGZSbHkb/eLNZsE7hDN0xzu2IuNAYPj2oEYXVKgfV3YB8uJ7+8ZEiXEZWNXOVJpoudTwuq7JpH95ziQ=; TOKEN_UID_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; TOKEN_USER_NET=1; TOKEN_USER_TYPE=tLWA0H+zZrKLQrow8ab40w==; mallcity=38|380; tianjin_ip=0; tianjincity=11|110; usercity=38|380; cdn_area=38|380; gipgeo=11|110";
const ckval = $.getdata(_key);
let newCookie = ckval;

const cookie = newCookie;
const signCookie = newCookie;
const drawCookie = newCookie;
const bizchannelinfo = '{"bizChannelCode":"225","disriBiz":"party","unionSessionId":"","stType":"","stDesmobile":"","source":"","rptId":"rpt-e89934a9f9974c85b4aec9e184bd6609-prx","ticket":"","tongdunTokenId":"tdfpeyJ2IjoiSlp1Rks4aVpmemhaRytCYXFjVWpBZ051UGg4bEZydEhDWDNFdjd1R0FHVGo5Z0xrSTBuTDViYi9RUzd6aEtldyIsIm9zIjozLCJlIjoyMDIsImQiOiJ7XCJwYXJ0bmVyXCI6XCJjaGluYXVuaWNvbVwiLFwiYXBwX25hbWVcIjpcImVwYXlfd2ViXCIsXCJ0b2tlbl9pZFwiOlwiY2hpbmF1bmljb20tMTczMzE5NjQzOTY1NC02MTVlMTRlN2QwNTFhXCIsXCJhXCI6XCJ2V3kzMTBjejdzMVhKQi9seFhjbVFINUxRRzVJTnl2ZEk5ejRwV29Vb0NqdTVPRTZoflNoRzl2QWo5WGRCd0NPeldCRmFhc09mZDlDZ3BrZmlhUDEvbG5yeEdrb0pTT2NheDUxUzh5N3pkUXJlcmtoNlVLdX5qQkx4QmNGSGRDYXVQL0tIeThjbXlIQWV5N34zUzhYRUtkeGFHdlV0dEVBakRDQm95RlBScVNQM342eXFuUUZ6dFlFL0RpSmhLVFdpaFZUVzhUcDZPZXA0a3lzNEpGNm1EN2x2S1p4WDNMN1JwSW8yNU9Ncm1XdWovdEpleDlIVGc3bWFJcUZseHQ3elVnfkFDYTBhVllPcTdCN0hLMWRUSDZvdk81YkVJQkxlakJxQXpsVEJFYVp3T05TQ3BqUTV0S2N5Rm0xd2VxTGlYdlB4a2JKNUdaYzFtbmZKRUZPMG1qbXdwRDY1ejNCMFZOS3R1d2Q3emk0Qk5PMHlmVUxIRWZVVWw2Zm1pOGdYcHN6ZVhBfm5aLzliYXc2clhPekdZTnlJTlFmR1d2TG1ManJ3bWRtdkowPVwiLFwiYlwiOlwiU1ZTNGN6a3FXc0kxQm4yT1VtRFQxN3R5ZXI2eEJ-b0x5bXQ2L1B6U3I2cmJZaGZHelRZbTg3bWtKMVlWejZmZzd3SmdqUDBoeEVKdlEwUjFVS01FdlhxUHplQnh6eFFTfmlHSkJMM1BnMzlDVjdpVlM4cUlUbmZKUGU1TVp4ZnpRU1ZnYmxiM29Uc1d-Rn4zS0F5VUkyVGxKNGhSaVlFQVRXYjB-SzNXZG5VOVFwbktyQ280MWpRZXg1dVVuS3VITnd1Y3ptdkVOd0VaNUpKWTZFd0VhTWVydUIyd35tblY0YUc1d0IyMVhmdX5tc3dWcHhLb1REZ3hIdzcxS3VEeVc1dDI4Z0hrWmtDR01qQWRTQnBUZkZnb0pGVTg0bzMyS1RGdTA2LzFkaGUvNEUwOW5Vb0dScnV6aE81ZW5UNzB0a1gwNjM0RkswNTE5MGY0N1Y3dVNDWTZvcX42flVDcHRQZnZtZldkaFltZ1NWYzJhMkFRU2xidENzWmVEbGg2cmJxbTRwVXFSSUhLb2NOaWpLcFNyMTQ3WW9CdkRqRzRzWkswWm42RjFQdGZHY29kTDVpN1BtMXF0b2pHbVJOalwiLFwiY1wiOlwidlNvTHdVY211MGRsc1VpZklIV3hRR1RuMVR-ZlVtcU5FQXp2aW9NfnE4SGlBeklmaX5LeTN2dGdyQ2Y0dFM4V3V4anh6SlZ1RUFiQ0RVNE1hWmR0blB6Yjd2SFdSbEkwU1FwcDdkT35Ta09NdUlrM1VYRUxCWHhYeXR-MXlWcFN4T1BpTk1LQzJXcWZyeHhsSEhOcUJMVXhKS2x4QU1Ra1RCd1FPS3M5VnU1cTVxang3Tlk5TzlENlFhaGFmYnFNUnkyVDEydTY5VTB0YlRvU2pCdEFTNUF3SFQ5Ykcxb1luNmtMcVhXaHQ4UGc2MXdkflYveEdJeGV2Tml3RlJ4UWpKWk5WajFxejFPSE1sTFBoejRQNEE3ek1OcXhDVGJGTmQ4cGY0czluSWNaQWNlM2pTMEpQQ1dWbUxOU2dMbkY1cXA5SmNZYkFrb1Z4VTRPSXlURXJEdVoybnFDWGJVRXRsfkFCV1R5NzI2QlRhcWxjaTZMQlpOWHFUV3A3S3pzdkpUenZMQmk3SXJpS0lZbzRXcEl0VVZxai8xb3B1enBBN3V4ZmluaVM4TDNzbW01ZTk0a1Q4VEM0Z2F4WjFFUFk3cFNmdEpsRi9BeHBHbmN4YldrL0FSTzlYN1VOZnN5UTRMeURTSlBBUUgxL1d4cWU5SX5xejFmdWlHOTd-UFBuU0FYZHFuNWNXa0ZubWpSN0Uyd3lqSFd5VU9XOUxwdUY5L2ozVzRQWVNSMmsxeXZ4QVdpMi9zbjlJd2cydkt-T1ZIL0trWjZaYjhydnR5UWk4UVFEcFBJZ3VFczRuYU1cIixcImRcIjpcImJTU2U2SHZXNFFSM3JuWmNZdUlQZnV2WnQ1czI2ZlZXaEN6TzV2QnRveGQzSGVveUxwa2dZb2RuS2FOcVVubmRqTTlmMXBRTGlQdllXQk5TQmpyVkRYTk84b1d1WXVhRkJ3MDJ3Q2RlOTJNTWhTS2xxM1p3QWJYR0VFamp3YUJmRElsflhMUmlrYlNGa2s2M2tnM3pjcGRYRWo2NFdIfkdFTHI0U09MWG5rUDBOdXZSeml2eEJZSnd0SFdzWX5ERm1LRWdNUk5uZWFzQVdlTFd6VjNVcnpjY1dQQ2VMaWZwXCIsXCJnXCI6XCJaNmRsT2VuOGJydTh1NFhJenFkNk5ENU1nT0Y4WGgvaDJFQjlUV2lFQXU4RWlkWDRGREZYekRDOERib3JlQ1NvRmJab3ZOTmRxL1R6VG5TUzlHQWM1cHlaNmRKQy9-YlVYWDlwaTRuTGZJa0pPNkppZ0trN2RjdWJDd1FCS0VxTFF5cmEwZzlCYkFWSkJzS08wQW1KV1k3NmVzcURhNXBGMVlxUnJLRm9YRTVWSHdTS0d6bGVVd3U1MW5JRHVFRERxWWg0cThxcEJCMTlPbXpiYUFENGVyTm96Q2M5bXdnOXR5fn5weTlmcHM2bm94QVpuVXdKelg0alUyazBsSlJ5N25rWHRya2Ryd3puSE5ZWUo1d0ZUVFNmWHV4NHdaWnpHZmVpemc4YllQVjJDeHZPYkFvM3lmb2dHMTgzWjNXZXM5VGhydnVwYmc4US9kcnZHR3VsNGdwYm4vVExybEtKWXUyVnQ4R2lVMG5BZlpkbkVSMldjVHlDL0FCZURaeVVcIixcImZcIjpcIm9JOVloeU1WMkpSQkhod0dGbHQ2VVlkby80MWgvaG1KXCIsXCJlXCI6XCJKeWlJVXY2ajdnWUx2M0JaZi8wTmdad1pCQnhjVGJQejN1cXU3SFRsTXVHZUwwblVPZXQxR1Nhc1J4WTI0Q3RlTS9HZTZjSVpQbm5zS1lHb0NEU2RXUT09XCIsXCJ2XCI6XCJKWnVGSzhpWmZ6aFpHK0JhcWNVakFnTnVQaDhsRnJ0SENYM0V2N3VHQUdUajlnTGtJMG5MNWJiL1FTN3poS2V3XCIsXCJpZGZcIjpcIkVUWE5UNFYzcU9zK1l6VExIMk9WeEV0MmNOalE3cHR4c2lFZmJGbUh2OVpFQ0hCVm5TcG1vUTBkMEJJRnFyY3ZCSkhMN2Fuei93MUp0MndQM1pYTU1oVHFVcGE0MUdjZzI1NmVYQUJqZGc3Zk41bDVmOURXcFhBRXgrVnEweTlIRU1jcXR6aytBMUVuODI2UmNaVXhrTzJPSnBHaE12NG53U2dPMzVTVmhSbz1cIixcIndcIjpcIkFUZ2JxY3FIUjZXaERZQUw5WkpmR21ScEFxaUsxbGk1UVI2T0xyenRtem5-dTdFVWlIMlVLaW5tMUxTYX5QVkg0NmtqcWlFQzdDTGo3Q0h3OFN4aU10YVZNdWU3T09GZ1wiLFwiY3RcIjpcIjhzZ05Kc3pxL2l5PVwifSJ9","xindunTokenId":"0bdf11bb7d5c47f1823f32fd67259e64"}';

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


// 每日签到
// $.post({url:"https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign",headers:headerPv,
//         method: 'POST'},
//     (err, resp, data) => {
//         try {
//             let res = JSON.parse(data);
//             if (res.code !== '0000' && res.code !== '0002') {
//                 $.msg("联通签到失败", "每日签到结束", "");
//                 $.log(data);
//             } else {
//                 $.log( "* 每日签到成功  " + (res.code === '0000' ? res.data.statusDesc + res.data.redSignMessage : res.desc));
//             }
//         } catch (e) {
//             $.log(e);
//             $.msg("联通签到失败", "详情", e); // Error!e
//         } finally {
//         }
//     });

// 每日登陆领取抽奖
// $.post({url:"https://epay.10010.com/ci-mcss-party-front/v1/rainbow/unifyDraw?activityId=BKQY2024CJ03&isBigActivity=1&bigActivityId=&bizFrom=225",
//         headers: headerDraw,
//         method: 'POST'},
//     (err, resp, data) => {
//         try {
//             let res = JSON.parse(data);
//             if (res.code !== '0000') {
//                 $.msg("联通签到失败", "每日登陆结束", "");
//                 $.log(data);
//             } else {
//                 $.log( "*  每日登陆成功  " + res.msg + res.txId);
//             }
//         } catch (e) {
//             $.log(e);
//             $.msg("联通签到失败", "详情", e); // Error!e
//         } finally {
//         }
//     });

// 任务签到
$.post({url: "https://activity.10010.com/sixPalaceGridTurntableLottery/task/taskList?type=2", headers: headerEcs,
        method: 'GET'},
    async (err, resp, data) => {
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
            } else {
                $.msg("联通签到失败", "获取任务列表失败", "");
            }
        } catch (e) {
            $.log(e);
            $.msg("联通签到失败", "详情", e); // Error!e
        } finally {
            $.msg("联通APP签到", "签到成功", "");
            $.done();
        }
    })


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