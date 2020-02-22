export function TMap() {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js?callback=init";
    script.onerror = reject;

    if (script.addEventListener) {
      script.addEventListener('load', function () {
        init();
      }, false);
    } else if (script.attachEvent) {
      script.attachEvent('onreadystatechange', function () {
        var target = window.event.srcElement;
        if (target.readyState == 'loaded') {
          init();
        }
      });
    }
    document.head.appendChild(script);
  })
}