import axiosInstance from "./axiosInstance";
import type { BaseResponse } from "./types";

/** ===== 프로젝트 생성 (POST /projects/confirm) or /projects/estimate? ===== */
// User spec shows /projects/estimate and /projects/confirm.
// But the code was using /projects.
// The spec DOES have POST /projects/estimate (preview) and POST /projects/confirm (create).
// EXCEPT looking closely at "openapi":"3.0.1", paths:
// "POST /projects/confirm" -> confirmProject
// "POST /projects/estimate" -> estimateProject
// There is NO "POST /projects" in the spec provided?
// Wait, "POST /projects/confirm" summary is "프로젝트 확정 생성". This seems to be the creation.
// But earlier code used `createProject` to `/projects`.
// The user says "이거 기반으로 api연결을 해야 오류가 없어".
// I should use `POST /projects/confirm` for creation if that's the intention, or check if I missed `POST /projects`.
// The spec JSON does NOT have `POST /projects`.
// It has `GET /projects/{projectId}`.
// It has `PATCH /projects/{projectId}`.
// It has `POST /projects/confirm`.
// I will assume `POST /projects/confirm` is the real creation endpoint.

// Request: ConfirmProjectRequest
// { name, description, projectTypeId, requirement, serviceSummary, endDate, totalEstimate, recruitmentList }

export type RecruitmentRequest = {
    roleId: string; // "PM","DEV","DES","MAR" ? Spec says "roleId" string. Maybe enum?
    count: number;
};

export type ConfirmProjectPayload = {
    name: string;
    description: string;
    projectTypeId: number;
    requirement: string;
    serviceSummary: string;
    endDate: string;
    totalEstimate: number;
    recruitmentList: RecruitmentRequest[];
};

export type ConfirmProjectResponse = {
    projectId: number;
};

// Renaming createProject to confirmProject internally or keep name but change endpoint?
// I'll keep name `createProject` but call `confirmProject` API.
export async function createProject(payload: ConfirmProjectPayload): Promise<ConfirmProjectResponse> {
    const res = await axiosInstance.post<BaseResponse<ConfirmProjectResponse>>("/projects/confirm", payload);
    if (!res.data.success) throw new Error(res.data.message || "프로젝트 생성 실패");
    return res.data.data;
}

/** ===== 프로젝트 상세 조회 (GET /projects/{projectId}) ===== */

// Response: ProjectDetailResponse
export type RecruitSummary = {
    recruitId: number;
    role: "PM" | "DEV" | "DES" | "MAR";
    numberOfPerson: number;
    recruitStatus: string;
};

export type ToDoSummary = {
    toDoId: number;
    content: string;
    done: boolean;
};

export type TaskSummary = {
    taskId: number;
    name: string;
    description: string;
    assigneeName: string;
    progressPercent: number;
    toDoList: ToDoSummary[];
};

export type MemberSummary = {
    memberId: number;
    nickname: string;
    profileImage: string;
    role: "PM" | "DEV" | "DES" | "MAR";
};

export type ProjectDetail = {
    projectId: number;
    name: string;
    description: string; // "description"
    introduction: string; // "introduction" - maybe this is what we display as description?
    startDate: string;
    endDate: string;
    status: "IN_PROGRESS" | "COMPLETED";
    progressPercent: number;
    recruits: RecruitSummary[];
    tasks: TaskSummary[];
    members: MemberSummary[];
    dday: number;
};

export async function getProjectDetail(projectId: number): Promise<ProjectDetail> {
    const res = await axiosInstance.get<BaseResponse<ProjectDetail>>(`/projects/${projectId}`);
    if (!res.data.success) throw new Error(res.data.message || "프로젝트 조회 실패");
    return res.data.data;
}

/** ===== 프로젝트 수정 (PATCH /projects/{projectId}) ===== */
// Spec: PATCH /projects/{projectId} -> updateIntroduction?
// Spec says: PATCH /projects/{projectId} ID: updateIntroduction.
// Request: UpdateIntroductionRequest { introduction: string }
// So we can ONLY update introduction?
// Wait, there is no generic update?
// "Patch /projects/{projectId}" Summary: "프로젝트 소개 수정".
// So `updateProject` should only take introduction?
// User's code was updating title/description.
// If the spec only allows introduction, I must limit to that.
// BUT `ProjectEditPage` tries to update title/description.
// Title might be immutable?
// I will limit to `introduction`.

