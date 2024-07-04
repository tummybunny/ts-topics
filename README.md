"# ts-topics" 

Simple topic publisher / consumer in typescript. Needing it for my small project at home, therefore I might as well modularize it and put it in github.

My objective is to pass message among react components without much hassle.


"## Usage with react"

```
// Domain object
// *************

type M1 = {
    num: number,
    text: string
};

...
// PublisherComponent
// ******************

import useListener from "ts-topics";

function publishMessage(num: number, text: string) {
    const msgHandler = useListener<M1>("MyTopic");  // the same topic
    msgHandler.publish({ num, text});
}

...
// SubscriberComponent
// *******************

import useListener from "ts-topics";

useEffect(() => {
    const msgHandler = useListener<M1>("MyTopic"); // the same topic
    const unsub = msgHandler.subscribe((m) => {
        // do whatever with message of type M1
    });
    return unsub;  // return unsubscribe handler
}, [prop1, prop2, prop3]);

```