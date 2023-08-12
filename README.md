# match-discriminated-union

A simple `match` function that, provided an instance of a tagged union and its discriminating key, runs the corresponding match handler function and returns its result.

TypeScript types are included which are designed to be flexible and support your existing types. The TypeScript types also require that you either specify handler functions for every variant of the union, or include a "default" case (via the key `_`).

## Usage example

```ts
import { match } from "match-discriminated-union";

// An example of a user-defined type to match against
type PendingData<T> = {
  id: "loading",
  percent: number
} | {
  id: "unstarted"
} | {
  id: "complete",
  data: T
} | {
  id "errored",
  error: Error
};

function logProgress(pendingData: PendingData<any>) {
  const message = match(pendingData, "id", {
    loading: ({ percent }) => `Loading (${percent}%)...`,
    unstarted: () => `Waiting...`,
    complete: () => `Completed!`,
    errored: ({ error }) => `Failed: ${error}`,
  });
  console.log(message);
}

function getPercent(pendingData: PendingData<any>) {
  return match(pendingData, "id", {
    loading: ({ percent }) => percent,
    // This '_' property is the default handler for any unspecified members of the union.
    _: () => 0,
  });
}
```

## Previous Work

- [safety-match](https://github.com/suchipi/safety-match) - Similar goals to this library, but its design couldn't support generics very well.

## License

MIT
