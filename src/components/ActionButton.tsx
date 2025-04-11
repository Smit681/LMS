"use client";

import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import LoadingTextSwap from "./LoadingTextSwap";

export function ActionButton({
  action,
  requireAreYouSure = false,
  ...props
}: Omit<ComponentPropsWithRef<typeof Button>, "onClick"> & {
  action: () => Promise<{ error: boolean; message: string }>;
  requireAreYouSure?: boolean;
}) {
  {
    const [isLoading, startTransition] = useTransition();

    function performAction() {
      startTransition(() => {
        (async () => {
          const data = await action();
          if (data.error) {
            toast.error(data.message);
          } else toast.success(data.message);
        })();
      });
    }

    if (requireAreYouSure) {
      return (
        <AlertDialog open={isLoading ? true : undefined}>
          <AlertDialogTrigger asChild>
            <Button {...props} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={() => performAction()}
              >
                <LoadingTextSwap isLoading={isLoading}>Yes</LoadingTextSwap>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return (
      <Button {...props} disabled={isLoading} onClick={performAction}>
        <LoadingTextSwap isLoading={isLoading}>
          {props.children}
        </LoadingTextSwap>
      </Button>
    );
  }
}
