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
    return new Promise<void>(async(resolve, reject) => {
        await loadFBSdk();
        FB.init({
            appId: appId,
            xfbml: xfbml,
            version: 'v' + version.toString()
        });
        resolve();
    });
}

enum CallbackPosition {
    First,
    Last
}
/**
 * 將Facebook函數轉換為Promise
 * @param func 函數
 * @param callbackPosition 回呼函數位置
 * @param args 參數
 */
async function FBAsyncFunc(func: Function, callbackPosition: CallbackPosition, ...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        if (!args) args = [];
        var callfunc = (response) => {
            resolve(response);
        };
        switch (callbackPosition) {
            case CallbackPosition.First:
                args = [callfunc].concat(args);
                break;
            case CallbackPosition.Last:
                args.push(callfunc);
                break;
        }
        func.apply(FB, args);
    });
}
/*
(async () => {
    await loadFBSdkAndInit('1605904649711134');
    await FBAsyncFunc(FB.login, CallbackPosition.First, { scope: 'user_posts,manage_pages' });
    var data = await FBAsyncFunc(FB.api, CallbackPosition.Last, '/me/accounts');
    console.log(data);
})();
*/