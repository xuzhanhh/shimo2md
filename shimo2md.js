/**
 * Created by 2 on 2017/6/12.
 */


// $(document).ready(function () {
//     console.log('in plugin');
//     while (start.nextElementSibling !== null) {
//         start = start.nextElementSibling;
//
//         // let current = start.children;
//         // let current = start;
//
//         checkTitle(start);
//
//     }
//     console.log(md);
// });

// }


setTimeout(run, 4000);

// document.getElementById('clickToChange').onclick=function () {
//     console.log("dousha");
//     document.getElementById('content').innerHTML="dousha";
//     // run();
//     // document.getElementById('content').innerHTML="dousha";
// };
//
let md = "";
let isMore=false;
function run() {
    console.log("run");
    addHeader();
    let start = $(":contains('稿件正文')")[14];
    while (start.nextElementSibling !== null) {
        start = start.nextElementSibling;

        // let current = start.children;
        // let current = start;

        checkTitle(start);

    }
    console.log(md);
    // document.getElementById('content').innerHTML=md;
}

function addHeader() {
    let title = $($('#doc-title-input')[0]).attr('data-value');
    let [school, major] = headerUniverse();
    let [artist, graduate] = headerArtist();
    let date = headerVersion();
    md += `---
title: ${title}
date: ${date}
writer:${artist}
tags:
    - ${school}
    - ${major}
---\n`;
    md += `${artist} ${school} ${major} ${graduate}级\n`;

    // console.log(md.length);
}

function headerVersion() {
    let writer = $(":contains(定稿日期)");
    writer = writer[writer.length - 2];
    writer = writer.nextElementSibling;
    // let artist=writer.children[0].innerHTML;
    // let date = writer.children[1].innerHTML;
    return writer.children[1].innerHTML;
}

function headerArtist() {
    let writer = $(":contains(作者)");
    writer = writer[writer.length - 2];
    writer = writer.nextElementSibling;
    let artist = writer.children[0].innerHTML;
    let graduate = writer.children[2].innerHTML;
    return [artist, graduate];
}

//获取就读学校与专业、所获学位表格的信息
function headerUniverse() {
    let table = $(":contains(学业阶段)");
    table = table[table.length - 2];
    table = table.nextElementSibling;
    let school = table.children[1].innerHTML;
    let major = table.children[2].innerHTML;
    return [school, major];
}

function checkTitle(current) {
    if(!isMore&&md.length>250){
        md+="<!-- more -->\n";
        isMore=true;
    }

    md += isTextIndent(current);
    if (current.className != undefined && current.className.indexOf("heading-2") != -1) {
        //中标题
        md += "\n## ";
        md += outerTranslate(current.children);
    } else if (current.className != undefined && current.className.indexOf("heading-1") != -1) {
        //小标题
        md += "\n### ";
        md += outerTranslate(current.children);
    } else {
        //非标题
        md += outerTranslate(current.children);
    }


}

function outerTranslate(current, enter = true) {
    let md = "";
    let length = current.length;
    for (let i = 0; i < length; i++) {
        if (current[i].tagName === "BR") {
            md += "<br>";
        }
        else if (current[i].tagName === "INHERIT") {

            md += outerTranslate(current[i].children, false)
        }

        //还有超链接的情况没写
        else if (current[i].tagName === "SPAN") {

            if (current[i].children.length > 0) {
                md += outerTranslate(current[i].children, false)
            }

            //加粗的情况
            else if (current[i].className.indexOf("b") != -1) {
                md += isBold(current[i].innerHTML);
            } else {
                md += current[i].innerHTML;
            }
        }
        else if (current[i].tagName === "UL") {
            md += "* ";
            md += outerTranslate($(current[i].children[0].children[0]), false);
        }
        else if (current[i].tagName === "FONT") {
            md += current[i].innerHTML;
        }
        else if (current[i].tagName === "B") {
            md += "** ";
            md += (current[i].innerHTML);
            md += "** "
        }
        else if (current[i].tagName === "HR") {
            md += "<hr>\n";
        }

    }
    if (enter === true) {
        md += "\n";
    }
    // console.log(md.length);
    return md;
}

function isBold(innerhtml) {

    innertext = $(innerhtml)[0].innerHTML;
    let temp = " **";
    temp += innertext;
    temp += "** ";
    return temp;
}

function isul() {

}

function isTextIndent(current) {
    if (current.className.indexOf("text-indent") != -1) {
        return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    return "";
}

