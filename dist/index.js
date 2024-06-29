"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allTopics = new Map();
function useListener(topic) {
    const h = allTopics.get(topic);
    if (!h) {
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
exports.default = useListener;
