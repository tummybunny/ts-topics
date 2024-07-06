/**
 * Represent a unique topic.
 */
export type Topic = string | symbol | number;

/**
 * Represent a message that publisher(s) would publish and subscriber(s) would consume.
 */
export type Message<T extends object = any> = T | string | number | symbol;

/**
 * Represent a Subscriber which will receive a Message when publisher(s) publish it.
 */
export type Subscriber<T extends Message> = (m: T) => void;

/**
 * A function that a Subscriber should call to unsubscribe itself from a Topic.
 * Must be called otherwise it can cause memory leak.
 */
export type UnsubscribeHandler = () => void;

/**
 * Handler returned from useListener(Topic)
 */
export type ListenerHandler<T extends Message> = {
    /**
     * Publish a message synchronously. 
     * Unhandled exception encountered during processing by a subscriber will not block the
     * subsequent subscribers to process the message.
     * 
     * @param m message
     */
    publish: (m: T) => void,

    /**
     * Register a subscriber
     * @param s subscriber
     * @returns a handler to unsubscribe
     */
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler
}

const allTopics = new Map<Topic, ListenerHandler<Message>>();

/**
 * 
 * @param topic 
 * @returns 
 */
export default function useListener<T extends Message>(topic: Topic): ListenerHandler<T> {
    const h = allTopics.get(topic);
    if (!h) {
        // I don't expect the number of active subscribers will exceed Number.MAX_SAFE_INTEGER, i.e. 2^53-1 (9,7 quadrillion)
        // before subId overflows...
        // looping 9,7 quadrillion times in single-threaded JS would poise an issue in itself...
        var subId = 1;  
        const subscribers = new Map<number, Subscriber<T>>();
        const h: ListenerHandler<T> = {
            subscribe: (sub: Subscriber<T>) => {
                const newSubId = ++subId;
                subscribers.set(newSubId, sub);
                return () => {
                    subscribers.delete(newSubId);
                }
            },
            publish: (m: T) => {
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