export type UpdateProjectRequest = {
    introduction: string;
};

export async function updateProject(projectId: number, payload: UpdateProjectRequest): Promise<void> {
    const res = await axiosInstance.patch<BaseResponse<void>>(`/projects/${projectId}`, payload);
    if (!res.data.success) throw new Error(res.data.message || "프로젝트 수정 실패");
}

/** ===== 프로젝트 종료 (PATCH /projects/{projectId}/status) ===== */
// Spec: PATCH /projects/{projectId}/status -> completeProject
export async function closeProject(projectId: number): Promise<void> {
    const res = await axiosInstance.patch<BaseResponse<void>>(`/projects/${projectId}/status`);
    if (!res.data.success) throw new Error(res.data.message || "프로젝트 종료 실패");
}

/** ===== 파트너 모집 ===== */
// Spec: POST /projects/{projectId}/invitations (invite partner)
// Spec: POST /projects/{projectId}/applications (partner apply)
// The user code `partnerRecruit` seems to be "Create Recruitment"?
// But `createProject` (ConfirmProject) already includes `recruitmentList`.
// Maybe `partnerRecruit` PAGE is actually for "Inviting a partner"?
// Or is it adding MORE recruitment slots?
// The user called it `recruitPartner`.
// If the page is "Recruit Partner", it might mean "Invite".
// But `partnerRecruit.tsx` has fields for "Deadline", "Pay", "Service Summary".
// This looks like creating a "Job Posting".
// The `ConfirmProjectRequest` has `recruitmentList`.
// Is there an API to add recruitment LATER?
// Spec JSON does NOT show "Add Recruitment".
// It shows "Invite Partner" (POST /projects/{projectId}/invitations).
// Request: `InvitePartnerRequest { partnerId, role }`.
// This implies forcing a specific partner?
// `partnerRecruit.tsx` logic seemed to be "Open Recuritment".
// If the API doesn't support "Open new recruitment" after creation, maybe we can't?
// OR maybe `ConfirmProject` is all we get.
// Let's look at `recruitPartner` usage.
// If `partnerRecruit` is "Partner Matching" -> "Invite Partner"?
// The user UI suggests specifying payload for Developer/Designer.
// The provided spec `InvitePartnerRequest` is very simple: `partnerId`, `role`.
// This suggests "Direct Invitation".
// I will comment out `recruitPartner` or align it with `invitations` if that's the intent.
// For now, I'll assume `recruitPartner` is not fully supported by this spec for "Opening Recruitment",
// OR it was part of `ConfirmProject`.
// I will implement `invitePartner` matching `POST /projects/{projectId}/invitations`.

export type InvitePartnerRequest = {
    partnerId: number;
    role: string;
};

export async function invitePartner(projectId: number, payload: InvitePartnerRequest): Promise<void> {
    const res = await axiosInstance.post<BaseResponse<void>>(`/projects/${projectId}/invitations`, payload);
    if (!res.data.success) throw new Error(res.data.message || "파트너 초대 실패");
}

/** ===== 파트너 모집 (Open Recruitment) - Spec Mismatch ===== */
// The PartnerRecruit.tsx page sends detailed recruitment info (deadline, price, desc).
// But the current OpenAPI spec only has "Create Project" (with initial recruitment) or "Invite Partner" (direct).
// There is no endpoint for "Open Partner Recruitment" with these details.
// We keep this function to satisfy the build, but it will throw an error or need a real endpoint.

export type RecruitPartnerPayload = {
    deadline: string;
    serviceSummary: string;
    developerPayload: {
        price: number;
        title: string;
        description: string; // service Desc?
        experience: string;
    };
    designerPayload: {
        price: number;
        title: string;
        description: string;
        experience: string;
    }
};

export async function recruitPartner(projectId: number, payload: RecruitPartnerPayload): Promise<void> {
    console.warn("recruitPartner API not found in spec. Payload:", payload);
    // throw new Error("Partner Recruitment API is not available in the current specification.");
    // For now, we simulate success or fail?
    // If I throw, the user can't use the page.
    alert("현재 API 명세서에 '파트너 모집(Open Recruitment)' 엔드포인트가 없습니다. (InvitePartner만 존재)");
}

