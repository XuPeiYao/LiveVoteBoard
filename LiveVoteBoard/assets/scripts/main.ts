(async () => {
    await loadFBSdkAndInit('1605904649711134');
    await FBAsyncFunc(FB.login, CallbackPosition.First, {  });
    document.getElementById('liveButton').onclick = async () => {
        var createResult = await FBAsyncFunc(
            FB.ui,
            CallbackPosition.Last,
            {
                display: 'popup',
                method: 'live_broadcast',
                phase: 'create',
            }
        );
        if (!createResult.id) {
            alert("已取消建立直播");
            return;
        }
        var publishResult = await FBAsyncFunc(
            FB.ui,
            CallbackPosition.Last,
            {
                display: 'popup',
                method: 'live_broadcast',
                phase: 'publish',
                broadcast_data: createResult
            }
        );
        if (!publishResult) {
            alert("未成功建立直播");
            return;
        }

        document.getElementById('liveButton').hidden = true;
        setInterval(async () => {
            document.getElementById('content').hidden = false;
            var voteData = await FBAsyncFunc(
                FB.api,
                CallbackPosition.Last,
                "/" + publishResult.id,
                'get',
                {
                    fields:
                    'reactions.type(LIKE).summary(total_count).limit(0).as(like)' +
                    ',reactions.type(LOVE).summary(total_count).limit(0).as(love)' +
                    ',reactions.type(WOW).summary(total_count).limit(0).as(wow)' +
                    ',reactions.type(HAHA).summary(total_count).limit(0).as(haha)' +
                    ',reactions.type(SAD).summary(total_count).limit(0).as(sad)' +
                    ',reactions.type(ANGRY).summary(total_count).limit(0).as(angry)'
                }
            );
            for (var type in voteData) {
                var ele = document.getElementById(type);
                if (!ele) continue;
                ele.innerText = voteData[type].summary.total_count;
            }
            document.getElementById('lastUpdateTime')
                .innerText = new Date().toString();
        }, 5000);
        console.log(publishResult);
    };
})();
