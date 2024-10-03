

export const Attendance = {
    TYPE_ADDITIONAL_DAY : "Additional Day",
    TYPE_WORKING_DAY :  "Working Day",
    TYPE_ABSENT :  "Absent",
    TYPE_COMPENSATION_DAY : "Compensation Day" ,
    TYPE_LEAVE : "Leave",
    TYPE_NON_WORKING_DAY :"Non-Working Day" ,
    ADDITIONAL_DAY:1,
     ADDITIONAL_SHIFT: 2,
     ADDITIONAL_LEAVE: 3,
     LEAVE: 4,
     WORKING_DAY: 5,


}
const typeOptions = [
    {
      value: Attendance.TYPE_ABSENT,
      label: Attendance.TYPE_ABSENT,
    },
    {
      value: Attendance.TYPE_ADDITIONAL_DAY,
      label: Attendance.TYPE_ADDITIONAL_DAY,
    },
    {
      value: Attendance.TYPE_COMPENSATION_DAY,
      label: Attendance.TYPE_COMPENSATION_DAY,
    },
    {
      value: Attendance.TYPE_LEAVE,
      label: Attendance.TYPE_LEAVE,
    },

    {
      value: Attendance.TYPE_NON_WORKING_DAY,
      label: Attendance.TYPE_NON_WORKING_DAY,
    },
    {
      value: Attendance.TYPE_WORKING_DAY,
      label: Attendance.TYPE_WORKING_DAY,
    },
  ];
  export default typeOptions