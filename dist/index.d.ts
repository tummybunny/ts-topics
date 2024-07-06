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
    publish: (m: T) => void;
    /**
     * Register a subscriber
     * @param s subscriber
     * @returns a handler to unsubscribe
     */
    subscribe: (s: Subscriber<T>) => UnsubscribeHandler;
};
/**
 *
 * @param topic
 * @returns
 */
export default function useListener<T extends Message>(topic: Topic): ListenerHandler<T>;
