export type Topic = string | symbol | number;

export type Message<T extends object = any> = T | string | number;

export type Subscriber<Message> = (m: Message) => void;

export type UnsubscribeHandler = () => void;

export type ListenerHandler<T extends Message> = {
    publish: (m: T) => void,
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler
}

const allTopics = new Map<Topic, ListenerHandler<Message>>();

export default function useListener<Message>(topic: Topic): ListenerHandler<Message> {
    const h = allTopics.get(topic);
    if (!h) {
        // I don't expect the number of active subscribers will exceed Number.MAX_SAFE_INTEGER, i.e. 2^53-1 (9,7 quadrillion)
        // before subId overflows...
        // looping 9,7 quadrillion times in single-threaded JS would poise an issue in itself...
        var subId = 1;  
        const subscribers = new Map<number, Subscriber<Message>>();
        const h: ListenerHandler<Message> = {
            subscribe: (sub: Subscriber<Message>) => {
                const newSubId = ++subId;
                subscribers.set(newSubId, sub);
                return () => {
                    subscribers.delete(newSubId);
                }
            },
            publish: (m: Message) => {
                subscribers.forEach((sub, subId) => {
                    try {
                        sub(m);
                    } catch (e) {
                        console.log("Unable to publish. Subscriber:", subId, ", Error: ", e, ", Message: ", m);
                    }
                })
            }
        };
        allTopics.set(topic, h);
        return h;
    } else {
        return h;
    }
}
