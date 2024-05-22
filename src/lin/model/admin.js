/* eslint-disable class-methods-use-this */
import { post, get, put, _delete } from '@/lin/plugin/axios'

export default class Admin {

  static getAllPermissions() {
    return get('cms/admin/permission')
  }

  static getTreePermissionsList() {
    return get('cms/admin/permission/tree-list')
  }

  static async getAdminUsers({ group_id,
    count = this.uCount,
    page = this.uPage,
    nickname,
    username,
    email
  }) {
    let res = await get('cms/admin/users', {
      count,
      page,
      group_id,
      nickname,
      username,
      email
    })
    return res
  }

  async nextGroupsPage() {
    await this.increaseGPage()
    return this.getGroupsWithPermissions({})
  }

  async preGroupsPage() {
    await this.decreaseGPage()
    return this.getGroupsWithPermissions({})
  }

  static async getGroups(query) {
    const groups = await get('cms/admin/group', query)
    return groups
  }

  static async getOneGroup(id) {
    const group = await get(`cms/admin/group/${id}`)
    return group
  }

  static async createOneGroup(name, info, permission_ids) {
    const res = await post('cms/admin/group', {
      name,
      info,
      permission_ids,
    })
    return res
  }

  static async updateOneGroup(data, id) {
    const res = await put(`cms/admin/group/${id}`, data)
    return res
  }

  static async deleteOneGroup(id) {
    const res = await _delete(`cms/admin/group/${id}`)
    return res
  }

  static async getOneUser(id) {
    const res = await get(`cms/admin/user/${id}`)
    return res
  }

  static async deleteOneUser(id) {
    const res = await _delete(`cms/admin/user/${id}`)
    return res
  }

  static async updateOneUser(id, user) {
    const res = await put(`cms/admin/user/${id}`, user)
    return res
  }

  static async dispatchPermissions(group_id, permission_ids) {
    const res = await post('cms/admin/permission/dispatch/batch', {
      group_id,
      permission_ids,
    })
    return res
  }

  static async changePassword(new_password, confirm_password, id) {
    const res = await put(`cms/admin/user/${id}/password`, {
      new_password,
      confirm_password,
    })
    return res
  }

  static async removePermissions(group_id, permission_ids) {
    const res = await post('cms/admin/permission/remove', {
      group_id,
      permission_ids,
    })
    return res
  }
}
