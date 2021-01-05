'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

class Pixelfed {
  /**
   * Constructor for the api
   * @param {string} domain The domain of the Pixelfed instance
   * @param {string} [accessToken] Your access token
   */
  constructor (domain, accessToken = null) {
    let tmp = domain.toLowerCase()
    if (tmp.indexOf('http://') !== 0 && tmp.indexOf('https://') !== 0) tmp = 'https://' + tmp
    if (tmp.substr(-1) !== '/') tmp = tmp + '/'
    this._domain = tmp
    this._headers = { 'Content-Type': 'application/json' }
    if (accessToken) this._headers.Authorization = `Bearer ${accessToken}`
  }

  /**
   * Generate domain with the endpoint
   * @private
   * @param {string} endpoint The endpoint you want to call
   * @returns {string}
   */
  _url (endpoint) {
    return this._domain + endpoint
  }

  /**
   * Do a GET request
   * @private
   * @param {string} url The url you want to do a GET request to
   */
  _get (url) {
    return fetch(url)
  }

  /**
   * Do a POST request
   * @private
   * @param {string} url The url you want to do a POST requrest to
   * @param {Object} [body] The requst body
   * @param {bool} [multiPart] Whether or not the body is multipart
   */
  _post (url, body = null, multiPart = false) {
    const props = {
      method: 'post',
      headers: this._headers
    }
    if (body) props.body = multiPart ? body : JSON.stringify(body)
    return fetch(url, props)
  }

  /**
   * Confirm that the app's OAuth2 credentials work
   * @returns {Object}
   */
  async user () {
    const response = await this._get(this._url('api/v1/accounts/verify_credentials'))
    return response.json()
  }

  /**
   * Get an account
   * @param {string} id The ID of the account you want to get
   * @returns {Object}
   */
  async accountById (id) {
    const response = await this._get(this._url(`api/v1/accounts/${id}`))
    return response.json()
  }

  /**
   * Get account followers
   * @param {string} id The ID of the account you want to get the followers of
   * @returns {Object}
   */
  async accountFollowersById (id) {
    const response = await this._get(this._url(`api/v1/accounts/${id}/followers`))
    return response.json()
  }

  /**
   * Get account following
   * @param {string} id The ID of the account you want to get the following of
   * @returns {Object}
   */
  async accountFollowingById (id) {
    const response = await this._get(this._url(`api/v1/accounts/${id}/following`))
    return response.json()
  }

  /**
   * Get account posts
   * @param {string} id The ID of the account you want to get the posts of
   * @returns {Object}
   */
  async accountStatusesById (id) {
    const response = await this._get(this._url(`api/v1/accounts/${id}/statuses`))
    return response.json()
  }

  /**
   * Get node info
   * @returns {Object}
   */
  async nodeinfo () {
    const response = await this._get(this._url('api/nodeinfo/2.0.json'))
    return response.json()
  }

  /**
   * Search query
   * @param {string} query The query you want to search
   * @returns {Object}
   */
  async accountSearch (query) {
    const response = await this._get(this._url(`api/v1/accounts/search?q=${query}`))
    return response.json()
  }

  /**
   * Get your blocks
   * @returns {Object}
   */
  async accountBlocks () {
    const response = await this._get(this._url('api/v1/blocks'))
    return response.json()
  }

  /**
   * Get your favourites
   * @returns {Object}
   */
  async accountLikes () {
    const response = await this._get(this._url('api/v1/favourites'))
    return response.json()
  }

  /**
   * Get your follow requests
   * @returns {Object}
   */
  async accountFollowRequests () {
    const response = await this._get(this._url('api/v1/follow_requests'))
    return response.json()
  }

  /**
   * Get the info about the instance
   * @returns {Object}
   */
  async instance () {
    const response = await this._get(this._url('api/v1/instance'))
    return response.json()
  }

  /**
   * Get your mutes
   * @returns {Object}
   */
  async accountMutes () {
    const response = await this._get(this._url('api/v1/mutes'))
    return response.json()
  }

  /**
   * Get your notifications
   * @returns {Object}
   */
  async accountNotifications () {
    const response = await this._get(this._url('api/v1/notifications'))
    return response.json()
  }

