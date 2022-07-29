import { fetch, File, FormData } from 'node-fetch-native'

export default class Pixelfed {
  /**
   * Constructor for the api
   * @param {string} domain The domain of the Pixelfed instance
   * @param {string} [accessToken] Your access token
   */
  constructor(domain, accessToken = null) {
    let tmp = domain.toLowerCase()
    if (tmp.indexOf('http://') !== 0 && tmp.indexOf('https://') !== 0) {
      tmp = 'https://' + tmp
    }
    if (tmp.slice(-1) !== '/') tmp = tmp + '/'
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
  _url(endpoint = "") {
    return this._domain + endpoint
  }

  /**
   * Do a GET request
   * @private
   * @param {string} url The url you want to do a GET request to
   */
  _get(url) {
    return fetch(url, { method: 'get', headers: this._headers })
  }

  /**
   * Do a POST request
   * @private
   * @param {string} url The url you want to do a POST requrest to
   * @param {Object | FormData} [body] The requst body
   * @param {bool} [multiPart] Whether or not the body is multipart
   */
  _post(url, body = null, multiPart = false) {
    const props = {
      method: 'post',
      headers: this._headers
    }
    if (body) {
      if (multiPart) {
        delete props.headers['Content-Type'] // Fetch sets boundary
        props.body = body
      } else {
        props.body = JSON.stringify(body)
      }
    }
    return fetch(url, props)
  }

  /**
   * Confirm that the app's OAuth2 credentials work
   * @returns {Promise<object>} The response object
   */
  user() {
    const response = this._get(
      this._url('api/v1/accounts/verify_credentials')
    )
    return response
  }

  /**
   * Get an account
   * @param {string} id The ID of the account you want to get
   * @returns {Promise<object>} The response object
   */
  accountById(id) {
    const response = this._get(this._url(`api/v1/accounts/${id}`))
    return response
  }

  /**
   * Get account followers
   * @param {string} id The ID of the account you want to get the followers of
   * @returns {Promise<object>} The response object
   */
  accountFollowersById(id) {
    const response = this._get(
      this._url(`api/v1/accounts/${id}/followers`)
    )
    return response
  }

  /**
   * Get account following
   * @param {string} id The ID of the account you want to get the following of
   * @returns {Promise<object>} The response object
   */
  accountFollowingById(id) {
    const response = this._get(
      this._url(`api/v1/accounts/${id}/following`)
    )
    return response
  }

  /**
   * Get account posts
   * @param {string} id The ID of the account you want to get the posts of
   * @returns {Promise<object>} The response object
   */
  accountStatusesById(id) {
    const response = this._get(
      this._url(`api/v1/accounts/${id}/statuses`)
    )
    return response
  }

  /**
   * Get node info
   * @returns {Promise<object>} The response object
   */
  nodeinfo() {
    const response = this._get(this._url('api/nodeinfo/2.0.json'))
    return response
  }

  /**
   * Search query
   * @param {string} query The query you want to search
   * @returns {Promise<object>} The response object
   */
  accountSearch(query) {
    const response = this._get(
      this._url(`api/v1/accounts/search?q=${query}`)
    )
    return response
  }

  /**
   * Get your blocks
   * @returns {Promise<object>} The response object
   */
  accountBlocks() {
    const response = this._get(this._url('api/v1/blocks'))
    return response
  }

  /**
   * Get your favourites
   * @returns {Promise<object>} The response object
   */
  accountLikes() {
    const response = this._get(this._url('api/v1/favourites'))
    return response
  }

  /**
   * Get your follow requests
   * @returns {Promise<object>} The response object
   */
  accountFollowRequests() {
    const response = this._get(this._url('api/v1/follow_requests'))
    return response
  }

  /**
   * Get the info about the instance
   * @returns {Promise<object>} The response object
   */
  instance() {
    const response = this._get(this._url('api/v1/instance'))
    return response
  }

  /**
   * Get your mutes
   * @returns {Promise<object>} The response object
   */
  accountMutes() {
    const response = this._get(this._url('api/v1/mutes'))
    return response
  }

  /**
   * Get your notifications
   * @returns {Promise<object>} The response object
   */
  accountNotifications() {
    const response = this._get(this._url('api/v1/notifications'))
    return response
  }

  /**
   * Get your timeline
   * @returns {Promise<object>} The response object
   */
  homeTimeline() {
    const response = this._get(this._url('api/v1/timelines/home'))
    return response
  }

  /**
   * Get the public timeline
   * @returns {Promise<object>} The response object
   */
  publicTimeline() {
    const response = this._get(this._url('api/v1/timelines/public'))
    return response
  }

  /**
   * Get a status
   * @param {string} id The ID of the status you want to get
   * @returns {Promise<object>} The response object
   */
  statusById(id) {
    const response = this._get(this._url(`api/v1/statuses/${id}`))
    return response
  }

  /**
   * Get who reblogged a status
   * @param {string} id The ID of the status you want to get the rebloggers of
   * @returns {Promise<object>} The response object
   */
  statusRebloggedById(id) {
    const response = this._get(
      this._url(`api/v1/statuses/${id}/reblogged_by`)
    )
    return response
  }

  /**
   * Get who favoureted a status
   * @param {string} id The ID of the status you want to get the favourites of
   * @returns {Promise<object>} The response object
   */
  statusLikedById(id) {
    const response = this._get(
      this._url(`api/v1/statuses/${id}/favourited_by`)
    )
    return response
  }

  /**
   * Follow an account
   * @param {string} id The ID of the account you want to follow
   * @returns {Promise<object>} The response object
   */
  followAccountById(id) {
    const response = this._post(
      this._url(`api/v1/accounts/${id}/follow`)
    )
    return response
  }

  /**
   * Unfollow an account
   * @param {string} id The ID of the account you want to unfollow
   * @returns {Promise<object>} The response object
   */
  unfollowAccountById(id) {
    const response = this._post(
      this._url(`api/v1/accounts/${id}/unfollow`)
    )
    return response
  }

  /**
   * Block an account
   * @param {string} id The ID of the account you want to block
   * @returns {Promise<object>} The response object
   */
  accountBlockById(id) {
    const response = this._post(this._url(`api/v1/accounts/${id}/block`))
    return response
  }

  /**
   * Unblock an account
   * @param {string} id The ID of the account you want to unblock
   * @returns {Promise<object>} The response object
   */
  accountUnblockById(id) {
    const response = this._post(
      this._url(`api/v1/accounts/${id}/unblock`)
    )
    return response
  }

  /**
   * Favourite a status
   * @param {string} id The ID of the status you want to favourite
   * @returns {Promise<object>} The response object
   */
  statusFavouriteById(id) {
    const response = this._post(
      this._url(`api/v1/statuses/${id}/favourite`)
    )
    return response
  }

  /**
   * Unfavourite a status
   * @param {string} id The ID of the status you want to unfavourite
   * @returns {Promise<object>} The response object
   */
  statusUnfavouriteById(id) {
    const response = this._post(
      this._url(`api/v1/statuses/${id}/unfavourite`)
    )
    return response
  }

  /**
   * Upload a status
   * @param {string} file The location of the file you want to upload
   * @returns {Promise<object>} The response object
   */
  mediaUpload(content) {
    const body = new FormData()
    body.append('file', new File([content], "tmp.jpg"), "tmp.jpg")

    const response = this._post(this._url('api/v1/media'), body, true)
    return response
  }

  /**
   * Mute an account
   * @param {string} id The ID of the account you want to mute
   * @returns {Promise<object>} The response object
   */
  accountMuteById(id) {
    const response = this._post(
      this._url(`api/v1/accounts/${id}/unmute`)
    )
    return response
  }

  /**
   * Unmute an account
   * @param {string} id The ID of the account you want to unmute
   * @returns {Promise<object>} The response object
   */
  accountUnmuteById(id) {
    const response = this._post(
      this._url(`api/v1/accounts/${id}/unmute`)
    )
    return response
  }

  /**
   *
   * @param {Array<number>} mediaIds An array of media ids
   * @param {string} [caption] The caption
   * @param {bool} [sensitive] Whether or not it's sensitive
   * @param {string} [scope] Must be private, unlisted or public
   * @param {number} [inReplyToId] The ID it replies to
   * @returns {Promise<object>} The response object
   */
  statusCreate(
    mediaIds,
    caption = null,
    sensitive = false,
    scope = 'public',
    inReplyToId = null
  ) {
    if (mediaIds.some(isNaN) || mediaIds.length === 0) {
      throw new Error('Invalid media_ids. Must be an array of integers.')
    }
    if (!['private', 'unlisted', 'public'].includes(scope)) {
      throw new Error('Invalid scope. Must be private, unlisted or public.')
    }
    const props = {
      media_ids: mediaIds,
      status: caption,
      in_reply_to_id: inReplyToId,
      sensitive: sensitive,
      visibility: scope
    }
    const response = this._post(this._url('api/v1/statuses'), props)
    return response
  }
}
