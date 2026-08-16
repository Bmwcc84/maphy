type DownloadMetadata = {
  error?: string;
  fileName?: string;
  parts?: number;
  token?: string;
};

export async function downloadCoursePdf(
  courseId: string,
  accessToken: string,
  onProgress?: (percentage: number) => void,
) {
  const metadataResponse = await fetch(
    `/api/course-content/${courseId}?meta=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  const metadata = (await metadataResponse.json().catch(() => null)) as
    | DownloadMetadata
    | null;

  if (
    !metadataResponse.ok ||
    !metadata?.fileName ||
    !metadata.parts ||
    !metadata.token
  ) {
    throw new Error(metadata?.error ?? "PDF download nahi ho saka.");
  }

  const chunks: ArrayBuffer[] = [];
  const batchSize = 4;

  for (let firstPart = 0; firstPart < metadata.parts; firstPart += batchSize) {
    const partNumbers = Array.from(
      { length: Math.min(batchSize, metadata.parts - firstPart) },
      (_, index) => firstPart + index,
    );
    const batch = await Promise.all(
      partNumbers.map(async (partNumber) => {
        const query = new URLSearchParams({
          part: String(partNumber),
          token: metadata.token!,
        });
        const response = await fetch(
          `/api/course-content/${courseId}?${query.toString()}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("PDF transfer beech me ruk gaya. Dobara try karein.");
        }
        return response.arrayBuffer();
      }),
    );

    chunks.push(...batch);
    onProgress?.(Math.round((chunks.length / metadata.parts) * 100));
  }

  const fileUrl = URL.createObjectURL(
    new Blob(chunks, { type: "application/pdf" }),
  );
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = metadata.fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 10_000);
}