  /**
   * Get your timeline
   * @returns {Object}
   */
  async homeTimeline () {
    const response = await this._get(this._url('api/v1/timelines/home'))
    return response.json()
  }

  /**
   * Get the public timeline
   * @returns {Object}
   */
  async publicTimeline () {
    const response = await this._get(this._url('api/v1/timelines/public'))
    return response.json()
  }

  /**
   * Get a status
   * @param {string} id The ID of the status you want to get
   * @returns {Object}
   */
  async statusById (id) {
    const response = await this._get(this._url(`api/v1/statuses/${id}`))
    return response.json()
  }

  /**
   * Get who reblogged a status
   * @param {string} id The ID of the status you want to get the rebloggers of
   * @returns {Object}
   */
  async statusRebloggedById (id) {
    const response = await this._get(this._url(`api/v1/statuses/${id}/reblogged_by`))
    return response.json()
  }

  /**
   * Get who favoureted a status
   * @param {string} id The ID of the status you want to get the favourites of
   * @returns {Object}
   */
  async statusLikedById (id) {
    const response = await this._get(this._url(`api/v1/statuses/${id}/favourited_by`))
    return response.json()
  }

  /**
   * Follow an account
   * @param {string} id The ID of the account you want to follow
   * @returns {Object}
   */
  async followAccountById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/follow`))
    return response.json()
  }

  /**
   * Unfollow an account
   * @param {string} id The ID of the account you want to unfollow
   * @returns {Object}
   */
  async unfollowAccountById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/unfollow`))
    return response.json()
  }

  /**
   * Block an account
   * @param {string} id The ID of the account you want to block
   * @returns {Object}
   */
  async accountBlockById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/block`))
    return response.json()
  }

  /**
   * Unblock an account
   * @param {string} id The ID of the account you want to unblock
   * @returns {Object}
   */
  async accountUnblockById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/unblock`))
    return response.json()
  }

  /**
   * Favourite a status
   * @param {string} id The ID of the status you want to favourite
   * @returns {Object}
   */
  async statusFavouriteById (id) {
    const response = await this._post(this._url(`api/v1/statuses/${id}/favourite`))
    return response.json()
  }

  /**
   * Unfavourite a status
   * @param {string} id The ID of the status you want to unfavourite
   * @returns {Object}
   */
  async statusUnfavouriteById (id) {
    const response = await this._post(this._url(`api/v1/statuses/${id}/unfavourite`))
    return response.json()
  }

  /**
   * Upload a status
   * @param {string} file The location of the file you want to upload
   * @returns {Object}
   */
  async mediaUpload (file) {
    const body = new FormData()
    const content = fs.readFileSync(file, { encoding: 'utf8' })
    body.append('name', file)
    body.append('contents', content)
    body.append('filename', 'tmp.jpg')
    const response = await this._post(this._url('api/v1/media'), body, true)
    return response.json()
  }

  /**
   * Mute an account
   * @param {string} id The ID of the account you want to mute
   * @returns {Object}
   */
  async accountMuteById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/unmute`))
    return response.json()
  }

  /**
   * Unmute an account
   * @param {string} id The ID of the account you want to unmute
   * @returns {Object}
   */
  async accountUnmuteById (id) {
    const response = await this._post(this._url(`api/v1/accounts/${id}/unmute`))
    return response.json()
  }

  /**
   *
   * @param {Array<number>} mediaIds An array of media ids
   * @param {string} [caption] The caption
   * @param {bool} [sensitive] Whether or not it's sensitive
   * @param {string} [scope] Must be private, unlisted or public
   * @param {number} [inReplyToId] The ID it replies to
   */
  async statusCreate (mediaIds, caption = null, sensitive = false, scope = 'public', inReplyToId = null) {
    if (!mediaIds.some(isNaN) && mediaIds.length !== 0) throw new Error('Invalid media_ids. Must be an array of integers.')
    if (!['private', 'unlisted', 'public'].includes(scope)) throw new Error('Invalid scope. Must be private, unlisted or public.')
    const props = {
      media_ids: mediaIds,
      status: caption,
      in_reply_to_id: inReplyToId,
      sensitive: sensitive,
      visibility: scope
    }
    const response = await this._post(this._url('api/v1/statuses'), props)
    return response.json()
  }
}

module.exports = Pixelfed
