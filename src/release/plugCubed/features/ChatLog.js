define(['plugCubed/handlers/TriggerHandler', 'plugCubed/Settings', 'plugCubed/Utils'], function(TriggerHandler, Settings, p3Utils) {
    var Lang, Handler;

    Lang = window.plugCubedModules.Lang;
    Handler = TriggerHandler.extend({
        trigger: 'p3:chat:pre',
        handler: function(data) {

            // Logger adapted from Brinkie Pie https://github.com/JTBrinkmann

            var message, name, cid;

            message = p3Utils.html2text(data.originalMessage);
            if (data.un) {

                // Remove Zero width spaces and collapse whitespace.
                name = data.un.replace(/\u202e/g, '\\u202e').replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ');
                name = p3Utils.cleanTypedString(p3Utils.repeatString(' ', 25 - name.length) + name);

                if (data.cid) {
                    cid = data.cid.replace(/\u202e/g, '\\u202e').replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ');
                    cid = p3Utils.repeatString(' ', 25 - cid.length) + cid;

                    if (window.plugCubed.chatHistory.push(p3Utils.getTimestamp() + ' ' + cid + ' ' + name + ': ' + message) > 512) {
                        window.plugCubed.chatHistory.shift();
                    }
                    if (Settings.chatLog) {
                        if (data.message.indexOf('/em') === 0 || data.message.indexOf('/me') === 0) {
                            console.log(
                                p3Utils.getTimestamp() + ' \uD83D\uDCAC %c ' + cid + '%c' + name + ': %c' + message,
                                '', 'font-weight: bold', 'font-style: italic'
                            );
                        } else {
                            console.log(
                                p3Utils.getTimestamp() + ' \uD83D\uDCAC %c ' + cid + '%c' + name + ': %c' + message,
                                '', 'font-weight: bold', ''
                            );
                        }
                    }
                } else if (data.type.indexOf('moderation') > -1 && Settings.chatLog) {
                    console.info(
                        p3Utils.getTimestamp() + ' \uD83D\uDCAC %c ' + p3Utils.repeatString(' ', 25) + '%c' + name + ': %c' + message,
                        '', 'font-weight: bold', 'color: #ac76ff'
                    );
                }
            } else if (data.type.indexOf('system') > -1 && Settings.chatLog) {
                var style = 'font-size: 1.2em; font-weight: bold; border: 1px solid #42a5dc';

                console.info(
                    p3Utils.getTimestamp() + ' \uD83D\uDCAC %c ' + (typeof Lang != 'undefined' ? Lang.alerts.systemAlert : 'System Alert') + ':%c ' + message + ' ',
                    style + '; color: #42a5dc; border-right: none',
                    style + '; border-left: none'
                );
            } else if (Settings.chatLog) {
                console.log(p3Utils.getTimestamp() + ' \uD83D\uDCAC %c' + message, 'color: #36F');
            }
        }
    });

    return new Handler();
});
