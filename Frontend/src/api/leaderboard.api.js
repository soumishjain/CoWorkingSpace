import axios from "./axios";

export const fetchLeaderboard = (workspaceId, departmentId) => {
  return axios.get(
    `/leaderboard/department-leaderboard/${workspaceId}/${departmentId}`,
    { withCredentials: true }
  );
};

export const fetchTop3 = (workspaceId, departmentId) => {
  return axios.get(
    `/leaderboard/top-3/${workspaceId}/${departmentId}`,
    { withCredentials: true }
  );
};

export const fetchMyRank = (workspaceId, departmentId) => {
  return axios.get(
    `/leaderboard/my-rank/${workspaceId}/${departmentId}`,
    { withCredentials: true }
  );
};

export const fetchPrevWinner = (workspaceId , departmentId) => {
    return axios.get(`/leaderboard/previous-winner/${workspaceId}/${departmentId}`,
        {withCredentials : true}

    )
}