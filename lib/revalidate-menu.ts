import { revalidatePath } from "next/cache";

export function revalidateMenuPages() {
  revalidatePath("/menu");
  revalidatePath("/");
}
