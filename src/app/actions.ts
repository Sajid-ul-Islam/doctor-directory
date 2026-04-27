"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function switchLanguage(lang: string) {
    (await cookies()).set("NEXT_LOCALE", lang, { path: "/" });
    revalidatePath("/");
}