export function ImgToBase64(file, maxLen, base64url, callBack) {
    var img = new Image();

    var reader = new FileReader();//读取客户端上的文件
    reader.onload = function () {
        var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
        img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
    };

    img.onload = function () {
        //生成比例
        var width = img.width, height = img.height;
        //计算缩放比例
        var rate = 1;
        if (width >= height) {
            if (width > maxLen) {
                rate = maxLen / width;
            }
        } else {
            if (height > maxLen) {
                rate = maxLen / height;
            }
        }
        img.width = width * rate;
        img.height = height * rate;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var base64 = canvas.toDataURL('image/jpeg', getCompressRate(1, showSize(base64url)));
        callBack(base64);
    };
    reader.readAsDataURL(file);
}

function getCompressRate(allowMaxSize, fileSize) { //计算压缩比率，size单位为MB
    var compressRate = 1;
    if (fileSize / allowMaxSize > 4) {
        compressRate = 0.5;
    } else if (fileSize / allowMaxSize > 3) {
        compressRate = 0.6;
    } else if (fileSize / allowMaxSize > 2) {
        compressRate = 0.7;
    } else if (fileSize > allowMaxSize) {
        compressRate = 0.8;
    } else {
        compressRate = 0.9;
    }
    return compressRate;
}

function showSize(base64url) {
    //获取base64图片大小，返回MB数字
    var str = base64url.replace('data:image/png;base64,', '');
    var equalIndex = str.indexOf('=');
    if (str.indexOf('=') > 0) {
        str = str.substring(0, equalIndex);
    }
    var strLength = str.length;
    var fileLength = parseInt(strLength - (strLength / 8) * 2);
    // 由字节转换为MB
    var size = "";
    size = (fileLength / (1024 * 1024)).toFixed(2);
    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1, 2);            //获取小数点后两位的值
    if (dou === "00") {                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return parseInt(size);
}

export function convertBase64ToBlob(base64) {
    let base64Arr = base64.split(',');
    let imgtype = '';
    let base64String = '';
    if (base64Arr.length > 1) {
        //如果是图片base64，去掉头信息
        base64String = base64Arr[1];
        imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
    }
    // 将base64解码
    let bytes = atob(base64String);
    //var bytes = base64;
    let bytesCode = new ArrayBuffer(bytes.length);
    // 转换为类型化数组
    let byteArray = new Uint8Array(bytesCode);

    // 将base64转换为ascii码
    for (let i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
    }

    // 生成Blob对象（文件对象）
    return new Blob([bytesCode], {type: imgtype});
}

export default {ImgToBase64, convertBase64ToBlob};