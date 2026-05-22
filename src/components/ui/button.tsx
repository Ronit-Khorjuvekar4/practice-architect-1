import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary";

const buttonBase =
  "inline-flex items-center justify-center gap-3 border px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-button-text hover:bg-transparent hover:text-accent",
  secondary:
    "border-line bg-transparent text-white hover:border-accent hover:bg-accent hover:text-button-text",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
): string {
  return cn(buttonBase, buttonVariants[variant], className);
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
