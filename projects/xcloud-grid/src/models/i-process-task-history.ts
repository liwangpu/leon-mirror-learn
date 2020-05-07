export interface IProcessTaskHistory {
    // 流程步骤状态
    key: string;
    // 操作行为
    title?: string;
    // Owner
    owner?: string;
    // 执行人
    assignee?: string;
    // 任务开始时间
    startTime?: string;
    // 任务结束时间
    endTime?: string;
}
