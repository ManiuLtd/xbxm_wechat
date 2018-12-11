
export default {
    objToStr: function (val) {
        if (val) {
            let params = '';
            for (let x in val) {
                if (val[x]) {
                    params += `${x}=${val[x]}&`
                }
            }
            params = params.substr(0, params.length - 1);
            return params
        }
    },
    // 读取cookie
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    // 删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }

};