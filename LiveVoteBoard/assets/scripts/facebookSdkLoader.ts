interface Window {
    fbAsyncInit: Function;
}
/**
 * 非同步讀取Facebook js SDK
 */
async function loadFBSdk(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        window.fbAsyncInit = () => {
            resolve();
            delete window.fbAsyncInit;
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));
    });
}
/**
 * 非同步讀取Facebook js SDK
 * @param appId 應用程式編號
 * @param xfbml 是否剖析facebook tag
 * @param version SDK版本
 */
async function loadFBSdkAndInit(appId: string, xfbml: boolean = true, version: number = 2.8): Promise<void> {
    await loadFBSdk();
    FB.init({
        appId: appId,
        xfbml: xfbml,
        version: 'v' + version.toString()
    });
}