/**
 * Combina clases CSS de forma condicional (estilo shadcn/ui).
 */
export function cn(
  ...inputs: (string | undefined | false | null)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
