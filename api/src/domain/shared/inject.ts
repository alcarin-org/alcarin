type Tail<T extends any[]> = ((...t: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : [];

type availableFunction<DIType> = (di: DIType, ...rest: any) => any;

export function injectDI<FType extends availableFunction<DIType>, DIType>(
  f: FType,
  inject: DIType
) {
  type k = Tail<Parameters<typeof f>>;

  const args = f.arguments.slice();
  args.pop();
  return (...rest: k): ReturnType<typeof f> => {
    return f.apply(null, [inject, rest]);
  };
}
