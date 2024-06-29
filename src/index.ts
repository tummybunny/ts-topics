type Topic = string | symbol | number;

type Message<T extends object = any> = T | string | number;

type Subscriber<Message> = (m: Message) => void;

type UnsubscribeHandler = () => void;

type ListenerHandler<T extends Message> = {
    publish: (m: T) => void,
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler
}

const allTopics = new Map<Topic, ListenerHandler<Message>>();

function useListener<Message>(topic: Topic): ListenerHandler<Message> {
    const h = allTopics.get(topic);
    if (!h) {
        var subId = 1;
        const subscribers = new Map<number, Subscriber<any>>();
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
        return h as ListenerHandler<Message>;
    }
}

export default useListener;