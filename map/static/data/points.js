/**
 * Created by juyoung on 2017-11-20.
 */

var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.15,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
};



var heatOne={ max :2,data:[{lat:37.6764098,lng:128.7224516,count:6},
    {lat:37.52412565 ,lng:128.1350163,count:5},
    {lat:37.24994816 ,lng:127.5896898,count:3},
    {lat:36.87235388 ,lng:127.0349765,count:5},
    {lat:37.52412565 ,lng:126.8148658,count:4},
    {lat:35.56619694 ,lng:127.5896898,count:3},
    {lat:35.12276517 ,lng:127.0813773,count:6},
    {lat:35.64449266 ,lng:126.9285073,count:3},
    {lat:37.79459793 ,lng:128.755997,count:2},
    {lat:38.16180611 ,lng:128.4901005,count:3},
    {lat:37.78212766 ,lng:128.6991031,count:5},
    {lat:37.6764098 ,lng:128.7224516,count:4},
    {lat:37.90486286 ,lng:128.5262807,count:3},
    {lat:37.77093315 ,lng: 128.5605245,count:6},
    {lat:37.05893523 ,lng: 127.1748553,count:2},
    {lat:36.44114692 ,lng:127.5424714,count:3},
    {lat:36.58827554 ,lng:127.3791091,count:5},
    {lat:36.87938299 ,lng:127.0045571,count:4},
    {lat:36.41330895 ,lng:127.2542821,count:3},
    {lat:35.7866228 ,lng:127.4172337,count:6},
    {lat:36.23978171 ,lng:126.4694451,count:5},
    {lat:35.11956577 ,lng:127.1688259,count:7},
    {lat:36.0650889,lng:126.5143411,count:4},
    {lat:35.12276517,lng:127.0813773,count:6},
    {lat:35.65541008 ,lng:126.6634131,count:5}
]};


var heatTwo={ max :2,data:[{lat:37.51689037,lng:127.2179151,count:4},
    {lat:37.06311165 ,lng:127.2501474,count:6},
    {lat:36.88733364,lng:127.5098519,count:7},
    {lat:36.32990547,lng:127.5475387,count:4},
    {lat:37.49977803,lng:127.2457745,count:5},
    {lat:37.49977803,lng:126.9604816,count:3},
    {lat:37.41764049,lng:127.0967968,count:4},
    {lat:36.39011032,lng:127.9345396,count:3},
    {lat:37.11165364 ,lng:127.2106728,count:6},
    {lat:37.25422079 ,lng:127.3231869,count:3},
    {lat:36.94807474 ,lng:127.15601,count:5},
    {lat:36.82835149 ,lng:127.0931722,count:4},
    {lat:36.78176748 ,lng:127.0803577,count:3},
    {lat:37.1718734 ,lng:127.3959739,count:7},
    {lat:36.32990547,lng:127.5475387,count:4},
    {lat:36.18440235 ,lng:127.4913384,count:6},
    {lat:36.56016841 ,lng:127.76995,count:3},
    {lat:36.061442 ,lng:127.5403052,count:5},
    {lat:36.10509995 ,lng:127.5957424,count:4}]};

var heatThree={ max :2,data:[{lat:37.47355514,lng:127.40869,count:3},
    {lat:36.88161839,lng:127.4501799,count:7},
    {lat:36.34338878,lng: 127.6231902,count:3},
    {lat:36.04199866,lng:127.7836042,count:2},
    {lat:36.47999217,lng:127.8228283,count:4},
    {lat:37.75569383,lng: 127.6248583,count:3},
    {lat:37.57691976,lng:127.6627599,count:4},
    {lat:36.57529368,lng:128.5633856,count:5},
    {lat:36.68379908 ,lng:127.3857972,count:6},
    {lat:36.95631104 ,lng:127.655378,count:4},
    {lat:37.39514739 ,lng:128.0157961,count:5},
    {lat:37.0943308 ,lng:127.9172958,count:4},
    {lat:36.5191934 ,lng: 127.6503277,count:3},
    {lat:37.06734962 ,lng:128.1493839,count:5},

    {lat:36.52762672 ,lng:128.3672176,count:6},
    {lat:36.70940144 ,lng:128.5311452,count:3},
    {lat:36.03666689 ,lng:128.0601952,count:5},
    {lat:36.42941782 ,lng:128.3995611,count:4},
    {lat:35.66981565 ,lng:127.8367442,count:7},]};


var pathOne=['M',[38.60786847,128.6564856],
    'Q',[38.19999161,128.5886528],
    [37.77093315,128.5605245],
    [37.31550763,128.5621837],
    [37.69897557,127.8281355],
    [37.14043319,127.5558244],
    [36.41660181,127.43126],
    [35.75630039,127.1089715],
    [36.23978171,126.4694451],
    'T',[35.90957804,126.4416366]];


var pathTwo=['M',[37.2180181,126.7367133],
    'Q',[37.27024889,126.9217624],
    [36.96628596,127.2257878],
    [36.84659422,127.4278815],
    [36.36732865,127.5623861],
    [36.12060581,127.6577222],
    [36.009663,127.7209321],
    'T',[36.22718651,127.975381]];


var pathThree=['M',[37.51148688,127.1739572],
    'Q',[37.51689303,127.3950633],
    [36.60737297,127.2164508],
    [37.21544146,128.107532],
    [37.16643384,128.2911529],
    [36.04810802,127.7515783],
    [36.30336161,128.4098758],
    'T',[36.26167706,128.5637853]];


var importantMarkersOne = [[37.24994816,127.5896898],[37.34126518,127.806691],[36.9089299,128.3377218],[37.28875488,128.314931],[37.46746766,128.6343425],[35.22463986,126.994852]]
var importantMarkersTwo = [[36.26530003,128.0744454],[36.23901356,127.9088011],[36.56016841,127.76995],[36.59712386,127.2580032],[37.18719421,127.4448951],[37.07446326,126.9393514]]
var importantMarkersThree = [[36.34905932,128.0878683],[36.59192185,128.4624854],[36.6347954,127.4982246], [36.60737297,127.2164508], [37.57691976,127.6627599]]