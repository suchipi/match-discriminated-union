import { assert, Is } from "typescript-assert-utils";
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

declare var something: Something;

// all variants specified in handlers object
{
  const ret = match(something, "type", {
    yeppers: (val) => val.yes,
    nope: (val) => val.definitelyNot,
    maybe: (val) => new Set(),
    yeahno: () => {},
    // _: () => 42,
  });

  assert<Is<typeof ret, string | 65 | Set<unknown> | void>>;
}

// some variants specified in handlers object, without default handler
{
  match(
    something,
    "type",
    // @ts-expect-error property yeahno is missing
    {
      yeppers: (val) => val.yes,
      nope: (val) => val.definitelyNot,
      maybe: (val) => new Set(),
    },
  );

  match(
    something,
    "type",
    // @ts-expect-error properties yeppers and yeahno are missing
    {
      nope: (val) => val.definitelyNot,
      maybe: (val) => new Set(),
    },
  );

  match(
    something,
    "type",
    // @ts-expect-error not valid
    {},
  );
}

// some variants specified in handlers object, with default handler
{
  const ret1 = match(something, "type", {
    yeppers: (val) => val.yes,
    nope: (val) => val.definitelyNot,
    maybe: (val) => new Set(),
    _: () => 99 as const,
  });
  assert<Is<typeof ret1, string | 65 | Set<unknown> | 99>>;

  const ret2 = match(something, "type", {
    nope: (val) => val.definitelyNot,
    maybe: (val) => new Set(),
    _: () => new Map<string, string>(),
  });
  assert<Is<typeof ret2, 65 | Set<unknown> | Map<string, string>>>;

  const ret3 = match(something, "type", {
    _: () => "yes!!" as const,
  });
  assert<Is<typeof ret3, "yes!!">>;
}
