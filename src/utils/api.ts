import axios from "axios";

const api = axios.create({
  //   baseURL: `http://localhost:5000/api`,
  baseURL: `https://wowme.gg/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  delete api.defaults.headers.common["x-auth-token"];

  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
  }
};

export const getSpecList = async (class_name) => {
  try {
    const response = await api.get(`/get_spec_list`, {
      params: { class: class_name },
    });
    if (response.data.status === "success") {
      return response.data.specList;
    }
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const getDungeonList = async (min: number, max: number) => {
  try {
    const response = await api.get(`/get_dungeon_list`, {
      params: { min: min, max: max },
    });
    if (response.data.status === "success") {
      return response.data.dungeonList;
    }
  } catch (e) {
    console.log(e);
  }

  return [];
};

export const getRaidList = async () => {
  try {
    const response = await api.get(`/get_raid_list`);
    if (response.data.status === "success") {
      return response.data.raidList;
    }
  } catch (e) {
    console.log(e);
  }

  return [];
};

export const getRaidBossList = async (raid) => {
  try {
    const response = await api.get(`/get_raid_boss_list`, {
      params: { raid: raid },
    });
    if (response.data.status === "success") {
      return response.data.raidBossList;
    }
  } catch (e) {
    console.log(e);
  }

  return [];
};

export interface TalentInfoResponse {
  talentTableInfo: any[];
  logCount: number;
}

export const getTalentTableInfo = async (
  params
): Promise<TalentInfoResponse> => {
  try {
    const response = await api.get(`/get_talent_table_info`, {
      params: params,
    });
    if (response.data.status === "success") {
      return {
        talentTableInfo: response.data.famousTalentInfo,
        logCount: response.data.logCount,
      };
    }
  } catch (e) {
    console.log(e);
  }

  return {
    talentTableInfo: [],
    logCount: 0,
  };
};

export const getToken = async (params) => {
  try {
    const res = await api.post("/auth/bnet_token", params);
    if (res.data.success) {
      console.log(res.data);
      setAuthToken(res.data.token);
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export const getCharacters = async () => {
  try {
    const res = await api.post("/get_characters");
    if (res.data.success) {
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export const getJournals = async (battleId) => {
  try {
    const res = await api.get(`/journals?battleId=${battleId}`);
    // console.log(res);
    if (res.data.success) {
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};


export const storeJournals = async (data) => {
  try {
    const res = await api.post("/journals", data);
    if (res.data.success) {
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};


export const updateJournals = async (journelID, data) => {
  try {
    const res = await api.put(`/journals/${journelID}`, data);
    if (res.data.success) {
      // console.log("edited call from api");
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export const storeJournalContent = async (id, data) => {
  try {
    const res = await api.post(`/journals/${id}/content`, data);
    if (res.data.success) {
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};


export const deleteJournalContent = async (journelID, contentID) => {
  try {
    const res = await api.delete(`/journals/${journelID}/content/${contentID}`);
    console.log(res)
    if (res.data.success) {
      console.log(res.data)
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};


export const editJournalContent = async (journelID, contentID, data) => {
  try {
    const res = await api.put(`/journals/${journelID}/content/${contentID}`, data);
    console.log(res)
    if (res.data.success) {
      console.log(res.data)
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export const deleteJournal = async (journelID) => {
  try {
    const res = await api.delete(`/journals/${journelID}`);
    console.log(res)
    if (res.data.success) {
      console.log(res.data)
      return res.data;
    } else {
      console.log(res.data);
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};
