import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// ─── API Configuration ────────────────────────────────────────────────────────

const BASE_URL = process.env.API_BASE_URL ?? "https://api.eduflow.sa/v1";
const TIMEOUT = 10000;

// ─── Offline Queue ────────────────────────────────────────────────────────────

interface OfflineAction {
  id:        string;
  endpoint:  string;
  method:    string;
  body:      unknown;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = "eduflow_offline_queue";

async function addToOfflineQueue(action: Omit<OfflineAction, "id" | "timestamp">) {
  const queue = await getOfflineQueue();
  queue.push({
    ...action,
    id: Date.now().toString(),
    timestamp: Date.now(),
  });
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

async function getOfflineQueue(): Promise<OfflineAction[]> {
  const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function processOfflineQueue(): Promise<void> {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) return;

  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

  const processed: string[] = [];

  for (const action of queue) {
    try {
      await apiRequest(action.endpoint, {
        method: action.method,
        body: JSON.stringify(action.body),
      });
      processed.push(action.id);
    } catch (error) {
      console.warn(`Failed to sync action ${action.id}:`, error);
    }
  }

  const remaining = queue.filter(a => !processed.includes(a.id));
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));

  console.log(`Synced ${processed.length} offline actions, ${remaining.length} remaining`);
}

// ─── Base Request ─────────────────────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await AsyncStorage.getItem("auth_token");
  const schoolId = await AsyncStorage.getItem("school_id");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token    ? { "Authorization": `Bearer ${token}` }    : {}),
    ...(schoolId ? { "x-school-id": schoolId }               : {}),
    ...((options.headers ?? {}) as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        error.message ?? "خطأ في الاتصال بالخادم",
        response.status,
        error.code
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof APIError) throw error;
    if ((error as Error).name === "AbortError") {
      throw new APIError("انتهت مهلة الاتصال", 408, "TIMEOUT");
    }
    throw new APIError("فشل الاتصال بالخادم", 0, "NETWORK_ERROR");
  }
}

// ─── API Error ────────────────────────────────────────────────────────────────

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (email: string, password: string) => {
    const result = await apiRequest<{ token: string; teacher: unknown; schoolId: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await AsyncStorage.setItem("auth_token", result.token);
    await AsyncStorage.setItem("school_id", result.schoolId);
    return result;
  },

  logout: async () => {
    await apiRequest("/auth/logout", { method: "POST" });
    await AsyncStorage.multiRemove(["auth_token", "school_id"]);
  },

  getTeacherProfile: () => apiRequest<unknown>("/teachers/me"),
};

// ─── Attendance API ───────────────────────────────────────────────────────────

export const attendanceAPI = {
  getClassAttendance: (classId: string, date: string) =>
    apiRequest<unknown>(`/attendance?classId=${classId}&date=${date}`),

  submitAttendance: async (data: {
    classId: string;
    date:    string;
    records: Array<{ studentId: string; status: string; minutesLate?: number; note?: string }>;
  }) => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      // Save offline
      await addToOfflineQueue({
        endpoint: "/attendance",
        method: "POST",
        body: data,
      });

      // Cache locally
      await AsyncStorage.setItem(
        `attendance_${data.classId}_${data.date}`,
        JSON.stringify({ ...data, syncStatus: "pending" })
      );

      return { offline: true, message: "تم الحفظ محليًا وسيتم المزامنة عند توفر الاتصال" };
    }

    return apiRequest<unknown>("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  syncOffline: processOfflineQueue,
};

// ─── Grades API ───────────────────────────────────────────────────────────────

export const gradesAPI = {
  getClassGrades: (classId: string, subjectId: string, term: number) =>
    apiRequest<unknown>(`/grades?classId=${classId}&subjectId=${subjectId}&term=${term}`),

  submitGrades: async (data: {
    classId:   string;
    subjectId: string;
    type:      string;
    term:      number;
    maxScore:  number;
    entries:   Array<{ studentId: string; score: number; notes?: string }>;
  }) => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      await addToOfflineQueue({ endpoint: "/grades", method: "POST", body: data });
      return { offline: true, message: "تم الحفظ محليًا" };
    }

    return apiRequest<unknown>("/grades", { method: "POST", body: JSON.stringify(data) });
  },
};

// ─── Students API ─────────────────────────────────────────────────────────────

export const studentsAPI = {
  getClassStudents: async (classId: string) => {
    const cacheKey = `students_${classId}`;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
      throw new APIError("لا يوجد اتصال بالإنترنت وليس هناك بيانات محفوظة", 0, "NO_CACHE");
    }

    const result = await apiRequest<unknown>(`/students?classId=${classId}&limit=100`);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  },

  getStudentProfile: (studentId: string) =>
    apiRequest<unknown>(`/students/${studentId}`),
};

// ─── AI API ───────────────────────────────────────────────────────────────────

export const aiAPI = {
  sendMessage: (message: string, context?: unknown) =>
    apiRequest<{ data: { content: string } }>("/ai", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),

  getInsights: () => apiRequest<unknown>("/ai"),
};
