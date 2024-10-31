export enum QUERY_KEYS {
    // super admin keys
    GET_SUPER_ADMIN_BY_ID = "getSuperAdminById",
    GET_ADMINS = "getSuperAdminById",
    GET_DEMO_DEPARTMENTS = "getDemoDepartments",
    GET_ADMIN_WITHIN = "getAdminsWithin",
    GET_ADMIN_ADMINID = "getAdminByAdminId",
    GET_DEPARTMENT_ID = "getDepartmentById",
    GET_ALL_ADMIN_USERS = "getAllAdminUsers",
    
    // admin keys
    GET_ALL_ADMIN_DATA = "getAllAdminDataForSuperAdmin",
    GET_REGIONS_ADMINID = "getAllRegionsByAdminId",
    GET_REGION_ID = "getRegionById",
    GET_AREAS_REGIONID = "getAreasByRegionId",
    GET_AREA_ID = "getAreaById",
    GET_ALL_STAFF = "getAllStaffByAdminId",
    GET_STAFF = "getStaffByStaffId",
    GET_ALL_DEPARTMENTS = "getAllDepartmentsByAdminId",
    GET_DEPARTMENT_BY_ID = "getDepartmentById",
    GET_DEPARTMENT_REGION = "getDepartmentRegion",
    GET_STAFFS_REGION_AREA = "getStaffsAreaAndRegion",
    GET_DEPARTMENT_STAFFS = "getDepartmentStaffs",
    GET_REGION_STAFFS = "getRegionStaffs",
    GET_AREA_STAFFS = "getAreaStaffs",
    GET_ALL_SKILLS = "getAllSkills",
    GET_AVAILABLE_STAFFS = "getAllAvailableStaffs",
    GET_REGIONAL_STAFFS = "getAllRegionalStaffs",

    // user keys
    GET_USER_BY_ID = "getUserByUserid",
    GET_TASK_BY_ID = "getTaskByTaskid",
    GET_ALL_TASKS = "getAllTasks",
    GET_COMMENTS_BY_TASKID = "getCommentByTaskId",
    GET_CHOOSE_STAFFS = "getChooseStaffs",
    GET_ALL_NOTIFICATIONS = "getNotificationsByUserId",
    GET_USER_ROLE="getUserRoleById",
    GET_DEPARTMENTS_BY_HEADID = "getDepartmentsByHeadId",
    GET_HEAD_INFO = "getHeadByUserId",
    GET_STAFFS_UNDER_USERID = "getStaffsUnderUserId",
    GET_SELECTABLE_REGIONAL_HEAD = "getSelectableReginalHead",
    GET_SELECTABLE_AREA_HEAD = "getSelectableAreaHead",
    GET_DEPARTMENT_BY_USERID = "getDepartmentByUserId",
    GET_SKILLWISE_USERS = "getSkillWiseUsers",

    // project keys
    GET_ALL_PROJECTS = "getAllProjects",
    GET_PROJECT_BY_ID = "getProjectById",
    GET_PROJECT_DOCS = "getProjectsDocsByProjectid",
    GET_PROJECT_FLOWS = "getProjectFlowsByProjectId",
    GET_PROJECT_COMMENTS = "getProjectCommentsByProjectId",

    // Analytics
    GET_PROJECTS_ANALYTICS = "getProjectsAnalytics",
    GET_TASKS_ANALYTICS = "getAllTaskAnalytics",
    GET_PROJECT_COMPLETED_PENDING_CHART = "getProjectCompletedAndPendingChart",
    GET_TASKS_ANALYTICS_PI_CHART = "getTaskAnalyticsPiChart",
    GET_PROJECT_STATISTICS = "getProjectStatisticsByUserid",

    // Client keys
    GET_ALL_CLIENTS = "getAllClientsByUserId",
    GET_CLIENT_BY_ID = "getClientByUserId",

    // Task keys
    GET_PROJECT_TASKS = "getProjectTasks",
    GET_TASK_FORWARDABLE = "getTaskForwardables",
}