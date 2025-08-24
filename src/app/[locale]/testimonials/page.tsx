import { getTestimonialsAction } from "@/app/actions";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonialsAction();

  return (
    <>
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}