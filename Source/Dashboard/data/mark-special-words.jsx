export const markSpecialWords = [
    {
        match: [
            'activateDots=',
            'activeCount=',
            'activeCountHtml',
            'animateKeepOpenBack=',
            'animateSlider=',
            'animateSliderDirection=',
            'animateSliderTime=',
            'animation=',
            'animationTime=',
            'attributes',
            'attributes=',
            'border=',
            'childs',
            'class',
            'class=',
            'className=',
            'customData:',
            'data=',
            'dataImage=',
            'description',
            'displayButtons=',
            'dots=',
            'function',
            'function=',
            'functionData',
            'functionData=',
            'href',
            'id=',
            'keepOpen=',
            'link=',
            'moveSlider=',
            'onlyImage',
            'overrideHostname=',
            'react-divcreator',
            'rebuildSliderAfter=',
            'slideTime=',
            'text',
            'title',
            'textSearch',
            'placeholder=',
            'clearInputOnChange=',
            'textDropDown',
            'choosedText',
            'onChangeCallback=',
            'multiChoice=',
            'maxHeight=',
            'doubleChoosedRemove='
        ],
        color: 'steelblue'
    },
    {
        match: [
            '=>',
            'const',
            'from',
            'import',
        ],
        className: 'color-react-blue'
    },
    {
        match: [
            '(',
            ')',
            'console.clear()',
            'console.info',
            'consoleLog',
            'log',
            'logOpen',
            'logClose',
            'performance',
        ],
        color: 'palevioletred'
    },
    {
        match: [
            'accordionSingleEntry', 
            'customData',
            'event'
        ],
        className: 'color-buttons'
    }
];