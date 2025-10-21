// 커스텀 훅은 개념이 비슷한 것끼리

import { getReservationDashboard } from "@/lib/myactivities/api"

const useTestHook({scheduleId}) => {

    const {data} = getReservationDashboard()

    return [data,handleClick];
}

export default useTestHook