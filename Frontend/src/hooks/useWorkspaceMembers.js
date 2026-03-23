import { useEffect, useState } from "react";
import { fetchWorkspaceMembers } from "../api/workspace.api";

export const useWorkspaceMembers = (workspaceId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);

        const res = await fetchWorkspaceMembers(workspaceId);

        setMembers(res.data.members); // 👈 backend response
        console.log(res.data.members)
      } catch (err) {
        console.error("Members fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      loadMembers();
    }
  }, [workspaceId]);

  return { members, loading };
};