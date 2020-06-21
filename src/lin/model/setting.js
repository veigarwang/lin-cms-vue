import { post, get, put, _delete } from "@/lin/plugin/axios";

class Setting {
    async addSetting(params) {
        const res = await post("cms/settings", params);
        return res;
    }

    async editSetting(id, params) {
        const res = await put(`cms/settings/${id}`, params);
        return res;
    }

    async getSetting(id) {
        const res = await get(`cms/settings/${id}`);
        return res;
    }

    async deleteSetting(id) {
        const res = await _delete(`cms/settings/${id}`);
        return res;
    }

    async getSettings(params) {
        const res = await get("cms/settings", params);
        return res;
    }
}

export default new Setting();