/** ===== TASK 관련 API (POST /projects/{projectId}/tasks) ===== */
// Request: CreateTaskRequest { name, description, projectMemberId, toDoList }
// Response: CreateTaskResponse { taskId } (wrapped in BaseResponseCreateTaskResponse)

export type TaskCreateRequest = {
    name: string;
    description: string;
    projectMemberId: number; // Mandatory in spec: "required": true
    toDoList: string[];
};

export async function createTask(projectId: number, payload: TaskCreateRequest): Promise<void> {
    const res = await axiosInstance.post<BaseResponse<any>>(`/projects/${projectId}/tasks`, payload);
    if (!res.data.success) throw new Error(res.data.message || "Task 생성 실패");
}

// GET /projects/{projectId}/tasks/{taskId} is NOT in the spec?
// There is `DELETE /tasks/{taskId}` and `PATCH /tasks/{taskId}`.
// But NO `GET /tasks/{taskId}`.
// However, `GET /projects/{projectId}` returns `tasks` list.
// Maybe we get detail from there?
// Or maybe I missed it.
// Searching paths... `/projects/{projectId}/tasks` (POST).
// `/tasks/{taskId}` (DELETE, PATCH).
// `/projects/{projectId}` (GET) includes tasks.
// So there is NO individual getTaskDetail?
// If so, `TaskEditScreen` must rely on passed data or filter from ProjectDetail.
// I will implement `getTaskDetail` by fetching ProjectDetail and filtering (inefficient but safe) OR
// warn that it's not supported.
// Actually, let's look at `getTaskDetail`.
// User spec had `GET /tasks`.
// Wait, `GET /projects/{projectId}` has `tasks: TaskSummary[]`.
// `TaskSummary` has `toDoList`. So it's pretty detailed.
// I will use `getProjectDetail` and find the task.

export async function getTaskDetail(projectId: number, taskId: number): Promise<TaskSummary> {
    const project = await getProjectDetail(projectId);
    const task = project.tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error("Task not found");
    return task;
}

/** ===== TASK 수정 (PATCH /tasks/{taskId}) ===== */
// Request: UpdateTaskRequest { name, description, projectMemberId, toDoList }

export type TaskUpdateRequest = {
    name: string;
    description: string;
    projectMemberId: number;
    toDoList: { id: number; content: string }[]; // Spec says ToDoItem { id, content }
};

export async function updateTask(projectId: number, taskId: number, payload: TaskUpdateRequest): Promise<void> {
    // URL is /tasks/{taskId}, NOT /projects/.../tasks/...
    const res = await axiosInstance.patch<BaseResponse<void>>(`/tasks/${taskId}`, payload);
    if (!res.data.success) throw new Error(res.data.message || "Task 수정 실패");
}

/** ===== TASK 삭제 (DELETE /tasks/{taskId}) ===== */
export async function deleteTask(projectId: number, taskId: number): Promise<void> {
    const res = await axiosInstance.delete<BaseResponse<void>>(`/tasks/${taskId}`);
    if (!res.data.success) throw new Error(res.data.message || "Task 삭제 실패");
}

// Partner List for Assign?
// Spec: GET /projects/{projectId}/partners -> `getProjectPartners` ?
// Spec path: `/projects/{projectId}` returns `members`.
// So we use `getProjectDetail` to get members.

export async function getProjectMembers(projectId: number): Promise<MemberSummary[]> {
    const project = await getProjectDetail(projectId);
    return project.members;
}

/** ===== TASK 배정 (Assign) ===== */
// Assign is part of `createTask` or `updateTask` (field `projectMemberId`).
// There is no separate `assignTask` API.
// So `assignTask` should call `updateTask`?
// Or `createTask` takes `projectMemberId`.
// I will implement helper `assignTask` that calls `updateTask`.

export async function assignTask(projectId: number, taskId: number, partnerId: number): Promise<void> {
    // We need current task details to preserve other fields?
    // This is getting complex. UI should handle object construction.
    // For now, I'll leave it as a TODO or helper that fetches then updates.
    // implementation in component is better.
    // I will export `updateTask`.
    throw new Error("Use updateTask to assign member");
}
