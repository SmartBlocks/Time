define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/Calendar/Views/Calendar'
], function ($, _, Backbone, CalendarView) {


    function checkReminders() {
        var now = new Date();
        var events = SmartBlocks.Blocks.Time.Data.events;
        for (var k in events.models) {
            var event = events.models[k];
            if (event.get("reminder")) {
                var reminder = event.get("reminder");
                var remind_start = new Date(event.getStart());
                remind_start.setMinutes(remind_start.getMinutes() - reminder.time);
                var remind_end = new Date(event.getStart());
                if (now > remind_start && now < remind_end && !reminder.seen) {
                    SmartBlocks.Blocks.Notifications.Main.notify("Reminder",
                        event.get('name') + " starts in " + Math.round((event.getStart().getTime() - now.getTime()) / 60000) + " minutes",
                        {
                            ok: function () {
                                event.set("reminder", undefined);
                                event.save();
                            },
                            ignore: function () {
                                event.set("reminder", undefined);
                                event.save();
                            },
                            remind_me: function () {
                                var minutes_to_start = Math.round((event.getStart().getTime() - now.getTime()) / 60000) - 5;
                                if (minutes_to_start > 0) {
                                    reminder.time = minutes_to_start;
                                    reminder.seen = false;
                                }
                                event.save();
                            }
                        });
                    reminder.seen = true;
                }
            }
        }
    }

    var main = {
        custom_context_menu_items: [],
        init: function () {
            var base = this;

            setInterval(function () {
                checkReminders();
            }, 1000);
        },
        addEventContextMenuItem: function (name, callback) {
            var base = this;
            base.custom_context_menu_items.push({
                name: name,
                callback: callback
            });
        },
        launch_calendar: function (app) {
            var calendar_view = new CalendarView();
            SmartBlocks.Methods.render(calendar_view.$el);
            calendar_view.init(app);
        }
    };
    return main;
});