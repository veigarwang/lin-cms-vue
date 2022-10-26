import { post, get, put, _delete } from "@/lin/plugin/axios";

class Channel {
    async addChannel(params) {
        const res = await post("api/blog/channels", params);
        return res;
    }

    async getChannel(id) {
        const res = await get(`api/blog/channels/${id}`);
        return res;
    }

    async editChannel(id, data) {
        const res = await put(`api/blog/channels/${id}`, data);
        return res;
    }

    async deleteChannel(id) {
        const res = await _delete(`api/blog/channels/${id}`);
        return res;
    }

    async getChannels(params) {
        const res = await get("api/blog/channels", params);
        return res;
    }
}

export default new Channel();
