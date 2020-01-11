import { post, get, put, _delete } from "@/lin/plugins/axios";

class Setting {
    async addSetting(params) {
        const res = await post("cms/setting", params);
        return res;
    }

    async editSetting(id, params) {
        const res = await put(`cms/setting/${id}`, params);
        return res;
    }

    async getSetting(id) {
        const res = await get(`cms/setting/${id}`);
        return res;
    }

    async deleteSetting(id) {
        const res = await _delete(`cms/setting/${id}`);
        return res;
    }

    async getSettings(params) {
        const res = await get("cms/setting", params);
        return res;
    }
}

export default new Setting();
