import { FormValues } from '@/lib/schema';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function simulateBackendResponse(
  data: FormValues
): Promise<{ success: boolean; data?: FormValues; error?: string }> {
  await delay(1500);

  if (Math.random() < 0.2) {
    throw new Error('Interval Server Error: Server sedang mengalami beban tinggi');
  }

  return { success: true, data };
}
