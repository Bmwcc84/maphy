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
  activatedAt?: string;
};

export type Enrollment = {
  course_id: string;
  payment_status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  created_at: string;
  updated_at: string | null;
};

export type StudentFeedbackInput = {
  referenceId: string;
  userId?: string;
  studentName?: string;
  studentEmail: string;
  category: string;
  subject: string;
  message: string;
  rating?: number;
  pageUrl?: string;
  userAgent?: string;
};

export type StudentFeedback = {
  reference_id: string;
  created_at: string;
};

export type ActivityRecord = {
  kind: "visit" | "test_attempt";
  createdAt: string;
  pageUrl?: string;
  testName?: string;
  score?: number;
  totalQuestions?: number;
  userId?: string;
  userEmail?: string;
};

function getSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

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
        updated_at: input.activatedAt ?? new Date().toISOString(),
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
    select: "course_id,payment_status,razorpay_order_id,razorpay_payment_id,created_at,updated_at",
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

export async function savePrivateActivity(record: ActivityRecord) {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const bucket = "maphy-private-activity";
  const headers = adminHeaders(serviceRoleKey);
  const exists = await fetch(`${url}/storage/v1/bucket/${bucket}`, { headers, cache: "no-store" });
  if (!exists.ok) {
    const created = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST", headers,
      body: JSON.stringify({ id: bucket, name: bucket, public: false, allowed_mime_types: ["application/json"] }), cache: "no-store",
    });
    if (!created.ok && created.status !== 409) throw new Error("Unable to create private activity storage.");
  }
  const stamp = record.createdAt.replace(/[:.]/g, "-");
  const prefix = record.createdAt.slice(0, 10);
  const object = `${prefix}/${stamp}-${crypto.randomUUID()}.json`;
  const upload = await fetch(`${url}/storage/v1/object/${bucket}/${object}`, {
    method: "POST", headers: { ...headers, "x-upsert": "false" }, body: JSON.stringify(record), cache: "no-store",
  });
  if (!upload.ok) throw new Error("Unable to save activity.");
}

export async function listPrivateActivity(limit = 300) {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const headers = adminHeaders(serviceRoleKey);
  const bucket = "maphy-private-activity";
  const root = await fetch(`${url}/storage/v1/object/list/${bucket}`, { method: "POST", headers, body: JSON.stringify({ prefix: "", limit: 100, sortBy: { column: "name", order: "desc" } }), cache: "no-store" });
  if (!root.ok) return [] as ActivityRecord[];
  const folders = (await root.json()) as Array<{ name: string }>;
  const records: ActivityRecord[] = [];
  for (const folder of folders.slice(0, 31)) {
    const list = await fetch(`${url}/storage/v1/object/list/${bucket}`, { method: "POST", headers, body: JSON.stringify({ prefix: folder.name, limit, sortBy: { column: "name", order: "desc" } }), cache: "no-store" });
    if (!list.ok) continue;
    for (const item of (await list.json()) as Array<{ name: string }>) {
      const object = await fetch(`${url}/storage/v1/object/${bucket}/${folder.name}/${item.name}`, { headers, cache: "no-store" });
      if (object.ok) records.push(await object.json() as ActivityRecord);
      if (records.length >= limit) return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createStudentFeedback(input: StudentFeedbackInput) {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const createdAt = new Date().toISOString();
  const payload = {
    reference_id: input.referenceId,
    user_id: input.userId ?? null,
    student_name: input.studentName ?? null,
    student_email: input.studentEmail,
    category: input.category,
    subject: input.subject,
    message: input.message,
    rating: input.rating ?? null,
    page_url: input.pageUrl ?? null,
    user_agent: input.userAgent ?? null,
    status: "new",
    created_at: createdAt,
    updated_at: createdAt,
  };
  const response = await fetch(`${url}/rest/v1/student_feedback`, {
    method: "POST",
    headers: {
      ...adminHeaders(serviceRoleKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    await saveFeedbackToPrivateStorage(url, serviceRoleKey, payload);
    return { reference_id: input.referenceId, created_at: createdAt };
  }

  const rows = (await response.json()) as StudentFeedback[];
  return rows[0];
}

async function saveFeedbackToPrivateStorage(
  url: string,
  serviceRoleKey: string,
  payload: Record<string, unknown>,
) {
  const bucketName = "student-feedback";
  const headers = adminHeaders(serviceRoleKey);
  const bucketResponse = await fetch(`${url}/storage/v1/bucket/${bucketName}`, {
    headers,
    cache: "no-store",
  });

  if (!bucketResponse.ok) {
    const createBucketResponse = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: bucketName,
        name: bucketName,
        public: false,
        file_size_limit: 102_400,
        allowed_mime_types: ["application/json"],
      }),
      cache: "no-store",
    });

    if (!createBucketResponse.ok && createBucketResponse.status !== 409) {
      const message = await createBucketResponse.text();
      throw new Error(`Unable to create private feedback storage: ${message}`);
    }
  }

  const referenceId = String(payload.reference_id);
  const createdAt = String(payload.created_at);
  const month = createdAt.slice(0, 7);
  const uploadResponse = await fetch(
    `${url}/storage/v1/object/${bucketName}/${month}/${referenceId}.json`,
    {
      method: "POST",
      headers: {
        ...headers,
        "x-upsert": "false",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text();
    throw new Error(`Unable to save private feedback object: ${message}`);
  }
}
