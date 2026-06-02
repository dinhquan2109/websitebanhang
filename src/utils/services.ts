type ApiErrorBody = {
  status?: boolean;
  error?: string;
};

// function to post data
export async function postData<T extends ApiErrorBody = ApiErrorBody>(
  url = "",
  data: Record<string, unknown> = {},
): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = {};
    }

    if (!response.ok) {
      return {
        status: false,
        error:
          body.error ||
          `Máy chủ trả lỗi ${response.status}. Kiểm tra cấu hình Supabase (.env.local).`,
      } as T;
    }

    return body as T;
  } catch {
    return {
      status: false,
      error:
        "Không kết nối được API. Chạy yarn dev và kiểm tra SUPABASE_URL / SUPABASE_ANON_KEY.",
    } as T;
  }
}
