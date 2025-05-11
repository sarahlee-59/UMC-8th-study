import axios from "axios";

export const getMyInfo = async () => {
  const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, "");
  console.log("토큰:", token);


  const res = await axios.get("http://localhost:8000/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ 필수!
    },
  });

  return res.data.data;
};
