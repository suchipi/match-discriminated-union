export function match<
  TypeKey extends string,
  Union extends { [key in TypeKey]: any },
  Handlers extends
    | ({
        // optional variants with default handler
        [Key in Union[TypeKey]]?: (
          value: Union & { [K in TypeKey]: Key },
        ) => any;
      } & {
        _: (value: Union) => any;
      })
    // NOTE: the "optional" object type is specified before the "all variants"
    // object type because in case of error, typescript reports on what's
    // missing from the last thing in this union, and it's more useful to report
    // the missing properties than '_' being missing.
    | {
        // handle all variants
        [Key in Union[TypeKey]]: (
          value: Union & { [K in TypeKey]: Key },
        ) => any;
      },
  Ret extends ReturnType<
    Extract<Handlers[keyof Handlers], (...args: any) => any>
  >,
>(value: Union, key: TypeKey, handlers: Handlers): Ret {
  const type = value[key];
  const handler = handlers[type];
  if (handler) {
    return handler(value);
  } else if ((handlers as any)._) {
    const defaultHandler = (handlers as any)._;
    return defaultHandler(value);
  } else {
    throw new Error("Unhandled case in match: " + type);
  }
}
