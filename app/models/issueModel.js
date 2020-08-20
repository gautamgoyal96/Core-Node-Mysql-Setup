exports.contentTypeGroups =  function(req , res) {
   let contentTypeGroups = {
        0:{
            '2486' : 'articles', '2492' : 'articles',
            '2488' : 'departments', '2507' : 'departments', '2541' : 'departments', '2545' : 'departments',
            '2490' : 'opinions', '2491' : 'opinions',
            '2493' : 'news', '2495' : 'news', '2496' : 'news', 2487 : 'news',
            '2498' : 'research', '2499' : 'research', '2501' : 'research', '2506' : 'research',
            '2540' : 'columns'

        },
        9:{
            2487 : "news",
        },

        1:{

            '2487' : 'news', '2492' : 'news',
            '2488' : 'news', '2507' :'news', '2541' : 'news', '2545' : 'news',
            '2490' : 'news', '2491' : 'news',
            '2493' : 'news', '2495' : 'news', '2496' : 'news',
            '2498' : 'news', '2499' : 'news', '2501' : 'news', '2506' : 'news',
            '2540' : 'news'

        },
        5:{

            '2486' : 'articles', '2492' : 'articles',
            '2552' : 'opinions', '2491' : 'opinions', '2550' : 'opinions', '2551' : 'opinions',
            '2549' : 'departments', '2591' : 'departments', '2648' : 'departments', '2556': 'departments', '2572' : 'departments',
            '2499' : 'research',
            '2487' : 'news', '2571' : 'news', '2553' : 'news', '2554' : 'news', '2495' : 'news', '2507' : 'news', '2570' : 'news', '2563' :'news', '2488' : 'news', '2562' : 'news',
        },
        7 : {
            '2486' : 'articles', '2492' : 'articles',
            '2600': 'columns', '2491' : 'columns', '2603' : 'columns', '2651' : 'columns', '2490' : 'columns', '2618' : 'columns', '2552' : 'columns', '2616' : 'columns', '2604' : 'columns', '2605' : 'columns', '2617' : 'columns', '2606' : 'columns', '2607' : 'columns','2724':'columns'
        },
        11 : {
                '2486' : 'articles', '2623' : 'articles', '2499' : 'articles', '2492' : 'articles', '2624' : 'articles',
                '2663' : 'departments', '2631' : 'departments', '2630' : 'departments', '2491' : 'departments', '2493' :'departments', '2628' : 'departments', '2633' : 'departments',
                '2487' : 'news',
                '2659' : 'columns', '2669' : 'columns', '2658' : 'columns', '2626' : 'columns', '2636' : 'columns', '2637' : 'columns', '2622' : 'columns', '2638' : 'columns', '2632' : 'columns', '2627' : 'columns', '2639' : 'columns',
        },
        13 : {
                '2486' : 'articles',
                '2641' : 'departments', '2650' : 'departments', '2495' : 'departments',
                '2491' : 'opinions',
                '2487' : 'news',
        },
        6 : {
            2487 : 'news',
            2490 : 'news'
        },
        10 :{
            2490 : 'news',
            2487 : 'news',
        },
        14 : { '2487' : 'news','2490' : 'news'},
        15 : { '2487' : 'news', '2490' : 'news'},
        8  : {  2487 : 'news',  2490 : 'news' }

    };
    return (contentTypeGroups[MAGAZINE_ID]) ? contentTypeGroups[MAGAZINE_ID] : contentTypeGroups[0];
}

exports.contentTypeGroupsOrder =  function(req , res) {

   let contentTypeGroupsOrder = {

            0 : [

                {'title' : 'articles'},
                {'title' : 'opinions'},
                {'title' : 'news'},
                {'title' : 'research'},
                {'title' : 'departments'},
            ],
              // nut
            1 : [

                {'title' : 'articles'},
                {'title' : 'opinions'},
                {'title' : 'news'},
                {'title' : 'research'},
                {'title' : 'departments'},
            ],
            // cw
            5 : [

                {'title' : 'articles'},
                {'title' : 'opinions'},
                {'title' : 'research'},
                {'title' : 'news'},
            ],
            // cp
            7 : [
                {'title' : 'articles'},
                {'title' : 'columns'},
            ],
            // lnw
            11 : [
                {'title' : 'articles'},
                {'title' : 'columns'},
                {'title' : 'departments'},
                {'title' : 'news'},

            ],
            // non
            13 : [
                {'title' : 'articles'},
                {'title' : 'opinions'},
                {'title' : 'departments'},
                {'title' : 'research'},
                {'title' : 'news'},
            ],
            9 : [

                {'title' : 'articles'},
                {'title' : 'opinions'},
                {'title' : 'news'},
                {'title' : 'research'},
                {'title' : 'departments'},
            ]

    };
    return (contentTypeGroupsOrder[MAGAZINE_ID]) ? contentTypeGroupsOrder[MAGAZINE_ID] : contentTypeGroupsOrder[0];
}