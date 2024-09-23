"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

export async function shareMeal(prevState, formData) {
  function isInvalidText(text) {
    return !text || text.trim() === "";
  }

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid Input",
    };
  }
  await saveMeal(meal);
  // Tells nextjs to revalidate the cache that belongs to a certain route path
  // This will force nextjs to revalidate the meals path so the newly added
  // meal will appear upon redirect
  // Adding the "layout" flag will force all nexted pages to also be revalidated

  // revalidatePath("/meals", "layout");
  // revalidatePath("/", "layout") would revalidate all pages in your website
  revalidatePath("/meals");
  redirect("/meals");
}
