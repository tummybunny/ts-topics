"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useListener;
const allTopics = new Map();
function useListener(topic) {
    const h = allTopics.get(topic);
    if (!h) {
        // I don't expect the number of active subscribers will exceed Number.MAX_SAFE_INTEGER, i.e. 2^53-1 (9,7 quadrillion)
        // before subId overflows...
        // looping 9,7 quadrillion times in single-threaded JS would poise an issue in itself...
        var subId = 1;
        const subscribers = new Map();
        const h = {
            subscribe: (sub) => {
                const newSubId = ++subId;
                subscribers.set(newSubId, sub);
                return () => {
                    subscribers.delete(newSubId);
                };
            },
            publish: (m) => {
                subscribers.forEach((sub, subId) => {
                    try {
                        sub(m);
                    }
                    catch (e) {
                        console.log("Unable to publish. Subscriber:", subId, ", Error: ", e, ", Message: ", m);
                    }
                });
            }
        };
        allTopics.set(topic, h);
        return h;
    }
    else {
        return h;
    }
}
