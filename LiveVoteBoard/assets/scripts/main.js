var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
(() => __awaiter(this, void 0, void 0, function* () {
    yield loadFBSdkAndInit('1605904649711134');
    yield FBAsyncFunc(FB.login, CallbackPosition.First, {});
    document.getElementById('liveButton').onclick = () => __awaiter(this, void 0, void 0, function* () {
        var createResult = yield FBAsyncFunc(FB.ui, CallbackPosition.Last, {
            display: 'popup',
            method: 'live_broadcast',
            phase: 'create',
        });
        if (!createResult.id) {
            alert("已取消建立直播");
            return;
        }
        var publishResult = yield FBAsyncFunc(FB.ui, CallbackPosition.Last, {
            display: 'popup',
            method: 'live_broadcast',
            phase: 'publish',
            broadcast_data: createResult
        });
        if (!publishResult) {
            alert("未成功建立直播");
            return;
        }
        document.getElementById('liveButton').hidden = true;
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            document.getElementById('content').hidden = false;
            var voteData = yield FBAsyncFunc(FB.api, CallbackPosition.Last, "/" + publishResult.id, 'get', {
                fields: 'reactions.type(LIKE).summary(total_count).limit(0).as(like)' +
                    ',reactions.type(LOVE).summary(total_count).limit(0).as(love)' +
                    ',reactions.type(WOW).summary(total_count).limit(0).as(wow)' +
                    ',reactions.type(HAHA).summary(total_count).limit(0).as(haha)' +
                    ',reactions.type(SAD).summary(total_count).limit(0).as(sad)' +
                    ',reactions.type(ANGRY).summary(total_count).limit(0).as(angry)'
            });
            for (var type in voteData) {
                var ele = document.getElementById(type);
                if (!ele)
                    continue;
                ele.innerText = voteData[type].summary.total_count;
            }
            document.getElementById('lastUpdateTime')
                .innerText = new Date().toString();
        }), 5000);
        console.log(publishResult);
    });
}))();
//# sourceMappingURL=main.js.map