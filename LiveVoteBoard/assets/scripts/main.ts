declare var echarts: any;
class chartData {
    public name: string;
    public value: any[];
}
var chartDataSet = {
    like: [],
    love: [],
    haha: [],
    wow: [],
    sad: [],
    angry: []
};
var temp = new Date();
for (var key in chartDataSet) {
    chartDataSet[key] = [{
        name: temp.toString(),
        value: [temp, 0]
    }];
}
var reactionsMap = {
    like: '讚',
    love: '心',
    haha: '哈',
    wow: '哇',
    sad: '嗚',
    angry: '怒'
};
(async () => {
    await loadFBSdkAndInit('1605904649711134');
    var loginResult = await FBAsyncFunc(FB.login, CallbackPosition.First, { scope: 'user_posts, manage_pages' });
    console.log(loginResult)
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

        var chart = echarts.init(document.getElementById('chart'));
        var chartOption = {
            title: {
                text: '投票動態折線圖'
            },
            legend: {
                data: ['讚', '心', '哈', '哇', '嗚', '怒']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            xAxis: {
                type: 'time',
                scale: true,
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    y: '90%',
                    start: 50,
                    end: 100
                }
            ],
            series: [
                {
                    name: '讚',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.like
                },
                {
                    name: '心',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.love
                }, {
                    name: '哈',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.haha
                }, {
                    name: '哇',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.wow
                }, {
                    name: '嗚',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.sad
                },
                {
                    name: '怒',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: chartDataSet.angry
                }
            ]
        };

        chart.setOption(chartOption);

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
            var now = new Date();
            for (var type in voteData) {
                var ele = document.getElementById(type);
                if (!ele) continue;
                ele.innerText = voteData[type].summary.total_count;
                var newItem = new chartData();
                newItem.name = `${reactionsMap[type]} - ${ele.innerText}`;
                newItem.value = [
                    now,
                    voteData[type].summary.total_count
                ];
                chartDataSet[type].push(newItem);
            }
            chart.setOption({
                series: [
                    {
                        name: '讚',
                        data: chartDataSet.like
                    },
                    {
                        name: '心',
                        data: chartDataSet.love
                    },
                    {
                        name: '哈',
                        data: chartDataSet.haha
                    },
                    {
                        name: '哇',
                        data: chartDataSet.wow
                    },
                    {
                        name: '嗚',
                        data: chartDataSet.sad
                    },
                    {
                        name: '怒',
                        data: chartDataSet.angry
                    },
                ]
            });
            document.getElementById('lastUpdateTime')
                .innerText = now.toString();
        }, 5000);
        console.log(publishResult);
    };
})();
