import "server-only";

type EnrollmentInput = {
  userId: string;
  userEmail?: string;
  courseId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  paymentStatus: "authorized" | "captured";
};

export type Enrollment = {
  course_id: string;
  payment_status: string;
  created_at: string;
};

function getSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin configuration is missing.");
  }

  return { url, serviceRoleKey };
}

function adminHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function upsertEnrollment(input: EnrollmentInput) {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const response = await fetch(
    `${url}/rest/v1/course_enrollments?on_conflict=user_id,course_id`,
    {
      method: "POST",
      headers: {
        ...adminHeaders(serviceRoleKey),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        user_id: input.userId,
        user_email: input.userEmail ?? null,
        course_id: input.courseId,
        razorpay_order_id: input.razorpayOrderId,
        razorpay_payment_id: input.razorpayPaymentId,
        amount: input.amount,
        currency: input.currency,
        payment_status: input.paymentStatus,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to save enrollment: ${message}`);
  }

  const rows = (await response.json()) as Enrollment[];
  return rows[0];
}

export async function getEnrollmentsForUser(userId: string) {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const query = new URLSearchParams({
    select: "course_id,payment_status,created_at",
    user_id: `eq.${userId}`,
    payment_status: "eq.captured",
    order: "created_at.desc",
  });
  const response = await fetch(`${url}/rest/v1/course_enrollments?${query}`, {
    headers: adminHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to load enrollments: ${message}`);
  }

  return (await response.json()) as Enrollment[];
}
