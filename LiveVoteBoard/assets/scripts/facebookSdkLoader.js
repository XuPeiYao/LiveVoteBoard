var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * 非同步讀取Facebook js SDK
 */
function loadFBSdk() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            window.fbAsyncInit = () => {
                resolve();
                delete window.fbAsyncInit;
            };
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        });
    });
}
/**
 * 非同步讀取Facebook js SDK
 * @param appId 應用程式編號
 * @param xfbml 是否剖析facebook tag
 * @param version SDK版本
 */
function loadFBSdkAndInit(appId, xfbml = true, version = 2.8) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadFBSdk();
        FB.init({
            appId: appId,
            xfbml: xfbml,
            version: 'v' + version.toString()
        });
    });
}
//# sourceMappingURL=facebookSdkLoader.js.map