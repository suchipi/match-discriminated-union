import { test, expect } from "vitest";
import { match } from "./index";

type Something =
  | {
      type: "yeppers";
      yes: string;
    }
  | {
      type: "nope";
      no: number;
      definitelyNot: 65;
    }
  | {
      type: "maybe";
    }
  | {
      type: "yeahno";
      potatoes: 75;
    };

test("match - runs the handler for the specified type", () => {
  function testVal(val: Something) {
    let i = 0;

    match(val, "type", {
      yeppers: () => {
        i++;
      },
      _: () => {},
    });

    expect(i).toBe(1);
  }

  testVal({ type: "yeppers", yes: "mhm" });
});

test("match - passes the value into the handler", () => {
  function testVal(val: Something) {
    let wasEqual = false;

    match(val, "type", {
      yeppers: (received) => {
        wasEqual = received === val;
      },
      _: () => {},
    });

    expect(wasEqual).toBe(true);
  }

  testVal({ type: "yeppers", yes: "mhm" });
});

test("match - returns the return value from the corresponding handler", () => {
  function testVal(val: Something) {
    const ret = match(val, "type", {
      yeppers: () => 0.01,
      _: () => 999,
    });

    expect(ret).toBe(0.01);
  }

  testVal({ type: "yeppers", yes: "mhm" });
});

test("match - throws an error if there is no handler for the specified type", () => {
  function testVal(val: Something) {
    match(
      val,
      "type",
      // @ts-expect-error
      {
        yeppers: () => 0.01,
      }
    );
  }

  expect(() => {
    testVal({ type: "maybe" });
  }).toThrowError("Unhandled case in match: maybe");
});
