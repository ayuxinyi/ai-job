import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  Suspense,
} from "react";

interface Props {
  condition: () => Promise<boolean>;
  loadingFallback?: ReactNode;
  otherwise?: ReactNode;
}

const AsyncIf: FC<PropsWithChildren<Props>> = ({
  children,
  condition,
  otherwise,
  loadingFallback,
}) => {
  return (
    <Suspense fallback={loadingFallback}>
      <SuspensedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspensedComponent>
    </Suspense>
  );
};

const SuspensedComponent: FC<
  PropsWithChildren<Omit<Props, "loadingFallback">>
> = async ({ children, otherwise, condition }) => {
  return (await condition()) ? children : otherwise;
};

export default AsyncIf;
