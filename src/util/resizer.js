import './resizer.css';

import $ from 'jquery-slim';

export const resizer = function (obj, obj2, onResize) {
    obj = $(obj);

    if (obj2) {
        obj2 = $(obj2);
    }

    const div = $('<div id="resizer"></div>');

    div.css('top', obj.position().top + Math.round(obj.outerHeight()) + 'px');
    div.css('left', obj.position().left + 'px');
    div.width(obj.outerWidth());

    obj.after(div);

    const divHeight = div.height();
    const divHeightOffset = Math.ceil(divHeight / 2);

    div.css('top', div.position().top - divHeightOffset);

    var entryTop = undefined;

    div.mousedown(function (evt) {
        entryTop = evt.pageY

        const divHeightBig = divHeight * 20;
        const divHeightOffsetBig = Math.ceil(divHeightBig / 2);

        div.height(divHeightBig);
        div.css('top', div.position().top - divHeightOffsetBig + 'px');

        div.mousemove(function (evt) {
            if (entryTop) {
                const y = evt.pageY;
                const delta = y - entryTop;

                if (obj.height() + delta > 50) {
                    div.css('top', y - divHeightOffsetBig + 'px');

                    obj.height(obj.height() + delta);

                    if (obj2) {
                        obj2.css('top', obj2.position().top + delta + 'px');
                    }

                    if (onResize) {
                        onResize();
                    }

                    entryTop = y;
                }
            }
        });
    });

    const stop = function () {
        entryTop = undefined;

        div.mousemove(function () {
        });

        div.height(divHeight);
        div.css('top', obj.position().top + Math.round(obj.outerHeight()) + 'px');
    }

    div.mouseup(function (evt) {
        stop();
    });
    div.mouseleave(function (evt) {
        stop();
    });
    div.mouseout(function (evt) {
        stop();
    });
}
