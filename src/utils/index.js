
import { notification, Upload } from 'antd'

export function format(date, fmt) {
    var da = null;
    if (typeof date === 'string') {
        if (date) {
            date = date.replace(/\-/g, "/");
            da = new Date(date)
        } else { da = new Date() }
    } else if (typeof date === 'object') { da = date }
    else { da = new Date() }

    var o = {
        "M+": da.getMonth() + 1, //月份
        "d+": da.getDate(), //日
        "h+": da.getHours(), //小时
        "m+": da.getMinutes(), //分
        "s+": da.getSeconds(), //秒
        "q+": Math.floor((da.getMonth() + 3) / 3), //季度
        "S": da.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (da.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function formatDuring(timestamp) {
    var mistiming = Math.round(new Date() / 1000) - timestamp;
    var postfix = mistiming > 0 ? '前' : '后'
    mistiming = Math.abs(mistiming)
    var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
    var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

    for (var i = 0; i < 7; i++) {
        var inm = Math.floor(mistiming / arrn[i])
        if (inm != 0) {
            return inm + arrr[i] + postfix
        }
    }
}

export function getFileSize(fileByte) {
    var fileSizeByte = fileByte;
    var fileSizeMsg = "";
    if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
    else if (fileSizeByte === 1048576) fileSizeMsg = "1MB";
    else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
    else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) fileSizeMsg = "1GB";
    else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    else fileSizeMsg = "文件超过1TB";
    return fileSizeMsg;
}


export function digitUppercase(n) {
    const fraction = ['角', '分']
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
    const head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    let s = ''
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
}

export function formatNumber(value) {
    value = String(value)
    const list = value.split('.');
    const result = list[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${result}${list[1] ? `.${list[1]}` : ''}`;
}

export function mix(r, s, filters) {
    for (var p in r) {
        if (r.hasOwnProperty(p)) {
            if (typeof r[p] === 'object' && r[p] && !r[p].length === undefined && (filters ? filters.indexOf(p) === -1 : true)) {
                if (!s.hasOwnProperty(p)) {
                    s[p] = {}
                }
                mix(r[p], s[p])
            } else {
                if (!s.hasOwnProperty(p) && r[p] !== undefined && r[p] !== '' && r[p] !== null && (filters ? filters.indexOf(p) === -1 : true)) {
                    s[p] = r[p]._isAMomentObject ? r[p].format('YYYY-MM-DD') : r[p]
                }
            }
        }
    }
    return s
}

export function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export function beforeUpload(file, types, maxSize) {
    const isType = types.indexOf(file.type) > -1
    if (!isType || (types.indexOf('octet-stream') > -1 && file.name.indexOf('.rar') > -1)) {
        notification.error({ className: 'noti-error', message: '提示', duration: 3, description: '您只可以上传指定格式的文件！' })
    }
    const isLtSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtSize) {
        notification.error({ className: 'noti-error', message: '提示', duration: 3, description: '文件过大!' })
    }
    return isType && isLtSize ? true : Upload.LIST_IGNORE;
}

function showTip(method, message) {
    notification[method]({ className: `noti-${method}`, message: '提示', duration: 3, description: message })
}

export function deepCopy(params) {
    return JSON.parse(JSON.stringify(params))
}

export function formatJson(json, options) {
    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    }
    );
    return formatted;
}

export function filterMenus(arr, path) {
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (path === item.component) {
            return item
        } else if (path.indexOf(item.component) > -1) {
            //没拿到当前路由所在item 但是拿到了父级item
            return filterMenus(item.children, path)
        }
    }
}

export function getParentObj(list, id) {
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.key === id) {
            return [list[i]]
        }
        if (item.children && item.children.length > 0) {
            let node = getParentObj(item.children, id);
            if (node !== undefined) {
                return node.concat(item)
            }
        }
    }
}

export function getSonKey(arr, target) {
    arr.map(item => {
        target.push(item.key)
        if (item.children && item.children.length > 0) {
            getSonKey(item.children, target)
        }
        return item
    })
    return target
}

export function renderTree(data, arr) {
    data.map(item => {
        const obj = {
            key: item.id,
            title: item.available ? item.name : `${item.name}(禁用)`,
            available: item.available
        }
        if (item.children) {
            obj.children = []
            renderTree(item.children, obj.children)
        }
        arr.push(obj)
        return item
    })
}

export function isDateString(str) {
    if (!/^(\d{4})[\-|\/](\d{1,2})[\-|\/](\d{1,2})$/.test(str))
        return false;
    var year = RegExp.$1 - 0;
    var month = RegExp.$2 - 1;
    var date = RegExp.$3 - 0;
    var obj = new Date(year, month, date);
    return !!(obj.getFullYear() == year && obj.getMonth() == month && obj.getDate() == date);
}

export function showSuccess(message) {
    return showTip('success', message)
}

export function showWarning(message) {
    return showTip('warning', message)
}

export function showError(message) {
    return showTip('error', message)
}